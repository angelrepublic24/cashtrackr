'use server'
import getToken from "@/src/auth/token"
import { Global } from "@/src/global/Global"
import { Budget, ConfirmPasswordSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type Props = {
    errors: string[],
    success: string
}
export async function deleteBudget(budgetId: Budget['id'], prevState: Props, formData: FormData){


    const currentPassword = ConfirmPasswordSchema.safeParse(formData.get('password'))

    if(!currentPassword.success){
        return {
            errors: currentPassword.error.issues.map(issue => issue.message),
            success: ''
        }
    }

    // Verify password	
    const token = getToken()
    const checkPasswordUrl = `${Global.url}/auth/check-password`;
    const checkPasswordRequest = await fetch(checkPasswordUrl, {
        method: 'POST',
        body: JSON.stringify({password: currentPassword.data}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    const checkPasswordData = await checkPasswordRequest.json()

    if(!checkPasswordRequest.ok){
        const {error} = ErrorResponseSchema.parse(checkPasswordData)
        return {
            errors: [error],
            success: ''
        }
    }

    const deleteBudgetUrl = `${Global.url}/budgets/${budgetId}`;
    const deleteRequest = await fetch(deleteBudgetUrl, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const deleteData = await deleteRequest.json()

    console.log(deleteData)
    if(!deleteRequest.ok){
        const {error} = ErrorResponseSchema.parse(deleteData)
        return {
            errors: [error],
            success: ''
        }
    }

    revalidatePath('/admin')
    const success = SuccessSchema.parse(deleteData)

    return {
        errors: [],
        success
    }

}
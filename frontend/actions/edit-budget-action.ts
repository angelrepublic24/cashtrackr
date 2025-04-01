'use server'

import getToken from "@/src/auth/token"
import { Global } from "@/src/global/Global"
import { Budget, DraftBudgetSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type Props = {
    errors: string[],
    success: string
}
export async function editBudget(budgetId: Budget['id'], prevState: Props, formData: FormData){

    const editBudgetInput = {
        name: formData.get('name'),
        amount: formData.get('amount'),
    }

    const budget = DraftBudgetSchema.safeParse(editBudgetInput);

    if(!budget.success){
        return {
            errors: budget.error.issues.map(issue => issue.message),
            success: ''
        }
    }

        const token = getToken()
        const url = `${Global.url}/budgets/${budgetId}`
        const request = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: budget.data.name,
                amount: budget.data.amount,
            })
        })

        const data = await request.json();

        if(!request.ok){
            const { error } = ErrorResponseSchema.parse(data);
            return {
                errors: [error],
                success: ''
            }
        }

        revalidatePath('/admin')
        const success = SuccessSchema.parse(data);


    return {
        errors: [],
        success
    }
}
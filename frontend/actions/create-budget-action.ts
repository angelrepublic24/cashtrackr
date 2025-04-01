'use server'
import getToken from "@/src/auth/token";
import { Global } from "@/src/global/Global";
import { DraftBudgetSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

type Props = {
    errors: string[],
    success: string

}

export async function createBudget(prevState: Props, formData: FormData){

    const budget = DraftBudgetSchema.safeParse({
        name: formData.get('name'),
        amount: formData.get('amount')
    });

    if(!budget.success){
        return{
            errors: budget.error.issues.map(issue => issue.message),
            success: ''
        }
    }


    // Create Budget
    const token = getToken()
    const url = `${Global.url}/budgets`
    const request = await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: budget.data.name,
            amount: budget.data.amount
        })
    })
    const data = await request.json();
    console.log(data)

    revalidatePath('/admin')
    const success = SuccessSchema.parse(data)

    return {
        errors: [],
        success
    }
}
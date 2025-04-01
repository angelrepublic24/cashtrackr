'use server'

import getToken from "@/src/auth/token"
import { Global } from "@/src/global/Global"
import { Budget, ErrorResponseSchema, DraftExpenseSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type Props = {
    errors: string[],
    success: string
}
export default async function createExpense(budgetId: Budget['id'], prevState: Props, formData: FormData){

    const expenseInput = {
        name: formData.get('name'),
        amount: formData.get('amount')
    }

    const expense =  DraftExpenseSchema.safeParse(expenseInput);

    if(!expense.success){
        return {
            errors: expense.error.issues.map(issue => issue.message),
            success: ''
        }
    }

     // Create Budget
        const token = getToken()
        const url = `${Global.url}/budgets/${budgetId}/expenses`
        const request = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: expense.data.name,
                amount: expense.data.amount
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

        const success = SuccessSchema.parse(data);
        revalidatePath(`admin/budgets/${budgetId}`)
        return {
            errors: [],
            success
        }

}
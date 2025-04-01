'use server'

import getToken from "@/src/auth/token"
import { Global } from "@/src/global/Global"
import { Budget, DraftBudgetSchema, DraftExpenseSchema, ErrorResponseSchema, Expense, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type BudgeAndExpense = {
    budgetId: Budget['id'],
    expenseId: Expense['id']
}
type Props = {
    errors: string[],
    success: string
}
export async function editExpense(
    {budgetId, expenseId}: BudgeAndExpense, 
    prevState: Props, 
    formData: FormData){

    const editExpenseInput = {
        name: formData.get('name'),
        amount: formData.get('amount'),
    }

    const expense = DraftExpenseSchema.safeParse(editExpenseInput);

    if(!expense.success){
        return {
            errors: expense.error.issues.map(issue => issue.message),
            success: ''
        }
    }

        const token = getToken()
        const url = `${Global.url}/budgets/${budgetId}/expenses/${expenseId}`
        const request = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: expense.data.name,
                amount: expense.data.amount,
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

        revalidatePath(`/admin/budgets/${budgetId}/expenses/${expenseId}`)
        const success = SuccessSchema.parse(data);


    return {
        errors: [],
        success
    }
}
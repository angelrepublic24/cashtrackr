"use server";

import getToken from "@/src/auth/token";
import { Global } from "@/src/global/Global";
import { Budget, ErrorResponseSchema, Expense, SuccessSchema } from "@/src/schemas";
import { revalidatePath } from "next/cache";

type Props = {
  errors: string[];
  success: string;
};

type BudgetAndExpenseProp = {
  budgetId: Budget["id"];
  expenseId: Expense["id"];
};

export default async function deleteExpense(
  { budgetId, expenseId }: BudgetAndExpenseProp,
  prevState: Props
) {
  const token = getToken();
  const url = `${Global.url}/budgets/${budgetId}/expenses/${expenseId}`;
  const request = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await request.json();
  if (!request.ok) {
    return {
      errors: [data.message],
      success: "",
    };
  }
  revalidatePath(`admin/budgets/${budgetId}`)
  const success = SuccessSchema.parse(data)


  return {
    errors: [],
    success
  };
}

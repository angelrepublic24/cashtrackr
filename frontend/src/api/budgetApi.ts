import { cache } from "react";
import getToken from "../auth/token";
import { Global } from "../global/Global";
import { notFound } from "next/navigation";
import { BudgetAPIResponseSchema } from "../schemas";

export const getBudget = cache(async (budgetId: string) => {
  const token = getToken();
  const url = `${Global.url}/budgets/${budgetId}`;
  const request = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await request.json();
  if (!request.ok) {
    notFound();
  }
  const budget = BudgetAPIResponseSchema.parse(data);
  return budget;
});

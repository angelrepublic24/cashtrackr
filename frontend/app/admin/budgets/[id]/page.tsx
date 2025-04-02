import ProgressBar from "@/components/budgets/ProgressBar";
import AddExpenseButton from "@/components/expenses/AddExpenseButton";
import ExpenseMenu from "@/components/expenses/ExpenseMenu";
import Amount from "@/components/ui/Amount";
import ModalContainer from "@/components/ui/ModalContainer";
import { getBudget } from "@/src/api/budgetApi";
import { formatCurrency, formatDate } from "@/src/utils";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const budget = await getBudget(params.id);
  return {
    title: `CashTrackr - ${budget.name}`,
    description: `View ${budget.name} budget`,
  };
}
export default async function BudgetDetailsPage({  params,}: {params: { id: string };}) {
  const budget = await getBudget(params.id);

  const totalSpent = budget.expense.reduce((total, expense) => +expense.amount + total, 0)
  const available = +budget.amount - totalSpent;
  const percentage = +((totalSpent / +budget.amount) * 100).toFixed(2);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-black text-4xl text-purple-950">{budget.name}</h1>
          <p className="text-xl font-bold">
            Manage your {""} <span className="text-amber-500">expenses</span>
          </p>
        </div>
        <AddExpenseButton />
      </div>
      {budget.expense.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-2">
            <div>
              <ProgressBar percentage={percentage} />
            </div>
            <div className="flex flex-col justify-center md: items-start gap-5">
              <Amount label={"Budget"} amount={+budget.amount}/>
              <Amount label={"Available"} amount={available}/>
              <Amount label={"Expense"} amount={totalSpent}/>

            </div>
          </div>
          <h1 className="font-black text-4xl text-purple-950 mt-10">
            Expenses included in this budget
          </h1>
          <ul
            role="list"
            className="divide-y divide-gray-300 border shadow-lg mt-10 "
          >
            {budget.expense.map((expense) => (
              <li key={expense.id} className="flex justify-between gap-x-6 p-5">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <p className="text-2xl font-semibold text-gray-900">{expense.name}</p>
                    <p className="text-xl font-bold text-amber-500">{formatCurrency(+expense.amount)}</p>
                    <p className="text-gray-500  text-sm">
                      Added: {''}
                      <span className="font-black">{formatDate(expense.updatedAt)}</span>
                    </p>
                  </div>
                </div>
                <ExpenseMenu expenseId={expense.id}/>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-center text-lg font-bold">
          No expenses found for this budget
        </p>
      )}
      <ModalContainer />
    </>
  );
}

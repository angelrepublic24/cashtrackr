import { DialogTitle } from "@headlessui/react";
import ExpenseForm from "./ExpenseForm";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { DraftExpense, Expense } from "@/src/schemas";
import { useFormState } from "react-dom";
import { editExpense } from "@/actions/edit-expense-action";
import { toast } from "react-toastify";

export default function EditExpenseForm({ closeModal }: { closeModal: () => void }) {

  const [expense, setExpense] = useState<DraftExpense>();
  const {id: budgetId} = useParams();
  const searchParams = useSearchParams();
  const expenseId = searchParams.get('editExpenseId')!;

  const editExpenseWithId = editExpense.bind(null, {
    budgetId: +budgetId,
    expenseId: +expenseId
  })
  const [state, dispatch] = useFormState(editExpenseWithId, {
    errors: [],
    success: ""
  })

  

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/api/budgets/${budgetId}/expenses/${expenseId}`;
    fetch(url)
        .then(res => res.json())
        .then(data => setExpense(data))
  }, [])

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach(error => {
        toast.error(error)
      })
      if(state.success) {
        toast.success(state.success)
        closeModal()
      }
    }
  }, [state])
  return (
    <>
      <DialogTitle
        as="h3"
        className="font-black text-4xl text-purple-950 my-5"
      >
        Editar Gasto
      </DialogTitle>
      <p className="text-xl font-bold">Edit the details of this {''}
        <span className="text-amber-500">expense</span>
      </p>
      <form
        className="bg-gray-100 shadow-lg rounded-lg p-10 mt-10 border"
        noValidate
        action={dispatch}
      >

        <ExpenseForm expense={expense} />

        <input
          type="submit"
          className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
          value='Update Expense'
        />
      </form>
    </>
  )
}
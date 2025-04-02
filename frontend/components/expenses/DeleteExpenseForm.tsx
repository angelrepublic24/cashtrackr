import deleteExpense from '@/actions/delete-expense-action';
import { DialogTitle } from '@headlessui/react';
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

type Props = {
  closeModal: () => void,
}
export default function DeleteExpenseForm({closeModal}: Props) {
  const {id: budgetId} = useParams();
  const searchParams = useSearchParams();
  const expenseId = searchParams.get('deleteExpenseId')!;

  const deleteExpenseWithId = deleteExpense.bind(null, {
    budgetId: +budgetId,
    expenseId: +expenseId,
  });
  const [state, dispatch] = useFormState(deleteExpenseWithId, {
    errors: [],
    success: '',
  });

  useEffect(() => {
    if(!Number.isInteger(+budgetId) || !Number.isInteger(+expenseId)){
      closeModal();
    }
  },[])

  useEffect(() => {

    if(state.errors){
      state.errors.forEach(error => {
        toast.error(error)
      })
    }
    if(state.success){
      toast.success(state.success)
      closeModal();
    }
  }, [state])

  return (
    <>
      <DialogTitle
        as="h3"
        className="font-black text-4xl text-purple-950 my-5"
      >
        Delete Expense
      </DialogTitle>
      <p className="text-xl font-bold">Confirm to delete {''}
        <span className="text-amber-500">the expense</span>
      </p>
      <p className='text-gray-600 text-sm'>(A deleted expense cannot be recovered)</p>
      <div className="grid grid-cols-2 gap-5 mt-10">
        <button
          className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
          onClick={closeModal}
        >Cancel</button>
        <button
          onClick={() => dispatch()}
          type='button'
          className="bg-red-500 w-full p-3 text-white uppercase font-bold hover:bg-red-600 cursor-pointer transition-colors"
        >Delete</button>
      </div>
    </>
  )
}

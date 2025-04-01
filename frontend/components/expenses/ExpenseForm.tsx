import { DraftExpense, Expense } from "@/src/schemas";

type Props = {
    expense?: DraftExpense
}
export default function ExpenseForm({expense}: Props) {
    return (
        <>
            <div className="mb-5">
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Expense' name
                </label>
                <input
                    id="name"
                    className="w-full p-3  border border-gray-100  bg-white"
                    type="text"
                    placeholder="Expense's name"
                    name="name"
                    defaultValue={expense?.name}
                />
            </div>

            <div className="mb-5">
                <label htmlFor="amount" className="text-sm uppercase font-bold">
                    Expense's amout
                </label>
                <input
                    id="amount"
                    className="w-full p-3  border border-gray-100 bg-white"
                    type="number"
                    placeholder="Expense's amout"
                    name="amount"
                    defaultValue={expense?.amount}
                />
            </div>
        </>
    )
}
import { createRequest, createResponse } from "node-mocks-http"
import Expense from "../../../models/Expense"
import { ExpenseValidation } from "../../../middlewares/ExpenseValidation"
import { expenses } from "../../mocks/expenses"
import Validator from "../../../middlewares/BudgetValidation"
import { budgets } from "../../mocks/budgets"



jest.mock('../../../models/Expense', () => ({
    findByPk: jest.fn(),
}))
describe('Expenses Middleware - ValidateExpensesExists', () => {
    beforeEach(() => {
        (Expense.findByPk as jest.Mock).mockImplementation((id) => {
            const expense = expenses.filter(e => e.id === id)[0] ?? null
            return Promise.resolve(expense)
        })
    })
    it ('should handle a non-existent budget', async () => {
        const req = createRequest({
            params: {expenseId: 120}
        })

        const res = createResponse()
        const next = jest.fn()

        await ExpenseValidation.validateExpenseExist(req, res, next)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(404)
        expect(data).toEqual({message: "Expense not found"});
        expect(next).not.toHaveBeenCalled()
    })

    it ('should call next middleware if expense exist', async () => {
        const req = createRequest({
            params: {expenseId: 1}
        })

        const res = createResponse()
        const next = jest.fn()

        await ExpenseValidation.validateExpenseExist(req, res, next)
        
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
        expect(req.expense).toBe(expenses[0])
    })

    it ('should handle internal server error', async () => {
        (Expense.findByPk as jest.Mock).mockRejectedValue(new Error ('something went wrong'))
        const req = createRequest({
            params: {expenseId: 1}
        })

        const res = createResponse()
        const next = jest.fn()

        await ExpenseValidation.validateExpenseExist(req, res, next)
        
        const data = res._getJSONData()
        expect(next).not.toHaveBeenCalled()
        expect(res.statusCode).toBe(500)
        expect(data).toEqual({message: "Error creating expense", error: "something went wrong"})
    })

    it('should prevent unauthorize user from adding expense', async () => {

        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            body: {name: 'Test', amount: 100},
            budget: budgets[0],
            user: {id: 120}
        })
        const res = createResponse()
        const next = jest.fn()

        Validator.hasAccess(req, res, next)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(401)
        expect(data).toEqual({message: "Action no valid"})
        expect(next).not.toHaveBeenCalled()
    })
})
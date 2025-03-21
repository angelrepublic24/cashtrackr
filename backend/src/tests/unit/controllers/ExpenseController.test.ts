import { createRequest, createResponse } from "node-mocks-http"
import { ExpenseController } from "../../../controllers/ExpenseController"
import Expense from "../../../models/Expense"


jest.mock('../../../models/Expense', () => ({
    create: jest.fn()
}))

describe('ExpenseController.create', () => {
    it('It should create a new expense', async () => {
        const expenseMock = {
            save: jest.fn().mockResolvedValue(true)
        };

        (Expense.create as jest.Mock).mockResolvedValue(expenseMock);
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            body: { name: 'Test expense', amount: 100 },
            budget: { id: 1 }
        })

        const res = createResponse()
        await ExpenseController.create(req, res)
        const data = res._getJSONData()

        expect(res.statusCode).toBe(201);
        expect(data).toEqual('Expense added successfully')
    })
})
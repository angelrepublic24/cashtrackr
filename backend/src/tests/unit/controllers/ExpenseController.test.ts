import { createRequest, createResponse } from "node-mocks-http"
import { ExpenseController } from "../../../controllers/ExpenseController"
import Expense from "../../../models/Expense"
import { expenses } from "../../mocks/expenses"


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
        expect(expenseMock.save).toHaveBeenCalled()
        expect(expenseMock.save).toHaveBeenCalledTimes(1)
        expect(Expense.create).toHaveBeenCalledWith(req.body)

    })

    it('It should return a error ', async () => {
        const expenseMock = {
            save: jest.fn()
        };

        (Expense.create as jest.Mock).mockRejectedValue(new Error);
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            body: { name: 'Test expense', amount: 100 },
            budget: { id: 1 }
        })

        const res = createResponse()
        await ExpenseController.create(req, res)
        const data = res._getJSONData()

        expect(res.statusCode).toBe(500);
        expect(data).toEqual({error: 'Error creating'})
        expect(expenseMock.save).not.toHaveBeenCalled()
        expect(Expense.create).toHaveBeenCalledWith(req.body)

    })
})

describe('ExpenseController.getById', () => {
    it('It should get an expense by id', async () => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: expenses[0]
        })
        const res = createResponse()
        await ExpenseController.getById(req, res)
        const data = res._getJSONData()

        expect(res.statusCode).toBe(200)
        expect(data).toEqual(expenses[0])
    })
})

describe('ExpenseController.update', () => {
    it('It should update an expense by id', async () => {

        const expenseMock = {
            ...expenses[0],
            update: jest.fn().mockResolvedValue(true)
        };

        const req = createRequest({
            method: 'PATCH',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: expenseMock,
            body: {name: "Rent", amount: "1500"}
        })
        const res = createResponse()
        await ExpenseController.update(req, res)
        const data = res._getJSONData()

        expect(res.statusCode).toBe(200)
        expect(data).toEqual({message: "Expense updated"})
        expect(expenseMock.update).toHaveBeenCalled()
        expect(expenseMock.update).toHaveBeenCalledTimes(1)
    })
})

describe('ExpenseController.delete', () => {
    it('It should get an remove a expense by id', async () => {

        const expenseMock = {
            ...expenses[0],
            destroy: jest.fn().mockResolvedValue(true)
        };

        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            expense: expenseMock,
        })
        const res = createResponse()
        await ExpenseController.remove(req, res)
        const data = res._getJSONData()

        expect(res.statusCode).toBe(200)
        expect(data).toEqual({message: "Expense has been deleted!"})
        expect(expenseMock.destroy).toHaveBeenCalled()
        expect(expenseMock.destroy).toHaveBeenCalledTimes(1)
    })
})
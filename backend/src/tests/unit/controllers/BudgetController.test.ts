import {createRequest, createResponse} from 'node-mocks-http'
import { budgets } from '../../mocks/budgets';
import { BudgetController } from '../../../controllers/BudgetController'
import Budget from '../../../models/Budget'
import Expense from '../../../models/Expense';

jest.mock('../../../models/Budget', () => ({
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
}))
describe('BudgetController.getAll', () => {

    beforeEach(() => {
        (Budget.findAll as jest.Mock).mockReset();
        (Budget.findAll as jest.Mock).mockImplementation((options) => {
            const updateBudgets = budgets.filter(budget => budget.userId === options.where.userId);
            return Promise.resolve(updateBudgets);
            

        })
    })
    it('should  retrive 3 budgets for user with ID 11',  async () => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {id: 1}
        })
        const res = createResponse();
       await BudgetController.getAll(req, res);

       const data = res._getJSONData()
       expect(data.budgets).toHaveLength(2);
       expect(res.statusCode).toBe(200)
       expect(res.status).not.toBe(404)

    })

    it('should  retrive 2 budgets for user with ID 12',  async () => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {id: 2}
        })
        const res = createResponse();

       await BudgetController.getAll(req, res);

       const data = res._getJSONData()
       console.log(data)
       expect(data.budgets).toHaveLength(1);
       expect(res.statusCode).toBe(200)
       expect(res.status).not.toBe(404)

    })

    it('should handle errors when fetching budgets', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {id: 100}
        })

        const res = createResponse();
        (Budget.findAll as jest.Mock).mockRejectedValue(new Error('database Error'))
        await BudgetController.getAll(req, res)

        expect(res.statusCode).toBe(500)
        expect(res._getJSONData()).toStrictEqual({error: "database Error", message: "Error getting budget"});

    })
})

describe('BudgetController.create', () => {
    it('should create a new budget for user with ID 1', async () => {
        const mockBudget = {
            save: jest.fn().mockResolvedValue(true)
        };

        (Budget.create as jest.Mock).mockResolvedValue(mockBudget)
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets',
            body: {name: 'Nuevo presupuesto', amount: 300},
            user: {id: 1}
        })

        const res = createResponse();
        await BudgetController.create(req, res)

        const data = res._getJSONData();

        expect(res.statusCode).toBe(201)
        expect(mockBudget.save).toHaveBeenCalled()
        expect(mockBudget.save).toHaveBeenCalledTimes(1)
        expect(Budget.create).toHaveBeenCalledWith(req.body)
    })

    it('should handle budget creation error', async () => {

        const mockBudget = {
            save: jest.fn()
        };

        (Budget.create as jest.Mock).mockRejectedValue(new Error("Something went wrong"))
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets',
            body: {name: 'Nuevo presupuesto', amount: 300},
            user: {id: 1}
        })

        const res = createResponse();
        await BudgetController.create(req, res)

        const data = res._getJSONData();

        expect(res.statusCode).toBe(500)
        expect(data).toEqual({error: 'Something went wrong', message:'Error creating budget'})
        expect(mockBudget.save).not.toHaveBeenCalled()

    })
})

describe('BudgetController.getByID', () => {

    beforeEach(() => {
        (Budget.findByPk as jest.Mock).mockImplementation((id) => {
            const budget = budgets.filter(b => b.id === id);
            return Promise.resolve(budget[0])
        })
    })
    it('should return a budget with id 1 and 3 expenses', async() => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:id',
            budget: {id: 1}
        })

        const res = createResponse();
        await BudgetController.getByID(req, res)

        const data = res._getJSONData()
        console.log(data)
        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(3)
        expect(Budget.findByPk).toHaveBeenCalled()
        expect(Budget.findByPk).toHaveBeenCalledTimes(1)
        expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {include: [Expense]})
    })

    it('should return a budget with id 2 and 2 expenses', async() => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:id',
            budget: {id: 2}
        })

        const res = createResponse();
        await BudgetController.getByID(req, res)

        const data = res._getJSONData()
        console.log(data)
        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(2)
    })

    it('should return a budget with id 3 and 0 expenses', async() => {

        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:id',
            budget: {id: 3}
        })

        const res = createResponse();
        await BudgetController.getByID(req, res)

        const data = res._getJSONData()
        console.log(data)
        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(0)
        
    })
})

describe('BudgetController.update', () => {

    it('should update the budget and return a success message', async() => {
        const budgetMock = {
            update : jest.fn().mockResolvedValue(true)
        }

        const req = createRequest({
            method: 'PATCH',
            url: '/api/budgets/:budgetId',
            body: {name: 'Nuevo nombre', amount: 350},
            budget: budgetMock
        })

        const res = createResponse();
        await BudgetController.update(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toBe("Budget updated")
        expect(budgetMock.update).toHaveBeenCalled()
        expect(budgetMock.update).toHaveBeenCalledTimes(1)
        expect(budgetMock.update).toHaveBeenCalledWith(req.body)


    })
})

describe('BudgetController.remove', () => {

    it('should delete the budget and return a success message', async() => {
        const budgetMock = {
            destroy : jest.fn().mockResolvedValue(true)
        }

        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId',
            budget: budgetMock
        })

        const res = createResponse();
        await BudgetController.remove(req, res)

        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toBe("Budget has been deleted!")
        expect(budgetMock.destroy).toHaveBeenCalled()
        expect(budgetMock.destroy).toHaveBeenCalledTimes(1)


    })
})

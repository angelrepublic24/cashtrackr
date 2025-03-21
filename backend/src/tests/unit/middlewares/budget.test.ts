import { createRequest, createResponse } from "node-mocks-http";
import Validator from "../../../middlewares/BudgetValidation";
import Budget from "../../../models/Budget";
import { budgets } from '../../mocks/budgets';

jest.mock('../../../models/Budget', () => ({
    findByPk: jest.fn()
}))

describe('Budget Middlewaare - ValidateBudgetExist', () => {
    it('should handle no existent budget', async() => {
        (Budget.findByPk as jest.Mock).mockResolvedValue(null)

        const req = createRequest({
            params: {
                budgetId: 1
            }
        });

        const res = createResponse()
        const next = jest.fn()

        await  Validator.ValidateBudgetExist(req, res, next) 
        const data = res._getJSONData()

        expect(res.statusCode).toBe(404);
        expect(data).toEqual({message: "Budget not found"});
        expect(next).not.toHaveBeenCalled();
    })

    it('should handle error on budget', async() => {
        (Budget.findByPk as jest.Mock).mockRejectedValue(new Error('Something went wrong'))

        const req = createRequest({
            params: {
                budgetId: 1
            }
        });

        const res = createResponse()
        const next = jest.fn()

        await  Validator.ValidateBudgetExist(req, res, next) 
        const data = res._getJSONData()

        expect(res.statusCode).toBe(500);
        expect(data).toEqual({
            error: "Something went wrong",
            message: "Error creating budget"
        });
        expect(next).not.toHaveBeenCalled();
    })
    it('Should handle  an exist budget', async() => {
        (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0]);

        const req = createRequest({
            params: {
                budgetId: 1
            }
        });
        const res = createResponse()
        const next = jest.fn()

        await Validator.ValidateBudgetExist(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(req.budget).toBe(budgets[0]);

    })
})


describe('Budget Middleware - HasAccess', () => {
    it('should call next() if user has access to budget', () => {
        const req = createRequest({
            budget: budgets[0],
            user: {id: 1}
        });

        const res = createResponse()
        const next = jest.fn()

         Validator.hasAccess(req, res, next) 

        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)

    })

    it('should return 401 if user doesnt have access to budget', () => {
        const req = createRequest({
            budget: budgets[0],
            user: {id: 2}
        });

        const res = createResponse()
        const next = jest.fn()

         Validator.hasAccess(req, res, next) 

        expect(res.statusCode).toBe(401)
        expect(res._getJSONData()).toEqual({message: "Action no valid"})
        expect(next).not.toHaveBeenCalled()

    })
})

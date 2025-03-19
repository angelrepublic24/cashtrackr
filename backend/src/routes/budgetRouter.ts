import { NextFunction, Router, Request, Response } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { validationResult } from "express-validator";
import Validator from "../middlewares/BudgetValidation";
import { ExpenseController } from "../controllers/ExpenseController";
import { ExpenseValidation } from "../middlewares/ExpenseValidation";
import AuthValidator from "../middlewares/AuthValidation";

const router = Router();

router.use(AuthValidator.VerifyToken)

router.param('budgetId', Validator.BudgetId)
router.param('budgetId', Validator.ValidateBudgetExist)
router.param('budgetId', Validator.hasAccess)


router.param('expenseId', ExpenseValidation.validateExpenseId);
router.param('expenseId', ExpenseValidation.validateExpenseExist)



export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors: errors.array()});
        return
    }
    next();
}


router.get('/', BudgetController.getAll);
router.post('/', Validator.BudgetValidation(), handleInputErrors, BudgetController.create)
router.get('/:budgetId', BudgetController.getByID)
router.patch('/:budgetId', BudgetController.update)
router.delete('/:budgetId', BudgetController.remove)

/** Routes for Expense */

router.post('/:budgetId/expenses', ExpenseValidation.expenseInputValidation, handleInputErrors, ExpenseController.create)
router.get('/:budgetId/expenses/:expenseId', ExpenseController.getById)
router.patch('/:budgetId/expenses/:expenseId', ExpenseValidation.expenseInputValidation, handleInputErrors, ExpenseController.update)
router.delete('/:budgetId/expenses/:expenseId', ExpenseController.remove)





export default router;
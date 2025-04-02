"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInputErrors = void 0;
const express_1 = require("express");
const BudgetController_1 = require("../controllers/BudgetController");
const express_validator_1 = require("express-validator");
const BudgetValidation_1 = __importDefault(require("../middlewares/BudgetValidation"));
const ExpenseController_1 = require("../controllers/ExpenseController");
const ExpenseValidation_1 = require("../middlewares/ExpenseValidation");
const AuthValidation_1 = __importDefault(require("../middlewares/AuthValidation"));
const router = (0, express_1.Router)();
router.use(AuthValidation_1.default.VerifyToken);
router.param('budgetId', BudgetValidation_1.default.BudgetId);
router.param('budgetId', BudgetValidation_1.default.ValidateBudgetExist);
router.param('budgetId', BudgetValidation_1.default.hasAccess);
router.param('expenseId', ExpenseValidation_1.ExpenseValidation.validateExpenseId);
router.param('expenseId', ExpenseValidation_1.ExpenseValidation.validateExpenseExist);
router.param('expenseId', ExpenseValidation_1.ExpenseValidation.BelongsToBudget);
const handleInputErrors = (req, res, next) => {
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.handleInputErrors = handleInputErrors;
router.get('/', BudgetController_1.BudgetController.getAll);
router.post('/', BudgetValidation_1.default.BudgetValidation(), exports.handleInputErrors, BudgetController_1.BudgetController.create);
router.get('/:budgetId', BudgetController_1.BudgetController.getByID);
router.patch('/:budgetId', BudgetController_1.BudgetController.update);
router.delete('/:budgetId', BudgetController_1.BudgetController.remove);
/** Routes for Expense */
router.post('/:budgetId/expenses', ExpenseValidation_1.ExpenseValidation.expenseInputValidation, exports.handleInputErrors, ExpenseController_1.ExpenseController.create);
router.get('/:budgetId/expenses/:expenseId', ExpenseController_1.ExpenseController.getById);
router.patch('/:budgetId/expenses/:expenseId', ExpenseValidation_1.ExpenseValidation.expenseInputValidation, exports.handleInputErrors, ExpenseController_1.ExpenseController.update);
router.delete('/:budgetId/expenses/:expenseId', ExpenseController_1.ExpenseController.remove);
exports.default = router;
//# sourceMappingURL=budgetRouter.js.map
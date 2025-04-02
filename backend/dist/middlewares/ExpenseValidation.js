"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseValidation = void 0;
const express_validator_1 = require("express-validator");
const Expense_1 = __importDefault(require("../models/Expense"));
class ExpenseValidation {
    static expenseInputValidation = async (req, res, next) => {
        await (0, express_validator_1.body)("name")
            .notEmpty()
            .withMessage("Expense's name is required")
            .run(req);
        await (0, express_validator_1.body)("amount")
            .notEmpty()
            .withMessage("Expense's amount is required")
            .isNumeric()
            .withMessage("Expense's amount is not valid")
            .custom((value) => value > 0)
            .withMessage("Expense's amount must be more than zero")
            .run(req);
        next();
    };
    static validateExpenseId = async (req, res, next) => {
        await (0, express_validator_1.param)("expenseId")
            .isInt()
            .custom((value) => value > 0)
            .withMessage("Id is not valid")
            .run(req);
        let errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    };
    static validateExpenseExist = async (req, res, next) => {
        try {
            const { expenseId } = req.params;
            const expense = await Expense_1.default.findByPk(expenseId);
            if (!expense) {
                res.status(404).json({ message: "Expense not found" });
                return;
            }
            req.expense = expense;
            next();
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                error: error.message,
                message: "Error creating expense",
            });
        }
    };
    static BelongsToBudget = async (req, res, next) => {
        if (req.budget.id !== req.expense.budgetId) {
            res.status(403).json({ message: 'Action not allowed' });
            return;
        }
        next();
    };
}
exports.ExpenseValidation = ExpenseValidation;
//# sourceMappingURL=ExpenseValidation.js.map
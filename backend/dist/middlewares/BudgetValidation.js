"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const Budget_1 = __importDefault(require("../models/Budget"));
class Validator {
    static BudgetValidation() {
        return [
            (0, express_validator_1.body)("name").notEmpty().withMessage("Budget's name is required"),
            (0, express_validator_1.body)("amount")
                .notEmpty()
                .withMessage("Budget's amount is required")
                .isNumeric()
                .withMessage("Budget's amount is not valid")
                .custom((value) => value > 0)
                .withMessage("Budget's amount must be more than zero"),
        ];
    }
    static async BudgetId(req, res, next) {
        await (0, express_validator_1.param)("budgetId").isInt().withMessage("Budget's id must be a number")
            .custom((value) => value > 0).withMessage("Budget's id not valid").run(req);
        let errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    }
    static async ValidateBudgetExist(req, res, next) {
        try {
            const { budgetId } = req.params;
            const budget = await Budget_1.default.findByPk(budgetId);
            if (!budget) {
                res.status(404).json({ message: "Budget not found" });
                return;
            }
            req.budget = budget;
            next();
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                error: error.message,
                message: "Error creating budget",
            });
        }
    }
    static async hasAccess(req, res, next) {
        if (req.budget.userId !== req.user.id) {
            res.status(401).json({ message: "Action no valid" });
            return;
        }
        next();
    }
    static handleInputErrors(req, res, next) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
}
exports.default = Validator;
//# sourceMappingURL=BudgetValidation.js.map
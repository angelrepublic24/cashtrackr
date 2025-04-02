"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetController = void 0;
const Budget_1 = __importDefault(require("../models/Budget"));
const Expense_1 = __importDefault(require("../models/Expense"));
class BudgetController {
    static getAll = async (req, res) => {
        try {
            const budgets = await Budget_1.default.findAll({
                order: [["createdAt", "DESC"]],
                where: { userId: req.user.id },
            });
            res.json({
                budgets,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                error: error.message,
                message: "Error getting budget",
            });
            return;
        }
    };
    static create = async (req, res) => {
        const { body } = req;
        try {
            const budget = await Budget_1.default.create(body);
            budget.userId = req.user.id;
            await budget.save();
            res.status(201).json("Budget created successfully");
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                error: error.message,
                message: "Error creating budget",
            });
            return;
        }
    };
    static getByID = async (req, res) => {
        const budget = await Budget_1.default.findByPk(req.budget.id, {
            include: [Expense_1.default]
        });
        res.json(budget);
    };
    static update = async (req, res) => {
        await req.budget.update(req.body);
        res.json("Budget updated");
        return;
    };
    static remove = async (req, res) => {
        await req.budget.destroy();
        res.json("Budget has been deleted!");
        return;
    };
}
exports.BudgetController = BudgetController;
//# sourceMappingURL=BudgetController.js.map
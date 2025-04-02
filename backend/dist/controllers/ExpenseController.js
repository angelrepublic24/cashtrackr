"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
class ExpenseController {
    static create = async (req, res) => {
        try {
            const expense = await Expense_1.default.create(req.body);
            expense.budgetId = req.budget.id;
            await expense.save();
            res.status(201).json('Expense added successfully');
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error creating' });
        }
    };
    static getById = async (req, res) => {
        res.json(req.expense);
        return;
    };
    static update = async (req, res) => {
        await req.expense.update(req.body);
        res.json("Expense updated");
    };
    static remove = async (req, res) => {
        await req.expense.destroy();
        res.json("Expense has been deleted!");
    };
}
exports.ExpenseController = ExpenseController;
//# sourceMappingURL=ExpenseController.js.map
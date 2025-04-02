import { NextFunction, Request, Response } from "express";
import Expense from "../models/Expense";
declare global {
    namespace Express {
        interface Request {
            expense?: Expense;
        }
    }
}
export declare class ExpenseValidation {
    static expenseInputValidation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    static validateExpenseId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    static validateExpenseExist: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    static BelongsToBudget: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

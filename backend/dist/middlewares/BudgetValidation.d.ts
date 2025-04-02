import { NextFunction, Response, Request } from "express";
import Budget from "../models/Budget";
declare global {
    namespace Express {
        interface Request {
            budget?: Budget;
        }
    }
}
declare class Validator {
    static BudgetValidation(): import("express-validator").ValidationChain[];
    static BudgetId(req: Request, res: Response, next: NextFunction): Promise<void>;
    static ValidateBudgetExist(req: Request, res: Response, next: NextFunction): Promise<void>;
    static hasAccess(req: Request, res: Response, next: NextFunction): Promise<void>;
    private static handleInputErrors;
}
export default Validator;

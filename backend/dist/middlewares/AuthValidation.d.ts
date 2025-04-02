import { NextFunction, Response, Request } from "express";
export default class AuthValidator {
    static validateCreateInput(req: Request, res: Response, next: NextFunction): Promise<void>;
    static validateEmailToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    static validateLoginInput(req: Request, res: Response, next: NextFunction): Promise<void>;
    static VerifyToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    static validateUpdatePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    static update(req: Request, res: Response, next: NextFunction): Promise<void>;
}

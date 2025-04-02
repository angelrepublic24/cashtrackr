import { Request, Response } from 'express';
export declare class ExpenseController {
    static create: (req: Request, res: Response) => Promise<void>;
    static getById: (req: Request, res: Response) => Promise<void>;
    static update: (req: Request, res: Response) => Promise<void>;
    static remove: (req: Request, res: Response) => Promise<void>;
}

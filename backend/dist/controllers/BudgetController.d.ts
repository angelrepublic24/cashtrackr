import { Request, Response } from "express";
export declare class BudgetController {
    static getAll: (req: Request, res: Response) => Promise<void>;
    static create: (req: Request, res: Response) => Promise<void>;
    static getByID: (req: Request, res: Response) => Promise<void>;
    static update: (req: Request, res: Response) => Promise<void>;
    static remove: (req: Request, res: Response) => Promise<void>;
}

import {Request, Response} from 'express'
import Expense from '../models/Expense';


export class ExpenseController {

    static create = async(req: Request, res: Response)=>{
        try {
            const expense = new Expense(req.body);
            expense.budgetId = req.budget.id
            await expense.save();
            res.status(201).json('Expense added successfully')
            return
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Error creating'})
        }
    }

    static getById = async(req: Request, res: Response)=>{
        res.json(req.expense);
        return
    }

    static update = async(req: Request, res: Response)=>{
        await req.expense.update(req.body);
        res.json({message: "Expense updated"});
    }

    static remove = async(req: Request, res: Response) =>{
        await req.expense.destroy();
        res.json({message: "Expense has beeen deleted!"})
    }
}



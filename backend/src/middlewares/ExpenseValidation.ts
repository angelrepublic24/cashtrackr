import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import Budget from "../models/Budget";
import Expense from "../models/Expense";


declare global {
      namespace Express {
            interface Request {
                  expense?: Expense 
            }
      }
}

export class ExpenseValidation {
  static expenseInputValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    await body("name")
      .notEmpty()
      .withMessage("Expense's name is required")
      .run(req);

    await body("amount")
      .notEmpty()
      .withMessage("Expense's amount is required")
      .isNumeric()
      .withMessage("Expense's amount is not valid")
      .custom((value) => value > 0)
      .withMessage("Expense's amount must be more than zero")
      .run(req);

    next();
  };

  static validateExpenseId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    await param("expenseId")
      .isInt()
      .custom((value) => value > 0)
      .withMessage("Id is not valid")
      .run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    next();
  };

  static validateExpenseExist = async(req: Request, res: Response, next: NextFunction) =>{
      try {
            const {expenseId} = req.params;
      
            const expense = await Expense.findByPk(expenseId);
            if (!expense) {
              res.status(404).json({ message: "Expense not found" });
              return
            }
      
            req.expense = expense;
            next()
          } catch (error) {
              console.log(error);
            res.status(500).json({
              error: error.message,
              message: "Error creating expense",
            });
          }
  }

  static BelongsToBudget = async (req: Request, res: Response, next: NextFunction) => {
    if(req.budget.id !== req.expense.budgetId){
      res.status(403).json({message: 'Action not allowed'})
      return;
    }

    next()
  }
}

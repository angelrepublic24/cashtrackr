import { NextFunction, Response, Request } from "express";
import { body, param, validationResult } from "express-validator";
import Budget from "../models/Budget";

declare global {
    namespace Express {
        interface Request {
            budget?: Budget
        }
    }
}

class Validator {
  static BudgetValidation() {
    return [
      body("name").notEmpty().withMessage("Budget's name is required"),

      body("amount")
        .notEmpty()
        .withMessage("Budget's amount is required")
        .isNumeric()
        .withMessage("Budget's amount is not valid")
        .custom((value) => value > 0)
        .withMessage("Budget's amount must be more than zero"),
        
    ];
  }

  static async BudgetId(req: Request, res: Response, next: NextFunction) {
    await param("budgetId").isInt().withMessage("Budget's id must be a number")
    .custom((value) => value > 0).withMessage("Budget's id not valid").run(req)

    let errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors: errors.array()});
        return
    }
    next();
  }

  static async ValidateBudgetExist(req: Request,res: Response,next: NextFunction) {
    try {
      const {budgetId} = req.params;

      const budget = await Budget.findByPk(budgetId);
      if (!budget) {
        res.status(404).json({ message: "Budget not found" });
        return
      }

      req.budget = budget;
      next()
    } catch (error) {
        console.log(error);
      res.status(500).json({
        error: error.message,
        message: "Error creating budget",
      });
    }
  }

  static async hasAccess(req: Request,res: Response,next: NextFunction){

    if(req.budget.userId !== req.user.id){
      res.status(401).json({message: "Action no valid"});
      return;
    }
    next()
  }

  private static handleInputErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
}

export default Validator;

import { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [["createdAt", "DESC"]],
        where: {userId: req.user.id},
      });
      res.json({
        budgets,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: error.message,
        message: "Error getting budget",
      });
      return;
    }
  };

  static create = async (req: Request, res: Response) => {
    const {body} = req;

    try {
      const budget = await Budget.create(body);
      budget.userId = req.user.id;

      await budget.save();
      res.status(201).json("Budget created successfully");
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: error.message,
        message: "Error creating budget",
      });
      return;
    }
  };

  static getByID = async (req: Request, res: Response) => {
    const budget = await Budget.findByPk(req.budget.id, {
      include: [Expense]
    })
    res.json(budget);
  };

  static update = async (req: Request, res: Response) => {
      await req.budget.update(req.body);
      res.json("Budget updated");
      return;
  };

  static remove = async (req: Request, res: Response) => {
      await req.budget.destroy();
      res.json("Budget has been deleted!");
      return;
  };
}

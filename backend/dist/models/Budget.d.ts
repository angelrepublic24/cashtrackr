import { Model } from 'sequelize-typescript';
import Expense from './Expense';
import User from './User';
declare class Budget extends Model {
    name: string;
    amount: number;
    expense: Expense[];
    userId: number;
    user: User;
}
export default Budget;

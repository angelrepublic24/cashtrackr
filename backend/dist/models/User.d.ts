import { Model } from "sequelize-typescript";
import Budget from "./Budget";
declare class User extends Model {
    name: string;
    email: string;
    password: string;
    token: string;
    confirmed: boolean;
    budget: Budget[];
}
export default User;

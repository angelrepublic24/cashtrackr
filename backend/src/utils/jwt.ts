import 'dotenv/config'
import { NextFunction, Response, Request } from 'express';
import jwt from'jsonwebtoken';
import User from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const createToken = (id: string) => {
    const token = jwt.sign({id}, process.env.SECRET_KEY,{expiresIn:'30d'});
    return token;
}

export const verifyToken = async (req: Request, res:Response, next:NextFunction) => {
    

}
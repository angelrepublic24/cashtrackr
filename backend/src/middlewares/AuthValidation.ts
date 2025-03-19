import { body } from "express-validator";
import { NextFunction, Response, Request } from "express";
import { handleInputErrors } from "./Validation";
import User from "../models/User";
import jwt from 'jsonwebtoken'






export default class AuthValidator{

    static async validateCreateInput(req: Request,res: Response,next: NextFunction){
        await body("name")
            .notEmpty().withMessage("The name cannot be empty").run(req);

        await body("email")
        .isEmail().withMessage("Email is not valid").run(req);
        await body("password")
        .isLength({min: 6}).withMessage("The password is too short, it must be at least 6 character").run(req);

        next()
    }

    static async validateEmailToken(req: Request,res: Response,next: NextFunction){
        await body("token").isLength({min: 6, max: 6}).withMessage("Token not valid").run(req);

        next()
    }

    static async validateLoginInput(req: Request,res: Response,next: NextFunction){
        await body("email").isEmail().withMessage('Email no valid').run(req);
        await body("password").notEmpty().withMessage('The password is required').run(req);

        next()
    }

    static async VerifyToken(req: Request,res: Response,next: NextFunction){
        const bearer = req.headers.authorization;

    if(!bearer){
        res.status(403).send({message: "Not authorized!"});
        return;
    }
    const [,token] = bearer.split(" ");

    if(!token){
        res.status(401).send({message: "The token is requierd!"});
        return;
    }

    try {
        const result = jwt.verify(token, process.env.SECRET_KEY);
        if(typeof result === 'object' && result.id){
            const user = await User.findByPk(result.id, {attributes: ["id", "name", "email"]});

            if(!user){
                res.status(401).json("User not found");
                return;
            }

            req.user = user;

            next();

        }
    } catch (error) {
        res.status(500).json({
            msg: 'The token is invalid',
            error
        })
    }
    }

    static async validateUpdatePassword(req: Request,res: Response,next: NextFunction){
        await body("current_password").notEmpty().withMessage("The currrent password can not be empty").run(req);
        await body("password").isLength({min: 6}).withMessage("The password must has at least 6 characters").run(req);

        next()
    }
}
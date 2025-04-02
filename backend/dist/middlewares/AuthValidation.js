"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthValidator {
    static async validateCreateInput(req, res, next) {
        await (0, express_validator_1.body)("name")
            .notEmpty()
            .withMessage("The name cannot be empty")
            .run(req);
        await (0, express_validator_1.body)("email").isEmail().withMessage("Email is not valid").run(req);
        await (0, express_validator_1.body)("password")
            .isLength({ min: 6 })
            .withMessage("The password is too short, it must be at least 6 character")
            .run(req);
        next();
    }
    static async validateEmailToken(req, res, next) {
        await (0, express_validator_1.body)("token")
            .isLength({ min: 6, max: 6 })
            .withMessage("Token not valid")
            .run(req);
        next();
    }
    static async validateLoginInput(req, res, next) {
        await (0, express_validator_1.body)("email").isEmail().withMessage("Email no valid").run(req);
        await (0, express_validator_1.body)("password")
            .notEmpty()
            .withMessage("The password is required")
            .run(req);
        next();
    }
    static async VerifyToken(req, res, next) {
        const bearer = req.headers.authorization;
        if (!bearer) {
            res.status(403).send({ message: "Not authorized!" });
            return;
        }
        const [, token] = bearer.split(" ");
        if (!token) {
            res.status(401).send({ message: "The token is requierd!" });
            return;
        }
        try {
            const result = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            if (typeof result === "object" && result.id) {
                const user = await User_1.default.findByPk(result.id, {
                    attributes: ["id", "name", "email"],
                });
                if (!user) {
                    res.status(401).json("User not found");
                    return;
                }
                req.user = user;
                next();
            }
        }
        catch (error) {
            res.status(500).json({
                msg: "The token is invalid",
                error,
            });
        }
    }
    static async validateUpdatePassword(req, res, next) {
        await (0, express_validator_1.body)("current_password")
            .notEmpty()
            .withMessage("The currrent password can not be empty")
            .run(req);
        await (0, express_validator_1.body)("password")
            .isLength({ min: 6 })
            .withMessage("The password must has at least 6 characters")
            .run(req);
        next();
    }
    static async update(req, res, next) {
        await (0, express_validator_1.body)("name")
            .notEmpty()
            .withMessage("The name cannot be empty")
            .optional()
            .run(req);
        await (0, express_validator_1.body)("email").isEmail().withMessage("Email is not valid").optional().run(req);
        next();
    }
}
exports.default = AuthValidator;
//# sourceMappingURL=AuthValidation.js.map
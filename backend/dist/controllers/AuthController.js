"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const bcrypt = __importStar(require("bcrypt"));
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    static create = async (req, res) => {
        try {
            const { body } = req;
            const user = new User_1.default(body);
            const userExist = await User_1.default.findOne({ where: { email: body.email } });
            if (userExist) {
                res.status(409).json({ error: "User exist already" });
                return;
            }
            const hashPassword = bcrypt.hashSync(body.password, 10);
            user.password = hashPassword;
            user.token = (0, token_1.generateToken)();
            await user.save();
            await AuthEmail_1.AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token,
            });
            res.json("User created");
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error creating" });
        }
    };
    static confirmAccount = async (req, res) => {
        const { token } = req.body;
        const user = await User_1.default.findOne({ where: { token } });
        if (!user) {
            const error = new Error("Token is not valid");
            res.status(401).json({ error: error.message });
            return;
        }
        user.confirmed = true;
        user.token = null;
        await user.save();
        res.json("Email has been confirmed!");
        return;
    };
    static login = async (req, res) => {
        try {
            const { body } = req;
            const user = await User_1.default.findOne({ where: { email: body.email } });
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            if (!user.confirmed) {
                res.status(403).json({ error: "This account is not confirmed" });
                return;
            }
            const isMatch = bcrypt.compareSync(body.password, user.password);
            if (!isMatch) {
                res.status(401).send({ error: "Email or password is not correct" });
                return;
            }
            const token = (0, jwt_1.createToken)(user.id);
            res.json({
                user,
                token
            });
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    };
    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User_1.default.findOne({ where: { email } });
            if (!user) {
                res.status(404).json({ error: "user not found" });
            }
            user.token = (0, token_1.generateToken)();
            await user.save();
            await AuthEmail_1.AuthEmail.sendPasswordResetToken({
                name: user.name,
                email: user.email,
                token: user.token
            });
            res.json("Check you email to reset your password");
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    };
    static validateToken = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExist = await User_1.default.findOne({ where: { token } });
            if (!tokenExist) {
                res.status(404).send({ error: "The token is not validated!" });
                return;
            }
            res.json("Token has been valided");
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    };
    static resetPasswordWithToken = async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const user = await User_1.default.findOne({ where: { token } });
            if (!user) {
                res.status(404).send({ error: "The token is not valid!" });
                return;
            }
            user.password = await bcrypt.hash(password, 10);
            user.token = null;
            await user.save();
            res.json("The password has been modified!");
            return;
        }
        catch (error) {
            res.status(500).send({ error });
            return;
        }
    };
    static user = async (req, res) => {
        res.json(req.user);
        return;
    };
    static updateCurrentUserPassword = async (req, res) => {
        try {
            const { current_password, password } = req.body;
            const { id } = req.user;
            const user = await User_1.default.findByPk(id);
            if (!bcrypt.compareSync(current_password, user.password)) {
                const error = new Error("The password is incorrect");
                res.status(401).json({ error: error.message });
                return;
            }
            user.password = bcrypt.hashSync(password, 10);
            await user.save();
            res.json("Password updated!");
            return;
        }
        catch (error) {
            res.status(500).send({ error });
            return;
        }
    };
    static checkPassword = async (req, res) => {
        try {
            const { password } = req.body;
            const { id } = req.user;
            const user = await User_1.default.findByPk(id);
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                res.status(401).json({ error: "The password is incorrect" });
                return;
            }
            res.json("The password has been verified");
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    };
    static update = async (req, res) => {
        const { name, email } = req.body;
        try {
            const existingUser = await User_1.default.findOne({ where: { email } });
            if (existingUser && existingUser.id !== req.user.id) {
                const error = new Error('This email is not available');
                res.status(409).json({ error: error.message });
                return;
            }
            await User_1.default.update({ name, email }, { where: { id: req.user.id } });
            res.json("User updated!");
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
            return;
        }
    };
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map
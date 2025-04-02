"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (id) => {
    const token = jsonwebtoken_1.default.sign({ id }, process.env.SECRET_KEY, { expiresIn: '30d' });
    return token;
};
exports.createToken = createToken;
const verifyToken = async (req, res, next) => {
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map
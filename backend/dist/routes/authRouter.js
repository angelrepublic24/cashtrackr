"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const AuthValidation_1 = __importDefault(require("../middlewares/AuthValidation"));
const Validation_1 = require("../middlewares/Validation");
const express_validator_1 = require("express-validator");
const limit_1 = require("../config/limit");
const router = (0, express_1.Router)();
router.use(limit_1.limiter);
router.post('/create-account', AuthValidation_1.default.validateCreateInput, Validation_1.handleInputErrors, AuthController_1.default.create);
router.post('/confirm-account', AuthValidation_1.default.validateEmailToken, Validation_1.handleInputErrors, AuthController_1.default.confirmAccount);
router.post('/login', AuthValidation_1.default.validateLoginInput, Validation_1.handleInputErrors, AuthController_1.default.login);
router.post('/forgot-password', (0, express_validator_1.body)("email").isEmail().withMessage("email no valid"), Validation_1.handleInputErrors, AuthController_1.default.forgotPassword);
router.post('/validate-token', AuthValidation_1.default.validateEmailToken, Validation_1.handleInputErrors, AuthController_1.default.validateToken);
router.post('/reset-password/:token', (0, express_validator_1.body)("password").isLength({ min: 6 }).withMessage("Password is not valid"), Validation_1.handleInputErrors, AuthController_1.default.resetPasswordWithToken);
router.get('/user', AuthValidation_1.default.VerifyToken, AuthController_1.default.user);
router.post('/update-password', AuthValidation_1.default.VerifyToken, AuthValidation_1.default.validateUpdatePassword, Validation_1.handleInputErrors, AuthController_1.default.updateCurrentUserPassword);
router.post('/check-password', AuthValidation_1.default.VerifyToken, (0, express_validator_1.body)("password").notEmpty().withMessage("Password is not valid"), Validation_1.handleInputErrors, AuthController_1.default.checkPassword);
router.patch('/update-account', AuthValidation_1.default.VerifyToken, AuthController_1.default.update);
exports.default = router;
//# sourceMappingURL=authRouter.js.map
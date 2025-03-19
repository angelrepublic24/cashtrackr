import {Router} from 'express';
import AuthController from '../controllers/AuthController';
import AuthValidator from '../middlewares/AuthValidation';
import { handleInputErrors } from '../middlewares/Validation';
import { body } from 'express-validator';
import { limiter } from '../config/limit';
import { verifyToken } from '../utils/jwt';


const router = Router();
router.use(limiter)


router.post('/create-account', AuthValidator.validateCreateInput, handleInputErrors, AuthController.create);
router.post('/confirm-account', AuthValidator.validateEmailToken, handleInputErrors, AuthController.confirmAccount);
router.post('/login', AuthValidator.validateLoginInput, handleInputErrors, AuthController.login);
router.post('/forgot-password', body("email").isEmail().withMessage("email no valid"), handleInputErrors, AuthController.forgotPassword);
router.post('/validate-token', AuthValidator.validateEmailToken, handleInputErrors, AuthController.validateToken);
router.post('/reset-password/:token', body("password").isLength({min: 6}).withMessage("Password is not valid"), handleInputErrors, AuthController.resetPasswordWithToken);
router.get('/user', AuthValidator.VerifyToken, AuthController.user);
router.post('/update-password', AuthValidator.VerifyToken, AuthValidator.validateUpdatePassword, handleInputErrors, AuthController.updateCurrentUserPassword);
router.post('/check-password', AuthValidator.VerifyToken, body("password").notEmpty().withMessage("Password is not valid"), handleInputErrors, AuthController.checkPassword);

export default router
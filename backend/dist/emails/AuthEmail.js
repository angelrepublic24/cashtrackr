"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
class AuthEmail {
    static sendConfirmationEmail = async (user) => {
        const email = await nodemailer_1.transport.sendMail({
            from: "CashTrackr <admin@cashtrackr.com>",
            to: user.email,
            subject: 'CashTrackr - Confirm your account',
            html: `
                <p>Hello ${user.name}, You have created an account in CashTrackr, it's almost ready</p>
                <p>Please visit this link: </p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm Account</a>
                <p>Insert the token: <b>${user.token}</b></p>
            `
        });
        console.log('Email has been sent', email.messageId);
    };
    static sendPasswordResetToken = async (user) => {
        const email = await nodemailer_1.transport.sendMail({
            from: "CashTrackr <admin@cashtrackr.com>",
            to: user.email,
            subject: 'CashTrackr - Reset Password',
            html: `
                <p>Hello ${user.name}, You have requested to change your password in CashTrackr, it's almost ready</p>
                <p>Please visit this link: </p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reset password</a>
                <p>Insert the token: <b>${user.token}</b></p>
            `
        });
        console.log('Email has been sent', email.messageId);
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmail.js.map
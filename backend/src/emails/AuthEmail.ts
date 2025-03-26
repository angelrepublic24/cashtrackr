import { transport } from "../config/nodemailer"

type EmailType = {
    name: string
    email: string
    token: string
}
export class AuthEmail{
    static sendConfirmationEmail = async(user: EmailType) => {
        const email = await transport.sendMail({
            from: "CashTrackr <admin@cashtrackr.com>",
            to: user.email,
            subject: 'CashTrackr - Confirm your account',
            html: `
                <p>Hello ${user.name}, You have created an account in CashTrackr, it's almost ready</p>
                <p>Please visit this link: </p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm Account</a>
                <p>Insert the token: <b>${user.token}</b></p>
            `
        })
        console.log('Email has been sent', email.messageId)
    }

    static sendPasswordResetToken = async(user: EmailType) => {
        const email = await transport.sendMail({
            from: "CashTrackr <admin@cashtrackr.com>",
            to: user.email,
            subject: 'CashTrackr - Reset Password',
            html: `
                <p>Hello ${user.name}, You have requested to change your password in CashTrackr, it's almost ready</p>
                <p>Please visit this link: </p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reset password</a>
                <p>Insert the token: <b>${user.token}</b></p>
            `
        })
        console.log('Email has been sent', email.messageId)
    }
}
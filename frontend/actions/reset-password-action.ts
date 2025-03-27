'use server'
import { Global } from "@/src/global/Global";
import { ErrorResponseSchema, ResetPasswordSchema, SuccessSchema } from "@/src/schemas"


type Props = {
    errors: string[],
    success: string
}
export async function resetPassword(token: string, prevState: Props, formData: FormData){
console.log(token)
    const resetPasswordInput = {
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation')
    }

    const resetPassword = ResetPasswordSchema.safeParse(resetPasswordInput);

    if(!resetPassword.success){
        return {
            errors: resetPassword.error.issues.map(issue => issue.message),
            success: ''
        }
    }

    const url = `${Global.url}/auth/reset-password/${token}`;
        const request = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({password: resetPasswordInput.password}),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await request.json();

        if(!request.ok){
            const {error} = ErrorResponseSchema.parse(data);
            return {
                errors: [error],
                success: ''
            }
        }

        const success = SuccessSchema.parse(data);


    return {
        errors: [],
        success
    }

}
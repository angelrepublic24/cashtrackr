'use server'

import { Global } from "@/src/global/Global";
import { ErrorResponseSchema, ForgotPasswordSchema, SuccessSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[],
    success: string
}

export async function forgotPassword(prevState: ActionStateType, formdata: FormData){


    const forgotPasswordData = ForgotPasswordSchema.safeParse({email: formdata.get('email')});

    if(!forgotPasswordData.success){
        return {
            errors: forgotPasswordData.error.issues.map(issue => issue.message),
            success: ''
        }
    }

    const url = `${Global.url}/auth/forgot-password`;
    const request = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({email: forgotPasswordData.data.email}),
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await request.json();

    if(!request.ok){
        const {error} = ErrorResponseSchema.parse(data)
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
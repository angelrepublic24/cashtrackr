'use server'

import { Global } from "@/src/global/Global";
import { ErrorResponseSchema, SuccessSchema, TokenSchema } from "@/src/schemas";

type ActionStateType = {
    errors: string[],
    success: string
}
export async function confirmAccount(token: string, prevState: ActionStateType){
    
    const confirmToken = TokenSchema.safeParse(token);
    if(!confirmToken.success){
        return {
            errors: confirmToken.error.issues.map(issue => issue.message),
            success: ''
        }
    }

    // Confirm User
    const url = `${Global.url}/auth/confirm-account`
    const request = await fetch(url,{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            token: confirmToken.data
        })
    })

    const data = await request.json();

    if(!request.ok){
        const {error} = ErrorResponseSchema.parse(data);
        return {
            errors: [error],
            success: ''
        }
    }

    const success = SuccessSchema.parse(data)

    console.log(request);
    console.log(data);

    return {
        errors: [],
        success
    }
}
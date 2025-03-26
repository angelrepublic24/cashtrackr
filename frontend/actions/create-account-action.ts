'use server'

import { Global } from "@/src/global/Global";
import { ErrorResponseSchema, RegisterSchema, SuccessSchema } from "@/src/schemas"

type ActionStateType = {
    errors: string[],
    success: string
}
export async function register(prevState: ActionStateType, formData: FormData){

    const registerData = {
        email: formData.get('email'),
        name: formData.get('name'),
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation')
    }

    // Validate
    const register = RegisterSchema.safeParse(registerData)

    if(!register.success){
        const errors = register.error.errors.map(error => error.message);
        return {
            errors,
            success: prevState.success 
        }
    }

    // Save to DB or API
    const url = `${Global.url}/auth/create-account`
    const request = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: register.data.name,
            email: register.data.email,
            password: register.data.password
        })
    })
    console.log(request.status)
    const data = await request.json()
    if(request.status === 409){
        const {error} = ErrorResponseSchema.parse(data);
        return {
            errors: [error],
            success: ''
        }
    }
    const success = SuccessSchema.parse(data)
    return {
        errors: [],
        success
    }
}
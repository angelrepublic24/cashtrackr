'use server'

import { Global } from "@/src/global/Global";
import { RegisterSchema } from "@/src/schemas"

export async function register(formData: FormData){

    const registerData = {
        email: formData.get('email'),
        name: formData.get('name'),
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation')
    }

    // Validate
    const register = RegisterSchema.safeParse(registerData)
    const errors = register.error?.errors.map(error => error.message);

    if(!register.success){
        return {}
    }

    //
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

    const data = await request.json()
    console.log(data);
}
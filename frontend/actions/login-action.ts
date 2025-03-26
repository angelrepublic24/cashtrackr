'use server'
import { Global } from '@/src/global/Global'
import { LoginSchema } from '@/src/schemas'
import React from 'react'

type ActionStateType = {
    errors: string[],
    success: string
}

export default async function login(prevState: ActionStateType, formData: FormData) {
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const login = LoginSchema.safeParse(loginData);

    if(!login.success){
        const errors = login.error.errors.map(error => error.message);

        return {
            errors,
            success: prevState.success
        }
    }

     // Action Login
        const url = `${Global.url}/auth/login`
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: login.data.email,
                password: login.data.password
            })
        })
  return {
    errors: [],
    success: ''
  }
}

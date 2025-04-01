import 'server-only'
import { cookies } from "next/headers"
import { redirect } from "next/navigation";
import { UserSchema } from "../schemas";
import { cache } from "react";
import getToken from './token';


export const verifySession = cache( async () => {

    const token = getToken()

    if(!token) {
        redirect('/auth/login');
    }

    const url = `${process.env.API_URL}/auth/user`;
    const request = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    const session = await request.json();
    const result = UserSchema.safeParse(session);

    if(!result.success){
        redirect('/auth/login');
    }

    return {
        user: result.data,
        isAuth: true

    }
})
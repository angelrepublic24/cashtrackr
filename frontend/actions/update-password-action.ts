'use server'
import getToken from "@/src/auth/token"
import { Global } from "@/src/global/Global"
import { ChangePaswordSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"

type Props = {
    errors: string[],
    success: string
}


export default async function editPassword (prevState: Props, formData: FormData){

    const editPasswordForm = {
        current_password: formData.get('current_password'),
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation')
    }
    const password = ChangePaswordSchema.safeParse(editPasswordForm)
    if(!password.success){
        return {
            errors: password.error.issues.map(issue => issue.message),
            success: ''
        }
    }

    
            const token = getToken()
            const url = `${Global.url}/auth/update-password`
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_password: password.data.current_password,
                    password: password.data.password,
                })
            })
            const data = await request.json()
            console.log({request})

            console.log({data})

            if(!request.ok){
                const {error} = ErrorResponseSchema.parse(data)
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
import {z} from 'zod'


export const RegisterSchema = z.object({
    name: z.string().min(2, {message: "The name is required"} ),
    email: z.string().min(1, {message:"Email is required"}).email(),
    password: z.string().min(6, {message: "The password is too short, min 6 characters"}),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "The password don't match",
    path: ['password_confirmation']
} )
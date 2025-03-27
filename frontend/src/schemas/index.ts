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

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, {message: "The password is required"}),

})

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email()
})

export const ForgotPasswordSchema = z.object({
    email: z.string()   
            .email( {message: 'Email no válido'}),
})

export const ResetPasswordSchema = z.object({
    password: z.string()
            .min(6, {message: 'The password must be at least 6 characters'}),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: "The passwords do not match",
    path: ["password_confirmation"]
});

export type User = z.infer<typeof UserSchema>

export const SuccessSchema = z.string()
export const ErrorResponseSchema = z.object({
    error: z.string()
})

export const TokenSchema = z.string({message: 'Token no valid'})
                                    .length(6, {message: 'Token no valid'})

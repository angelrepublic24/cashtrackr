'use client'

import { useState } from "react"
import ValidateTokenForm from "./ValidateTokenForm"
import ResetPasswordForm from "./ResetPasswordForm"

export default function PasswordResetHandle() {
    const [isValidToken, setIsValidToken] = useState(false)
    const [token, setToken] = useState('');

  return (
    <>
    {!isValidToken ? 
    <ValidateTokenForm 
        token={token} 
        setToken={setToken} 
        setIsValidToken={setIsValidToken} 
    /> : 
    <ResetPasswordForm token={token}/>}
      
    </>
  )
}

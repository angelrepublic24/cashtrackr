'use client'

import { register } from "@/actions/create-account-action"
import { useFormState } from "react-dom"
import ErrorMessage from "../ui/ErrorMessage"
import SuccessMessage from "../ui/SuccessMessage"
import { useEffect, useRef } from "react"

export default function RegisterForm() {
  const ref = useRef<HTMLFormElement>(null)
  const [state, dispatch] = useFormState(register, {
    errors: [],
    success: ''
  })

  useEffect(() => {
    if(state.success){
      ref.current?.reset()
    }
  }, [state])

  return (
    <>
      <form ref={ref} className="mt-14 space-y-5" noValidate action={dispatch}>
        {state.errors.map(error => <ErrorMessage>{error}</ErrorMessage>)}
        {state.success && <SuccessMessage>{state.success}</SuccessMessage>}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-2xl" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-2xl">Name</label>
          <input
            type="name"
            placeholder="Name"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-2xl">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-2xl">Repeat Password</label>
          <input
            id="password_confirmation"
            type="password"
            placeholder="Repeat Password"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password_confirmation"
          />
        </div>

        <input
          type="submit"
          value="Sign up"
          className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer block"
        />
      </form>
    </>
  )
}

"use client"

import editPassword from "@/actions/update-password-action"
import { useEffect, useRef } from "react"
import { useFormState } from "react-dom"
import { toast } from "react-toastify"

export default function ChangePasswordForm() {

    const [state, dispatch] = useFormState(editPassword, {
        errors: [],
        success: '',
    })
    const ref = useRef<HTMLFormElement>(null)
    useEffect(() => {
      if(state.errors){
        state.errors.forEach(error => {
          toast.error(error)
        })
      }

      if(state.success){
        toast.success(state.success);
        ref.current?.reset()
      }
    }, [state])

  return (
    <>
      <form
        className=" mt-14 space-y-5"
        noValidate
        action={dispatch}
        ref={ref}
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-bold text-2xl"
            htmlFor="current_password"
          >Current Password</label>
          <input
            id="current_password"
            type="password"
            placeholder="Current password"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="current_password"
          />
        </div>
        <div className="flex flex-col gap-5">
          <label
            className="font-bold text-2xl"
            htmlFor="password"
          >New Password</label>
          <input
            id="password"
            type="password"
            placeholder="New password"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password"
          />
        </div>
        <div className="flex flex-col gap-5">
          <label
            htmlFor="password_confirmation"
            className="font-bold text-2xl"
          >Repeat New Password</label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repeat new password"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password_confirmation"
          />
        </div>

        <input
          type="submit"
          value='Update Password'
          className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
        />
      </form>
    </>
  )
}
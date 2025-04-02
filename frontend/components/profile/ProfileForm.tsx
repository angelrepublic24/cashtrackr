"use client"

import editProfile from "@/actions/edit-profile-action"
import {  User } from '../../src/schemas/index';
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";

export default function ProfileForm({user}: {user: User}) {
  const [ state, dispatch] = useFormState(editProfile, {
    errors: [],
    success: '',
  })

  useEffect(()=> {
    if(state.errors){
      state.errors.forEach(error => {
        toast.error(error)
      })
    }
    if(state.success){
      toast.success(state.success)
    }

  }, [state])

  return (
    <>
      <form
        className=" mt-14 space-y-5"
        noValidate
        action={dispatch}
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-bold text-2xl"
          >Name</label>
          <input
            type="name"
            placeholder="Name"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="name"
            defaultValue={user.name}
          />
        </div>
        <div className="flex flex-col gap-5">
          <label
            className="font-bold text-2xl"
          >Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="email"
            defaultValue={user.email}
          />
        </div>

        <input
          type="submit"
          value='Save'
          className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
        />
      </form>
    </>
  )
}
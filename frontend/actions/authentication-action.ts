"use server";
import { Global } from "@/src/global/Global";
import { ErrorResponseSchema, LoginSchema, SuccessSchema } from "@/src/schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

type ActionStateType = {
  errors: string[];
  success: string;
};

export default async function authentication(
  prevState: ActionStateType,
  formData: FormData
) {
  const authenticationCredentials = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const auth = LoginSchema.safeParse(authenticationCredentials);

  if (!auth.success) {
    const errors = auth.error.errors.map((issue) => issue.message);

    return {
      errors,
      success: prevState.success,
    };
  }

  // Action Login
  const url = `${Global.url}/auth/login`;
  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: auth.data.email,
      password: auth.data.password,
    }),
  });
  const data = await request.json();

  if (!request.ok) {
    const { error } = ErrorResponseSchema.parse(data);
    return { 
        errors: [error],
        success: prevState.success,
    };
  }

  // set Cookies

  cookies().set({
    name: 'CASHTRACKR_TOKEN',
    value: data.token,
    httpOnly: true,
    path: '/',
  })

  redirect('/admin');
}

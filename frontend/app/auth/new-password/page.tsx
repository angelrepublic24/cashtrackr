'use client'
import PasswordResetHandle from "@/components/auth/PasswordResetHandle";
import ValidateTokenForm from "@/components/auth/ValidateTokenForm";
import React from "react";

export default function NewPasswordpage() {
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">
        Reset your password
      </h1>
      <p className="text-3xl font-bold">
      Please enter the code you received {" "}
      <span className="text-amber-500"> by email</span>
      </p>

      <PasswordResetHandle/>
    </>
  );
}

import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Cashtrackr - Create Account',
  description: 'Create an account to start tracking your income and expenses',
}
export default function RegisterPage() {
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">Create Account</h1>
      <p className="text-3xl font-bold">
        and take control of your{" "}
        <span className="text-amber-500">finances</span>
      </p>
      <RegisterForm/>
      
    </>
  );
}

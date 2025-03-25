import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cashtrackr - Login to Cashtrackr",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">Login</h1>
      <p className="text-3xl font-bold">
        and take control of your{" "}
        <span className="text-amber-500">finances</span>
      </p>{" "}
      <LoginForm />
      <nav className="mt-10 flex flex-col space-y-4">
        <Link className="text-center text-gray-500" href={'register'}>Don't have an account yet?, Create one</Link>
        <Link className="text-center text-gray-500" href={'forgot-password'}>Did you forget your password? Click here to reset it.</Link>

      </nav>

    </>
  );
}

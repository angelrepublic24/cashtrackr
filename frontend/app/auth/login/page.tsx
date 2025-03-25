import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

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
    </>
  );
}

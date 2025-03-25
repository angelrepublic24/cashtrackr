import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">Forgot your password?</h1>
      <p className="text-3xl font-bold">
        Reset it {" "}
        <span className="text-amber-500">here</span>
      </p>{" "}
      <ForgotPasswordForm />
    </>
  );
}

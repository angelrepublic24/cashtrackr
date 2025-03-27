import Link from "next/link";
import React from "react";

export default async function AdminPage() {
  return (
    <>
      <div className="flex flex-col-reverse md:flex-row md:justify-between items-center">
        <div className="w-full md:w-auto">
          <h1 className="font-black text-4xl text-purple-950 my-5">
            My Budgets
          </h1>
          <p className="text-xl font-bold">
            Handle and madange your {""}
            <span className="text-amber-500">budgets</span>
          </p>
        </div>
        <Link
          href={"/admin/budget/new"}
          className="bg-amber-500 p-2 rounded-lg text-white font-bold w-full md:w-auto text-center"
        >
          Create Budget
        </Link>
      </div>
    </>
  );
}

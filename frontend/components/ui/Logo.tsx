import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <Image
      src="/logo.svg"
      alt="Cashtrackr Logo"
      width={0}
      height={0}
      priority
      className="w-full"
    />
  );
}

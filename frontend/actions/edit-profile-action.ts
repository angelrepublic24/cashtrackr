"use server";

import getToken from "@/src/auth/token";
import { Global } from "@/src/global/Global";
import { EditProfileSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas";
import { revalidatePath } from "next/cache";

type Props = {
  errors: string[];
  success: string;
};

export default async function editProfile(
  prevState: Props,
  formData: FormData
) {
  const editProfileInput = {
    name: formData.get("name"),
    email: formData.get("email"),
  };
  const profile = EditProfileSchema.safeParse(editProfileInput);
  if (!profile.success) {
    return {
      errors: profile.error.issues.map((issue) => issue.message),
      success: "",
    };
  }

  const token = getToken();
  const url = `${Global.url}/auth/update-account`;
  const request = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: profile.data.name,
      email: profile.data.email,
    }),
  });

  const data = await request.json();
  if (!request.ok) {
    const {error} = ErrorResponseSchema.parse(data)
    return {
      errors: [error],
      success: "",
    };
  }

  revalidatePath('/admin/profile/settings')
  const success = SuccessSchema.parse(data);
  return {
    errors: [],
    success
  };
}

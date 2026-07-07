// src/app/actions/addPostAction.ts
"use server";

import { addPost } from "@/app/actions/addPost"; // your existing function

// This wrapper satisfies the form action signature (Promise<void>)
export async function addPostAction(formData: FormData): Promise<void> {
  // If your addPost already does a redirect on success, this is enough:
  await addPost(formData);

  // If your addPost *doesn't* redirect and instead returns { ok, id }:
  // const res = await addPost(formData);
  // if (!res?.ok) {
  //   // Throw to show a form-level error UI using useFormState if desired,
  //   // or handle however you like. Throwing will surface a 500 by default.
  //   throw new Error(res?.error ?? "Failed to submit post");
  // }
  // redirect(`/post-details/${res.id}`);
}

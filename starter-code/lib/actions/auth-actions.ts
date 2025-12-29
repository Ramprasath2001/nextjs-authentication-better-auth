"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "../auth";

/* ---------------- SIGN UP ---------------- */
export const signUp = async (
  email: string,
  password: string,
  name: string
) => {
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      callbackURL: "/dashboard",
    },
  });

  return result;
};

/* ---------------- SIGN IN ---------------- */
export const signIn = async (email: string, password: string) => {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
      callbackURL: "/dashboard",
    },
  });

  return result;
};

/* ---------------- SOCIAL SIGN IN ---------------- */
export const signInSocial = async (
  provider: "github" | "google"
) => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/dashboard",
    },
  });

  if (url) {
    redirect(url); // ✅ correct redirect
  }
};

/* ---------------- SIGN OUT ---------------- */
export const signOut= async () => { const result = await auth.api.signOut({headers: await headers()});

  return result;
};

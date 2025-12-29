"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signIn,
  signUp,
  signInSocial,
} from "@/lib/actions/auth-actions";

export default function AuthClientPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------------- SOCIAL AUTH ---------------- */
  const handleSocialAuth = async (
    provider: "google" | "github"
  ) => {
    setIsLoading(true);
    setError("");

    try {
      await signInSocial(provider);
    } catch (err) {
      setError(
        `Error authenticating with ${provider}: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- EMAIL AUTH ---------------- */
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isSignIn) {
        const result = await signIn(email, password);
        if (!result?.user) {
          setError("Invalid email or password");
        }
      } else {
        const result = await signUp(email, password, name);
        if (!result?.user) {
          setError("Error creating account");
        }
      }
    } catch (err) {
      setError(
        `Authentication error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignIn ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-600">
              {isSignIn
                ? "Sign in to your account to continue"
                : "Sign up to get started with better-auth"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Social Auth */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialAuth("google")}
              disabled={isLoading}
              className="w-full px-4 py-3 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialAuth("github")}
              disabled={isLoading}
              className="w-full px-4 py-3 border rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isSignIn && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg text-black"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg text-black"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg text-black"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isLoading
                ? isSignIn
                  ? "Signing in..."
                  : "Creating account..."
                : isSignIn
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center">
            <button
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError("");
                setName("");
              }}
              className="text-indigo-600 text-sm"
            >
              {isSignIn
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

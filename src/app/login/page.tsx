"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AppHeader from "../components/AppHeader/appHeader";
import AppFooter from "../components/AppFooter/appFooter";
import { useAuthStore } from "@/store/authStore"; // 👈 import

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: "", password: "" }); // 👈 email OR phone
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // { identifier, password }
      });

      const data = await res.json(); // read body once

      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }

      // store token + hydrate auth store
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        useAuthStore.getState().setAuth(data.token, data.user);
      }

      // redirect handling
      const redirectTo = localStorage.getItem("redirectAfterLogin");
      if (redirectTo) {
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectTo);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
          <p className="text-sm text-gray-500 mb-6">
            Access your account securely with your email or phone number.
          </p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email OR Phone */}
            <div>
              <Label
                htmlFor="identifier"
                className="text-sm mb-1 text-gray-700 block"
              >
                Email or phone number
              </Label>
              <Input
                id="identifier"
                name="identifier"
                type="text" // 👈 allow phone as well
                placeholder="e.g. you@example.com or +65 9123 4567"
                required
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Label
                htmlFor="password"
                className="text-sm mb-1 text-gray-700 block"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-9 right-3 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full text-lg font-medium"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => signIn("google")}
            >
              <FaGoogle /> Login with Google
            </Button>
          </div>
        </div>
      </div>
      <AppFooter />
    </>
  );
}

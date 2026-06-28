"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import PhoneNumberInput from "@/components/phone-number-input";
import { COUNTRIES, type Country } from "@/lib/data/countries";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

interface Props {
  googleData: { email: string; name: string; image: string };
}

export default function GoogleCompleteForm({ googleData }: Props) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [dialCode, setDialCode] = useState(() => COUNTRIES[0].dial.replace("+", ""));
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [locality, setLocality] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const phoneValid = phone.replace(/\D/g, "").length >= (country?.minLen ?? 6);
  const dobValid = !!dateOfBirth;
  const localityValid = locality.trim().length > 0;
  const formValid = phoneValid && dobValid && localityValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!formValid) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/google-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryNumber: `+${dialCode}${phone}`,
          dateOfBirth,
          locality: locality.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      if (data.user) {
        setAuth(null, data.user);
      }

      toast.success("Welcome to Lokalads!");

      const redirectTo = localStorage.getItem("redirectAfterLogin");
      if (redirectTo) {
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectTo);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6 py-10 bg-[url('/bg-market-place-vintage.png')] bg-cover bg-center bg-no-repeat">
      <section className="w-full max-w-sm">
        <Card className="shadow-[0_0_12px_rgba(0,0,0,0.45)] border-gray-200 rounded-2xl">
          <CardHeader className="pb-0 mb-3">
            <CardTitle className="text-lg font-semibold text-slate-800 tracking-tight mb-1">
              Complete your profile
            </CardTitle>
            <CardDescription className="text-sm tracking-tight">
              A few more details to finish setting up your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Google account (readonly) */}
              <Field>
                <FieldLabel>Google account</FieldLabel>
                <p className="text-sm font-semibold text-slate-900 bg-slate-100 rounded-md px-3 h-10 flex items-center truncate">
                  {googleData.email}
                </p>
              </Field>

              {/* Phone */}
              <Field>
                <FieldLabel>Phone number</FieldLabel>
                <PhoneNumberInput
                  value={phone}
                  onChange={(digits) => setPhone(digits)}
                  defaultCountry={country.code}
                  onCountryChange={(c) => {
                    setDialCode(c.dial);
                    const match = COUNTRIES.find((x) => x.code === c.code);
                    if (match) setCountry(match);
                  }}
                />
                {touched && !phoneValid && (
                  <p className="text-sm italic text-red-500">
                    Please enter a valid phone number.
                  </p>
                )}
              </Field>

              {/* Date of birth */}
              <Field>
                <FieldLabel>Date of birth</FieldLabel>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                />
                {touched && !dobValid && (
                  <p className="text-sm italic text-red-500">
                    Please enter your date of birth.
                  </p>
                )}
              </Field>

              {/* Locality */}
              <Field>
                <FieldLabel>Locality / City</FieldLabel>
                <Input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Lagos, Nairobi, Dubai..."
                />
                {touched && !localityValid && (
                  <p className="text-sm italic text-red-500">
                    Please enter your locality.
                  </p>
                )}
              </Field>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Complete registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

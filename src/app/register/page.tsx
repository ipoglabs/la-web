  "use client";

  import React, { useRef, useState } from "react";
  import { useRouter } from "next/navigation";
  import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
  import { toast } from "sonner";

  import { useRegisterStore } from "@/store/registerStore";
  import { generalInfoSchema, type GeneralInfoForm } from "@/lib/validators";

  import { Form } from "@/components/shadcn/form";
  import { Input } from "@/components/shadcn/input";
  import { Button } from "@/components/shadcn/button";
  import { DateInput } from "@/components/date-input";
  import { FormField } from "@/components/FormField";

  import { FormHelperText } from "@/components/FormHelperText";
  import { useMediaQuery } from "@/components/hooks/use-media-query";
  import AppHeader from "../components/AppHeader/appHeader";
  import AppFooter from "../components/AppFooter/appFooter";
  

  /* ---------- utils ---------- */
  function pad(n: number) {
    return String(n).padStart(2, "0");
  }
  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function fromISODate(s?: string) {
    if (!s) return undefined;
    const [y, m, d] = s.split("-").map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    return Number.isNaN(dt.getTime()) ? undefined : dt;
  }
  function calcAgeFromISO(dobISO?: string) {
    if (!dobISO) return;
    const today = new Date();
    const dob = fromISODate(dobISO);
    if (!dob) return;
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  const lettersOnlyRegex = /^[A-Za-z]+$/;

  function validateFullName(value: string) {
    const trimmed = (value ?? "").trim();
    if (!trimmed) return "Please enter your full name.";
    const parts = trimmed.split(/\s+/).filter(Boolean);
    for (const part of parts) {
      if (!lettersOnlyRegex.test(part))
        return "Only letters A–Z are allowed (no numbers or special characters).";
    }
    return "";
  }

  // ✅ Validate only fields present on this step
  const step1Schema = generalInfoSchema.pick({
    fullName: true,
    dateOfBirth: true,
    gender: true,
    email: true,
  });

  // tiny helper to merge classes
  function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
  }

  export default function GeneralInfoPage() {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);

 const {
  general,
  updateGeneral,
  emailVerified,
  setEmailVerified,
  verifiedEmail,
  setVerifiedEmail,
} = useRegisterStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkingEmail, setCheckingEmail] = useState(false);

    const isBelowLaptop = useMediaQuery("(max-width:1024px)");

    const clearError = (key: string) => {
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    };

    const setFieldError = (key: string, msg?: string) => {
      setErrors((prev) => {
        const next = { ...prev };
        if (msg) next[key] = msg;
        else delete next[key];
        return next;
      });
    };

    const [fullName, setFullName] = React.useState(general.fullName || "");

    const onSubmit = async (e?: React.FormEvent) => {
      e?.preventDefault();

      const dateOfBirth = general.dateOfBirth || "";
      const gender = general.gender || "";
      const email = (general.email || "").trim();

      const mappedErrors: Record<string, string> = {};

      const nameErr = validateFullName(fullName);
      if (nameErr) mappedErrors.fullName = nameErr;

      if (!dateOfBirth) {
        mappedErrors.dateOfBirth = "Please enter your date of birth.";
      } else if ((calcAgeFromISO(dateOfBirth) ?? 0) < 18) {
        mappedErrors.dateOfBirth = "Sorry — you need to be 18 or older to use Lokalads.";
      }

      if (!gender) mappedErrors.gender = "Please select a gender option.";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        mappedErrors.email = "Please enter your email address.";
      } else if (!emailRegex.test(email)) {
        mappedErrors.email = "Please enter a valid email address.";
      }

      const parsed = step1Schema.safeParse({
        fullName: fullName.trim(),
        dateOfBirth,
        gender,
        email,
      });

      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          const key = issue.path.join(".");
          if (!mappedErrors[key]) mappedErrors[key] = issue.message;
        });
      }

      if (Object.keys(mappedErrors).length > 0) {
        setErrors(mappedErrors);
        const firstErrorField = Object.keys(mappedErrors)[0];
        const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstErrorField}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        (el as HTMLElement | null)?.focus?.();
        toast.error("Please fix the highlighted fields.");
        return;
      }

      const nextEmail = email.toLowerCase();

      // Check email availability inline so a single click completes the whole flow
      setCheckingEmail(true);
      try {
        const res = await fetch("/api/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: nextEmail }),
        });
        const data = await res.json();
        if (data.exists) {
          setErrors({ email: "This email is already registered." });
          toast.error("Please fix the highlighted fields.");
          return;
        }
      } catch {
        // silently ignore — the server will catch it on submit
      } finally {
        setCheckingEmail(false);
      }

      if (verifiedEmail !== nextEmail) {
        setEmailVerified(false);
        setVerifiedEmail("");
      }

      updateGeneral({ fullName, dateOfBirth, gender, email: nextEmail });
      setErrors({});
      router.push("/register/email-verification");
    };

    return (
      <>
      <AppHeader />
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Step 1 — General Information</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              A few details to personalise your Lokalads experience.
            </p>
          </CardHeader>

          <CardContent>
            <Form onSubmit={onSubmit} ref={formRef} autoComplete="off">
              <h2 className="hidden text-3xl font-bold text-slate-800 mb-1">Step 1- General Information</h2>
              <p className="hidden text-lg font-light text-slate-700 mb-3">
                Lets get to know you, a few details to personalise your lokalads experience,
              </p>

              {/* Full Name */}
              <FormField
                label="Full Name"
                htmlFor="fullName"
                error={errors.fullName}
                showFocusWithin={!isBelowLaptop}
              >
                <Input
                  id="fullName"
                  name="fullName"
                  autoCorrect="off"
                  autoCapitalize="words"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFullName(val);
                    updateGeneral({ fullName: val });
                    clearError("fullName");
                  }}
                  onBlur={(e) => {
                    const val = e.target.value.trim();
                    setFullName(val);
                    updateGeneral({ fullName: val });
                    const msg = validateFullName(val);
                    setFieldError("fullName", msg || undefined);
                  }}
                  placeholder="e.g. Johnson Davis"
                  inputMode="text"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  className={cx(!!errors.fullName && "border-red-500 focus-visible:ring-red-500/20")}
                />
              </FormField>

              <FormHelperText className="mt-1 mb-4">Use your real name to build trust.</FormHelperText>

              {/* Date of Birth */}
              
              <FormField
                label="Date of Birth"
                htmlFor="dateOfBirth"
                error={errors.dateOfBirth}
                helperLabel="We need this to confirm you are 18+"
                showFocusWithin={!isBelowLaptop}
              >
                <DateInput
                  id="dateOfBirth"
                  value={general.dateOfBirth || ""}
                  onChange={(value) => {
                    updateGeneral({
                      dateOfBirth: value || "",
                    });

                    clearError("dateOfBirth");
                  }}
                  inputFormat="DMY"
                  separator="/"
                  blurDisplay="medium"   // ✅ Use Case 6
                  placeholder="DD / MM / YYYY"
                  autoComplete="bday"
                  error={errors.dateOfBirth}
                  className={cx(
                    !!errors.dateOfBirth &&
                      "border-red-500 focus-visible:ring-red-500/20"
                  )}
                />
              </FormField>

              {/* Gender */}
              <FormField label="Gender" htmlFor="gender" error={errors.gender} showFocusWithin={!isBelowLaptop}>
                <div className="flex flex-col gap-3 py-1">
                  {[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "prefer-not-to-say", label: "Prefer not to say" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-gray-800">
                      <input
                        type="radio"
                        name="gender"
                        value={opt.value}
                        checked={general.gender === opt.value}
                        onChange={(e) => {
                          updateGeneral({ gender: e.target.value as GeneralInfoForm["gender"] });
                          clearError("gender");
                        }}
                        className={cx(
                          "h-4 w-4 text-blue-600 border-gray-700/50 focus:ring-blue-500",
                          !!errors.gender && "ring-red-500"
                        )}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </FormField>

              {/* Email */}
              <FormField label="Email" htmlFor="email" error={errors.email} showFocusWithin={!isBelowLaptop}>
                <Input
                  id="email"
                  name="email"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  type="email"
                  value={general.email || ""}
                  onChange={(e) => {
                    updateGeneral({ email: e.target.value });
                    clearError("email");
                  }}
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    if (!value) {
                      setFieldError("email", "Please enter your email address.");
                      return;
                    }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                      setFieldError("email", "Please enter a valid email address.");
                      return;
                    }
                    clearError("email");
                  }}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={cx(
                    !!errors.email &&
                      "border-red-500 focus-visible:ring-red-500/20"
                  )}
                />
              </FormField>

              <Button type="submit" className="mt-4 w-full" disabled={checkingEmail}>
                {checkingEmail ? "Checking…" : "Next: Verify Email"}
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>
      <AppFooter />
      </>
    );
  }

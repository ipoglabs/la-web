"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, CheckCircle2, XCircle } from "lucide-react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

import { useRegisterStore } from "@/store/registerStore";
import { profileSchema } from "@/lib/validators";
import { useAuthStore } from "@/store/authStore";

import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { FormFieldWrapper } from "@/components/FormFieldWrapper";
import { FormHelperText } from "@/components/FormHelperText";
import { useMediaQuery } from "@/components/hooks/use-media-query";

const libraries: ("places")[] = ["places"];

/* -------------------------- Password helpers -------------------------- */
const COMMON_PASSWORDS = new Set([
  "password",
  "password1",
  "12345678",
  "qwerty",
  "letmein",
  "welcome",
  "admin123",
  "iloveyou",
  "abc12345",
  "123456789",
  "lokalads",
  "passw0rd",
]);

function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Za-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (COMMON_PASSWORDS.has(pw.toLowerCase())) score = 0;
  return Math.min(score, 5);
}

function strengthLabel(score: number) {
  if (score <= 1) return "Weak";
  if (score <= 3) return "Good";
  return "Strong";
}

const ROLES = [
  { key: "individual", label: "Individual" },
  { key: "business", label: "Business" },
  { key: "agency", label: "Agency" },
  { key: "other", label: "Other" },
] as const;

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------- Role validations -------------------------- */
// Role Title: min 2, max 80, allowed special chars: , | &
const ROLE_TITLE_REGEX = /^[A-Za-z\s,&|]+$/;

// Role Description: min 2, max 300, allowed special chars: . , | & and numbers allowed
const ROLE_DESC_REGEX = /^[A-Za-z0-9\s.,&|]+$/;

function validateRoleTitle(v: string) {
  const s = (v ?? "").trim();
  if (!s) return "Please enter a role title.";
  if (s.length < 2) return "Role title must be at least 2 characters.";
  if (s.length > 80) return "Role title must be at most 80 characters.";
  if (!ROLE_TITLE_REGEX.test(s)) return "Only letters, spaces, and ( , | & ) are allowed.";
  return "";
}

function validateRoleDescription(v: string) {
  const s = (v ?? "").trim();
  if (!s) return "Please describe how you plan to use Lokalads.";
  if (s.length < 2) return "Role description must be at least 2 characters.";
  if (s.length > 300) return "Role description must be at most 300 characters.";
  if (!ROLE_DESC_REGEX.test(s))
    return "Only letters, numbers, spaces, and ( . , | & ) are allowed.";
  return "";
}

export default function ProfileSetupPage() {
  const router = useRouter();
  const { general, emailVerified, phones, phoneVerified, profile, updateProfile, reset } =
    useRegisterStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  const [locationQuery, setLocationQuery] = useState(profile.locality || "");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);
  const isBelowLaptop = useMediaQuery("(max-width:1024px)");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const pwScore = useMemo(() => scorePassword(profile.password), [profile.password]);
  const pwLabel = strengthLabel(pwScore);
  const pwTooCommon = useMemo(
    () => Boolean(profile.password) && COMMON_PASSWORDS.has(profile.password.toLowerCase()),
    [profile.password]
  );

  const clearFieldError = (key: string) => {
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

  useEffect(() => {
    if (profile.locality && profile.locality !== locationQuery) {
      setLocationQuery(profile.locality);
    }
  }, [profile.locality, locationQuery]);

  const scrollToFirstError = (map: Record<string, string>) => {
    const order = [
      "locality",
      "password",
      "role",
      "roleTitle",
      "roleDescription",
      "consent",
    ];
    const first = order.find((k) => map[k]);
    if (!first) return;

    const root =
      formRef.current ||
      (typeof document !== "undefined"
        ? (document.querySelector("form") as HTMLFormElement | null)
        : null);

    const el =
      root?.querySelector<HTMLElement>(`[name="${first}"]`) ||
      root?.querySelector<HTMLElement>(`[data-field="${first}"]`);

    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  };

  /* -------------------- Google Places handlers -------------------- */
  const handlePlaceChanged = () => {
    const ac = autocompleteRef.current;
    if (!ac) return;

    const place = ac.getPlace();
    if (!place || !place.address_components) return;

    const components = place.address_components;

    const getComponent = (types: string[]) =>
      components.find((c) => types.some((t) => c.types.includes(t)))?.long_name || "";

    const district =
      getComponent(["administrative_area_level_2"]) ||
      getComponent(["locality"]) ||
      getComponent(["sublocality_level_1"]);

    const state = getComponent(["administrative_area_level_1"]);
    const country = getComponent(["country"]);

    const parts = [district, state, country].filter(Boolean);
    const localityStr = parts.join(", ");

    if (!localityStr) {
      const fallback = place.formatted_address || "";
      setLocationQuery(fallback);
      updateProfile({ locality: fallback });
      return;
    }

    setLocationQuery(localityStr);
    updateProfile({ locality: localityStr });
  };

  /* --------------------------- Submit handler --------------------------- */
  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const trimmed = {
      ...profile,
      password: (profile.password || "").trim(),
      locality: (locationQuery || "").trim(),
      roleTitle: (profile.roleTitle || "").trim(),
      roleDescription: (profile.roleDescription || "").trim(),
    };

    const parsed = profileSchema.safeParse(trimmed);

    const map: Record<string, string> = {};
    if (!parsed.success) {
      parsed.error.issues.forEach((i) => (map[i.path.join(".")] = i.message));
    }

    // extra friendly checks
    if (!trimmed.locality) {
      map.locality = "Please enter your locality.";
    } else if (trimmed.locality.length < 2) {
      map.locality = "Locality looks too short — please provide a bit more detail.";
    } else if (trimmed.locality.length > 80) {
      map.locality = "Locality is too long — keep it under 80 characters.";
    }

    if (pwTooCommon || pwScore <= 1) {
      map.password = "Try a longer password or add a symbol for better protection.";
    }

    if (!trimmed.role) {
      map.role = "Tell us how you’ll use Lokalads so we can tailor your experience.";
    }

    // ✅ UPDATED VALIDATIONS (other role) - as per your new rules
    if (trimmed.role === "other") {
      const titleMsg = validateRoleTitle(trimmed.roleTitle || "");
      if (titleMsg) map.roleTitle = titleMsg;

      const descMsg = validateRoleDescription(trimmed.roleDescription || "");
      if (descMsg) map.roleDescription = descMsg;
    }

    if (!consent) {
      map.consent = "We need your agreement to our Terms & Privacy Policy to create your account.";
    }

    if (Object.keys(map).length > 0) {
      setErrors(map);
      scrollToFirstError(map);
      toast.error("Please fix the highlighted fields");
      return;
    }

    if (!emailVerified) return toast.error("Please verify your email first");
    if (!phoneVerified) return toast.error("Please verify your phone first");

    setErrors({});
    setSubmitting(true);
console.log("PHONES STORE", phones);

    try {
      
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: general.fullName,
          dateOfBirth: general.dateOfBirth,
          gender: general.gender,
          residency: general.residency || undefined,
          nationality: general.nationality || undefined,
          email: general.email,
          country: general.country || undefined,
          state: general.state || undefined,

          primaryNumber: phones.primaryNumber,
          secondaryNumber1: phones.secondaryNumber1 || undefined,
          secondaryNumber2: phones.secondaryNumber2 || undefined,

          locality: trimmed.locality,
          password: trimmed.password,
          role: trimmed.role,
          roleTitle: trimmed.role === "other" ? trimmed.roleTitle : undefined,
          roleDescription: trimmed.role === "other" ? trimmed.roleDescription : undefined,

          subscribe,

          isTermsAndConditionAccepted: consent,
          isPrivacyAndPolicyAccepted: consent,
          isCookiesPolicyAccepted: consent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Registration failed");
        return;
      }

      toast.success("Registered successfully");

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        useAuthStore.getState().setAuth(data.token, data.user);
      }

      reset();
      router.push("/");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Step 4 — Profile Setup</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Create your account credentials and tell us where you’re located.
          </p>
        </CardHeader>

        <CardContent>
          <Form onSubmit={submit} ref={formRef}>
            {/* Locality */}
            <FormField
              label="Locality"
              htmlFor="locality"
              error={errors.locality}
              showFocusWithin={!isBelowLaptop}
            >
              <div className="mt-1 w-full">
                {isLoaded ? (
                  <Autocomplete
                    onLoad={(ac) => {
                      autocompleteRef.current = ac;
                    }}
                    onPlaceChanged={handlePlaceChanged}
                    options={{
                      fields: ["geometry", "formatted_address", "name", "address_components"],
                      types: ["geocode"],
                    }}
                  >
                    <input
                      name="locality"
                      type="text"
                      placeholder="Ex: Trichy, Tamil Nadu"
                      className={cx(
                        "w-full rounded-sm border-[1.5px] border-gray-700/50 bg-gray-50 p-2 text-base font-normal text-gray-900 placeholder:text-gray-400",
                        "focus-visible:bg-yellow-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        !!errors.locality && "border-red-500 focus-visible:ring-red-500/20"
                      )}
                      value={locationQuery}
                      onChange={(e) => {
                        const v = e.target.value;
                        setLocationQuery(v);
                        updateProfile({ locality: v });
                        clearFieldError("locality");
                      }}
                      aria-invalid={!!errors.locality}
                    />
                  </Autocomplete>
                ) : (
                  <Input
                    id="locality"
                    name="locality"
                    autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                    placeholder="e.g. Anna Nagar, Chennai"
                    className={cx("w-full", !!errors.locality && "border-red-500 focus-visible:ring-red-500/20")}
                    value={locationQuery}
                    onChange={(e) => {
                      const v = e.target.value;
                      setLocationQuery(v);
                      updateProfile({ locality: v });
                      clearFieldError("locality");
                    }}
                    aria-invalid={!!errors.locality}
                  />
                )}
              </div>
              <FormHelperText className="mt-1">
                Start typing and pick your area — we’ll store district, state and country.
              </FormHelperText>
            </FormField>

            {/* Password + Confirm */}
            <FormFieldWrapper
              className="grid grid-cols-1 md:grid-cols-2 md:gap-4 mt-6"
              showFocusWithin={!isBelowLaptop}
            >
              {/* Password */}
              <FormField
                label="Password"
                htmlFor="password"
                error={errors.password}
                className="mb-0"
                showFocusWithin={isBelowLaptop}
              >
                <div className="relative">
                 <Input
                    id="password"
                    name="password"
                    autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                    type={showPwd ? "text" : "password"}
                    placeholder="Create a secure password"
                    value={profile.password}
                    onChange={(e) => {
                      updateProfile({ password: e.target.value });
                      clearFieldError("password");
                    }}
                    onPaste={(e) => e.preventDefault()}   // ❌ disable paste
                    className={cx("pr-10", !!errors.password && "border-red-500 focus-visible:ring-red-500/20")}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((p) => !p)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>

                <FormHelperText className="mt-1">
                  At least 8 characters. Use numbers, letters and a symbol for extra strength.
                </FormHelperText>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={cx(
                          "h-1.5 w-8 rounded",
                          i < pwScore
                            ? pwScore >= 4
                              ? "bg-green-600"
                              : pwScore >= 2
                              ? "bg-yellow-500"
                              : "bg-red-500"
                            : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{pwLabel}</span>
                </div>
              </FormField>

              {/* Confirm Password — ✅ focus-out validation only */}
              {/* <FormField
                label="Confirm Password"
                htmlFor="confirmPassword"
                error={errors.confirmPassword}
                className="mb-0"
                showFocusWithin={isBelowLaptop}
              >
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPwd ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value); // ✅ no live validation
                      clearFieldError("confirmPassword");
                    }}
                    onPaste={(e) => e.preventDefault()}   // ❌ disable paste
                    onBlur={() => {
                      setConfirmTouched(true);
                      const msg = validateConfirmPassword(confirmPassword);
                      setFieldError("confirmPassword", msg || undefined);
                    }}
                    className={cx(
                      "pr-10",
                      !!errors.confirmPassword && "border-red-500 focus-visible:ring-red-500/20"
                    )}
                    aria-invalid={!!errors.confirmPassword}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd((p) => !p)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                    aria-label={showConfirmPwd ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPwd ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </FormField> */}
            </FormFieldWrapper>

            {/* Password checklist */}
            <div className="mt-3 space-y-1 pb-6 text-xs">
              {[
                { label: "At least 8 characters long", valid: profile.password.length >= 8 },
                { label: "At least 1 letter", valid: /[A-Za-z]/.test(profile.password) },
                { label: "At least 1 number", valid: /\d/.test(profile.password) },
                { label: "At least 1 special character", valid: /[^A-Za-z0-9]/.test(profile.password) },
                {
                  label: "Not your email",
                  valid:
                    profile.password.length > 0 &&
                    general.email &&
                    profile.password.toLowerCase() !== general.email.toLowerCase(),
                },
                {
                  label: "Not more than 24 characters long",
                  valid: profile.password.length > 0 && profile.password.length <= 24,
                },
              ].map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {rule.valid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <p className="text-slate-900">{rule.label}</p>
                </div>
              ))}
            </div>

            {/* Role */}
            <FormField
              label="Role"
              htmlFor="role"
              error={errors.role || errors.roleTitle || errors.roleDescription}
              showFocusWithin={!isBelowLaptop}
            >
              <p className="text-xs text-muted-foreground mt-1">
                Choose how you’ll use Lokalads — roles customise your dashboard and features.
              </p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLES.map((r) => {
                  const active = profile.role === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => {
                        updateProfile({ role: r.key });
                        clearFieldError("role");
                        if (r.key !== profile.role) {
                          updateProfile({ roleTitle: "", roleDescription: "" });
                          clearFieldError("roleTitle");
                          clearFieldError("roleDescription");
                        }
                      }}
                      className={cx(
                        "rounded-xl border p-4 text-left transition",
                        active ? "border-primary ring-2 ring-primary/30" : "border-input hover:bg-muted/40"
                      )}
                      aria-pressed={active}
                      name="role"
                    >
                      <div className="font-medium">{r.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {r.key === "individual" && "Personal buying/selling"}
                        {r.key === "business" && "Shops, SMBs and brands"}
                        {r.key === "agency" && "Manage listings for clients"}
                        {r.key === "other" && "Something else"}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Other role extra fields */}
              {profile.role === "other" && (
                <FormFieldWrapper className="mt-4 grid grid-cols-1 gap-3" showFocusWithin={!isBelowLaptop}>
                  <FormField
                    label="Role title"
                    htmlFor="roleTitle"
                    error={errors.roleTitle}
                    className="mb-0"
                    showFocusWithin={isBelowLaptop}
                  >
                    <Input
                      id="roleTitle"
                      name="roleTitle"
                      placeholder="e.g. Community Moderator, Freelancer, etc."
                      value={profile.roleTitle || ""}
                      maxLength={80}
                      onChange={(e) => {
                        updateProfile({ roleTitle: e.target.value }); // ✅ allow typing anything
                        clearFieldError("roleTitle");
                      }}
                      onBlur={(e) => {
                        const msg = validateRoleTitle(e.target.value);
                        setFieldError("roleTitle", msg || undefined);
                        updateProfile({ roleTitle: e.target.value.trim() });
                      }}
                      aria-invalid={!!errors.roleTitle}
                      className={cx(!!errors.roleTitle && "border-red-500 focus-visible:ring-red-500/20")}
                    />
                    <FormHelperText className="mt-1">
                      2–80 characters. Allowed special characters: ( , | & ).
                    </FormHelperText>
                  </FormField>

                  <FormField
                    label="Role description"
                    htmlFor="roleDescription"
                    error={errors.roleDescription}
                    className="mb-0"
                    showFocusWithin={isBelowLaptop}
                  >
                    <textarea
                      id="roleDescription"
                      name="roleDescription"
                      placeholder="Briefly describe how you plan to use Lokalads."
                      value={profile.roleDescription || ""}
                      maxLength={300}
                      onChange={(e) => {
                        updateProfile({ roleDescription: e.target.value }); // ✅ allow typing anything
                        clearFieldError("roleDescription");
                      }}
                      onBlur={(e) => {
                        const msg = validateRoleDescription(e.target.value);
                        setFieldError("roleDescription", msg || undefined);
                        updateProfile({ roleDescription: e.target.value.trim() });
                      }}
                      aria-invalid={!!errors.roleDescription}
                      className={cx(
                        "mt-1 w-full min-h-[80px] rounded-sm border-[1.5px] border-gray-700/50 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:bg-yellow-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1",
                        !!errors.roleDescription && "border-red-500 focus-visible:ring-red-500/20"
                      )}
                    />
                    <FormHelperText className="mt-1">
                      2–300 characters. Allowed special characters: ( . , | & ). Numbers allowed.
                    </FormHelperText>
                  </FormField>
                </FormFieldWrapper>
              )}
            </FormField>

            {/* Consent + marketing */}
            <FormField label="Consent" htmlFor="consent" error={errors.consent} showFocusWithin={!isBelowLaptop}>
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      clearFieldError("consent");
                    }}
                    name="consent"
                  />
                  <span>
                    I agree to the{" "}
                    <a
                      href="/legal/terms"
                      className="underline underline-offset-2"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Lokalads Terms &amp; Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/legal/privacy"
                      className="underline underline-offset-2"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>

                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={subscribe}
                    onChange={(e) => setSubscribe(e.target.checked)}
                    name="subscribe"
                  />
                  <span>Subscribe to product updates &amp; occasional offers</span>
                </label>
              </div>
            </FormField>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <Button variant="outline" type="button" onClick={() => router.push("/register/phone-verification")}>
                Back
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating…" : "Create Account"}
              </Button>
            </div>

            {/* status hints */}
            <div className="text-xs text-muted-foreground mt-3">
              {emailVerified ? "✅ Email verified" : "❌ Email not verified"}
              {" · "}
              {phoneVerified ? "✅ Phone verified" : "❌ Phone not verified"}
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

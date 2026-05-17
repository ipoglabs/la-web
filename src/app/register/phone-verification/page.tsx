"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  Check,
  Plus,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { PhoneNumberInput } from "@/components/phone-number-input/PhoneNumberInput";

import {
  type Country,
  COUNTRIES,
} from "@/components/phone-number-input/countries";

import { OtpInput } from "@/components/ui/otp-input";

import { useResendTimer } from "@/hooks/useResendTimer";
import { useRegisterStore } from "@/store/registerStore";

import { cn } from "@/lib/utils";

const MAX_NUMBERS = 3;

const LABELS = [
  "Primary",
  "Secondary 1",
  "Secondary 2",
] as const;

const MIN_DIGITS = 5;

const ALLOWED_COUNTRIES: string[] = [
  "SG",
  "IN",
  "GB",
];

type Stage =
  | "enter-phone"
  | "verify-otp"
  | "summary";

interface VerifiedEntry {
  country: Country;
  phone: string;
  label: (typeof LABELS)[number];
}

export default function PhoneVerificationPage() {
  const router = useRouter();
 const phones =
  useRegisterStore(
    (s) => s.phones
  );

const phoneVerified =
  useRegisterStore(
    (s) => s.phoneVerified
  );

  const [stage, setStage] =
    useState<Stage>("enter-phone");

  const [verified, setVerified] =
    useState<VerifiedEntry[]>([]);

  const [country, setCountry] =
    useState<Country>(
      () =>
        COUNTRIES.find(
          (c) => c.code === "SG"
        ) ?? COUNTRIES[0]
    );

  const [phone, setPhone] =
    useState("");

  const [phoneError, setPhoneError] =
    useState("");

  const [otpError, setOtpError] =
    useState(false);

  const [otpErrorMsg, setOtpErrorMsg] =
    useState("");

  const [verifying, setVerifying] =
    useState(false);

  const [
    confirmingDelete,
    setConfirmingDelete,
  ] = useState<number | null>(null);

  const {
    seconds,
    enabled,
    reset,
  } = useResendTimer(30);

  const phoneInputRef =
    useRef<HTMLInputElement>(null);

  /* ------------------------------------------------ */
  /* ENTER KEY SUBMIT                                */
  /* ------------------------------------------------ */

  useEffect(() => {
    const el = phoneInputRef.current;

    if (
      !el ||
      stage !== "enter-phone"
    )
      return;

    const handler = (
      e: KeyboardEvent
    ) => {
      if (e.key === "Enter") {
        handleSend();
      }
    };

    el.addEventListener(
      "keydown",
      handler
    );

    return () =>
      el.removeEventListener(
        "keydown",
        handler
      );
  }, [stage, phone]);

  /* ------------------------------------------------ */
  /* SEND OTP                                        */
  /* ------------------------------------------------ */

  async function handleSend() {
  const digits = phone.trim();

  if (!digits) {
    setPhoneError(
      "Please enter your phone number."
    );

    return;
  }

  const composed = `+${country.dial}${digits}`;

  // INDIA MOCK
  if (country.code === "IN") {
    setPhoneError("");

    toast.success(
      "Test mode (India). Use OTP: 111111"
    );

    reset();

    setStage("verify-otp");

    return;
  }

  setPhoneError("");

  try {
    const res = await fetch(
      "/api/sms/send-otp",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          phone: composed,
        }),
      }
    );

    const data =
      await res.json();

    if (res.ok) {
      reset();

      setStage("verify-otp");

      toast.success(
        "SMS OTP sent"
      );
    } else {
      setPhoneError(
        data?.error ||
          "Failed to send OTP"
      );
    }
  } catch {
    setPhoneError(
      "Failed to send OTP"
    );
  }
}

  /* ------------------------------------------------ */
  /* VERIFY OTP                                      */
  /* ------------------------------------------------ */
async function saveVerifiedPhone(
  fullPhone: string
) {
  const store =
    useRegisterStore.getState();

  const existing =
    store.phones;

  if (!existing.primaryNumber) {
    store.updatePhones({
      primaryNumber:
        fullPhone,
    });
  } else if (
    !existing.secondaryNumber1
  ) {
    store.updatePhones({
      secondaryNumber1:
        fullPhone,
    });
  } else if (
    !existing.secondaryNumber2
  ) {
    store.updatePhones({
      secondaryNumber2:
        fullPhone,
    });
  }

  store.setPhoneVerified(
    true
  );

  // WAIT FOR ZUSTAND PERSIST
  await new Promise(
    (resolve) =>
      setTimeout(resolve, 50)
  );

  console.log(
    "UPDATED STORE",
    useRegisterStore.getState()
      .phones
  );
}
async function handleOtpComplete(
  otp: string
) {
  setVerifying(true);

  try {
    /* -------------------------------------------- */
    /* INDIA MOCK                                  */
    /* -------------------------------------------- */

    if (country.code === "IN") {
      setTimeout(() => {
        setVerifying(false);

        if (otp === "111111") {

          const fullPhone = `+${country.dial}${phone}`;

          // ✅ SAVE PHONE
          saveVerifiedPhone(
  fullPhone
);

          // ✅ STORE VERIFIED UI STATE
          setVerified((prev) => [
            ...prev,
            {
              country,
              phone,
              label:
                LABELS[
                  prev.length
                ],
            },
          ]);

          toast.success(
            "Phone verified (test mode)"
          );

          // ✅ STAY ON PAGE
          setStage("summary");
        } else {
          setOtpError(true);

          setOtpErrorMsg(
            "Wrong code — expected 111111"
          );
        }
      }, 500);

      return;
    }

    /* -------------------------------------------- */
    /* REAL OTP                                    */
    /* -------------------------------------------- */

    const fullPhone = `+${country.dial}${phone}`;

    const res = await fetch(
      "/api/sms/verify-otp",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          phone: fullPhone,
          otp,
        }),
      }
    );

    const data =
      await res.json();

    setVerifying(false);

    if (res.ok) {

      // ✅ SAVE PHONE
     await saveVerifiedPhone(
  fullPhone
);

      // ✅ STORE VERIFIED UI STATE
      setVerified((prev) => [
        ...prev,
        {
          country,
          phone,
          label:
            LABELS[
              prev.length
            ],
        },
      ]);

      toast.success(
        "Phone verified ✅"
      );

      // ✅ STAY ON PAGE
      setStage("summary");
    } else {
      setOtpError(true);

      setOtpErrorMsg(
        data?.error ||
          "Incorrect code. Try again."
      );
    }
  } catch {
    setVerifying(false);

    setOtpError(true);

    setOtpErrorMsg(
      "Verification failed."
    );
  }
}
  /* ------------------------------------------------ */
  /* CLEAR OTP ERROR                                 */
  /* ------------------------------------------------ */

  const handleOtpErrorCleared =
    useCallback(() => {
      setOtpError(false);

      setOtpErrorMsg("");
    }, []);

  /* ------------------------------------------------ */
  /* ADD ANOTHER NUMBER                              */
  /* ------------------------------------------------ */

  function handleAddAnother() {
    setCountry(
      COUNTRIES.find(
        (c) => c.code === "SG"
      ) ?? COUNTRIES[0]
    );

    setPhone("");

    setPhoneError("");

    setOtpError(false);

    setOtpErrorMsg("");

    setConfirmingDelete(null);

    reset();

    setStage("enter-phone");
  }

  /* ------------------------------------------------ */
  /* CHANGE NUMBER                                   */
  /* ------------------------------------------------ */

  function handleChangeNumber() {
    setPhone("");

    setPhoneError("");

    setOtpError(false);

    setOtpErrorMsg("");

    setConfirmingDelete(null);

    setStage("enter-phone");
  }

  /* ------------------------------------------------ */
  /* DELETE NUMBER                                   */
  /* ------------------------------------------------ */

  function handleDelete(
    index: number
  ) {
    const updated =
      verified.filter(
        (_, i) => i !== index
      );

    setVerified(updated);

    setConfirmingDelete(null);

    if (
      updated.length === 0 &&
      stage === "summary"
    ) {
      setStage("enter-phone");
    }
  }

  /* ------------------------------------------------ */
  /* SUMMARY                                          */
  /* ------------------------------------------------ */

  if (stage === "summary") {
    const allDone =
      verified.length >=
      MAX_NUMBERS;

    return (
  <main className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-background">

    <div className="w-full max-w-sm mx-auto space-y-3">

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">

        <div>
          <h2 className="text-base font-semibold leading-tight">
            {allDone
              ? "All numbers verified"
              : "Number verified"}
          </h2>

          <p className="text-xs text-muted-foreground">
            {verified.length} of{" "}
            {MAX_NUMBERS} added
          </p>
        </div>

        <div className="space-y-2">
          {verified.map((entry, i) => {
            const Flag =
              entry.country.Flag;

            return (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 rounded-md border px-4 py-3 transition-colors",
                  confirmingDelete === i
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border bg-muted/40"
                )}
              >
                {confirmingDelete === i ? (
                  <>
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <Flag className="h-4 w-5 shrink-0" />

                      <p className="text-sm font-medium text-destructive truncate">
                        Remove +
                        {entry.country.dial}{" "}
                        {entry.phone}?
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmingDelete(null)
                        }
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(i)
                        }
                        className="text-xs font-semibold text-destructive hover:text-destructive/70 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check
                        className="w-3.5 h-3.5 text-primary-foreground"
                        strokeWidth={3}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {LABELS[i]}
                      </p>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Flag className="h-3.5 w-5 shrink-0" />

                        <p className="text-sm font-medium text-foreground truncate">
                          +{entry.country.dial}{" "}
                          {entry.phone}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Remove number"
                      onClick={() =>
                        setConfirmingDelete(i)
                      }
                      className="shrink-0 p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          {!allDone && (
            <button
              type="button"
              onClick={handleAddAnother}
              className="flex items-center justify-center gap-2 w-full rounded-md border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <Plus className="w-4 h-4" />

              {verified.length === 1
                ? "Add secondary number"
                : "Add another secondary number"}
            </button>
          )}

          {/* DONE BUTTON */}
          <Button
            className="w-full"
            onClick={() => {
              console.log(
                "FINAL STORE",
                useRegisterStore.getState()
              );

              setTimeout(() => {
                router.push(
                  "/register/profile-setup"
                );
              }, 300);
            }}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  </main>
);
  }

  /* ------------------------------------------------ */
  /* MAIN FLOW                                       */
  /* ------------------------------------------------ */

 return (
  <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
    <div className="w-full max-w-sm space-y-3">

      {/* VERIFIED NUMBERS */}
      {verified.length > 0 && (
        <div className="space-y-2">
          {verified.map((entry, i) => {
            const Flag = entry.country.Flag;

            return (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 rounded-md border px-4 py-2.5 transition-colors",
                  confirmingDelete === i
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border bg-card"
                )}
              >
                {confirmingDelete === i ? (
                  <>
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <Flag className="h-4 w-5 shrink-0" />

                      <p className="text-sm font-medium text-destructive truncate">
                        Remove +{entry.country.dial} {entry.phone}?
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmingDelete(null)
                        }
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(i)
                        }
                        className="text-xs font-semibold text-destructive hover:text-destructive/70 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check
                        className="w-3 h-3 text-primary-foreground"
                        strokeWidth={3}
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mr-1">
                        {LABELS[i]}
                      </span>

                      <Flag className="h-3.5 w-5 shrink-0" />

                      <span className="text-sm font-medium text-foreground truncate">
                        +{entry.country.dial} {entry.phone}
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Remove number"
                      onClick={() =>
                        setConfirmingDelete(i)
                      }
                      className="shrink-0 p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MAIN CARD */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">

        {/* ENTER PHONE */}
        {stage === "enter-phone" && (
          <>
            <div>
              <h2 className="text-base font-semibold leading-tight">
                {verified.length === 0
                  ? "Verify your phone"
                  : `Add ${LABELS[
                      verified.length
                    ].toLowerCase()} number`}
              </h2>

              <p className="text-sm text-muted-foreground mt-0.5">
                {verified.length === 0
                  ? "We will send a one-time code to verify it."
                  : "Add a backup number for account recovery."}
              </p>
            </div>

            <div className="space-y-3">

              <PhoneNumberInput
                value={phone}
                country={country}
                onlyCountries={ALLOWED_COUNTRIES}
                onCountryChange={(c) => {
                  setCountry(c);
                  setPhone("");
                  setPhoneError("");
                }}
                onChange={(digits) => {
                  setPhone(digits);
                  setPhoneError("");
                }}
                inputRef={phoneInputRef}
              />

              {phoneError && (
                <p className="text-sm text-destructive">
                  {phoneError}
                </p>
              )}

              <Button
                className="w-full"
                onClick={handleSend}
              >
                Send code
              </Button>
            </div>
          </>
        )}

        {/* VERIFY OTP */}
        {stage === "verify-otp" && (
          <>
            <div>
              <h2 className="text-base font-semibold leading-tight">
                Enter the 6-digit code
              </h2>

              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-sm text-muted-foreground">
                  Sent to{" "}
                  <span className="font-medium text-foreground">
                    +{country.dial} {phone}
                  </span>
                </p>

                <span className="text-muted-foreground">
                  ·
                </span>

                <button
                  type="button"
                  onClick={handleChangeNumber}
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  Change
                </button>
              </div>
            </div>

            <OtpInput
              error={otpError}
              disabled={verifying}
              onComplete={handleOtpComplete}
              onErrorCleared={
                handleOtpErrorCleared
              }
            />

            {verifying ? (
              <p className="text-sm text-muted-foreground text-center">
                Verifying&hellip;
              </p>
            ) : otpErrorMsg ? (
              <p className="text-sm text-destructive text-center">
                {otpErrorMsg}
              </p>
            ) : null}

            <div className="flex items-center justify-center gap-1.5 text-sm">
              <span className="text-muted-foreground">
                Didn&apos;t receive it?
              </span>

              {enabled ? (
                <button
                  type="button"
                  onClick={() => reset()}
                  className="font-medium text-foreground hover:underline transition-colors"
                >
                  Resend
                </button>
              ) : (
                <span className="text-muted-foreground">
                  Resend in{" "}
                  <span className="font-semibold text-foreground tabular-nums">
                    {seconds}s
                  </span>
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  </main>
);
}
 
// Template SMS content:
// Lokalads verification code: 123456 — valid for 10 minutes. Do not share this code with anyone.
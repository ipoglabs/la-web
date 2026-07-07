"use client";

import React from "react";
import PhoneNumberInput from "@/components/phone-number-input";

function CaseWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {children}
    </div>
  );
}

export default function Page() {
  const [val, setVal] = React.useState("");
  const [country, setCountry] = React.useState<
    import("@/components/phone-number-input/countries").Country | undefined
  >(undefined);

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-bold mb-1">Phone Number Input</h1>
      <p className="text-sm text-slate-500 mb-8">
        Digits-only controlled/uncontrolled input with a country picker.
      </p>

      <div className="flex flex-col gap-8">

        {/* Use Case 1 */}
        <CaseWrapper label="Use Case 1 — Single country (United Kingdom)">
          <PhoneNumberInput
            defaultCountry="GB"
            onlyCountries={["GB"]}
            placeholder="Mobile number"
          />
        </CaseWrapper>

        {/* Use Case 2 */}
        <CaseWrapper label="Use Case 2 — Two countries (United Kingdom, India)">
          <PhoneNumberInput
            defaultCountry="GB"
            onlyCountries={["GB", "IN"]}
            placeholder="Mobile number"
          />
        </CaseWrapper>

        {/* Use Case 3 */}
        <CaseWrapper label="Use Case 3 — Three countries (United Kingdom, India, Singapore)">
          <PhoneNumberInput
            defaultCountry="GB"
            onlyCountries={["GB", "IN", "SG"]}
            placeholder="Mobile number"
          />
        </CaseWrapper>

        {/* Use Case 4 */}
        <CaseWrapper label="Use Case 4 — Six countries (United Kingdom, India, Singapore, Canada, Australia, New Zealand)">
          <PhoneNumberInput
            defaultCountry="GB"
            onlyCountries={["GB", "IN", "SG", "CA", "AU", "NZ"]}
            placeholder="Mobile number"
          />
        </CaseWrapper>

        {/* Use Case 5 */}
        <CaseWrapper label="Use Case 5 — All countries">
          <PhoneNumberInput
            value={val}
            onChange={(d) => setVal(d)}
            country={country}
            onCountryChange={(c) => setCountry(c)}
            placeholder="Mobile number"
          />
          {val && (
            <p className="text-xs text-slate-400">Value: +{country?.dial} {val}</p>
          )}
        </CaseWrapper>

        {/* Use Case 6 */}
        <CaseWrapper label="Use Case 6 — Disabled with pre-filled number">
          <PhoneNumberInput
            defaultCountry="GB"
            defaultValue="7911123456"
            disabled
            placeholder="Mobile number"
          />
        </CaseWrapper>

      </div>
    </div>
  );
}

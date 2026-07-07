"use client";

import React, { useState, useEffect } from "react";
import { FormField } from "@/components/la/form/FormField";
import { FormFieldWrapper } from "@/components/la/form/FormFieldWrapper";
import { FormHelperText } from "@/components/la/form/FormHelperText";
import { LaInput } from "@/components/la/la-input";
import DateInput from "@/components/date-input";

export default function FieldPage() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const mockCountryStateCity = {
    UK: { "England": ["London", "Manchester"], "Scotland": ["Edinburgh"] },
    IN: { "Karnataka": ["Bengaluru"], "Maharashtra": ["Mumbai"] },
    SG: { "Central": ["Central"] },
  };

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    country: "",
    state: "",
    city: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stateOptions = values.country ? Object.keys(mockCountryStateCity[values.country] || {}) : [];
  const cityOptions = values.country && values.state ? (mockCountryStateCity[values.country][values.state] || []) : [];

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setValues((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!/^[A-Za-z]{2,}$/.test(values.firstName)) errs.firstName = "A-Z only, minimum 2 letters";
    if (!/^[A-Za-z]{2,}$/.test(values.lastName)) errs.lastName = "A-Z only, minimum 2 letters";
    if (!values.gender) errs.gender = "Please select your gender";
    return errs;
  }

  function handleNext() {
    const v = validate();
    if (Object.keys(v).length) return setErrors(v);
    setErrors({});
    // mock submit: show alert
    // eslint-disable-next-line no-alert
    alert("Form valid — next step (mock)");
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Step 1 — General Information (mock)</h2>
      <FormFieldWrapper className="grid grid-cols-1 md:grid-cols-2 md:gap-4" showFocusWithin={!isMobile}>
        <FormField label="First Name" htmlFor="firstName" error={errors.firstName} className="mb-0" showFocusWithin={isMobile}>
          <LaInput id="firstName" name="firstName" value={values.firstName} onChange={handleChange} placeholder="e.g. Johnson" className="w-full" />
        </FormField>
        <FormField label="Last Name" htmlFor="lastName" error={errors.lastName} className="mb-0" showFocusWithin={isMobile}>
          <LaInput id="lastName" name="lastName" value={values.lastName} onChange={handleChange} placeholder="e.g. Davis" className="w-full" />
        </FormField>
      </FormFieldWrapper>
      <FormHelperText className="mt-1 mb-4">Use your real name to build trust.</FormHelperText>

      <FormField label="Date of Birth" htmlFor="dob" error={errors.dob} helperLabel="We need this to confirm you are 18+">
        <DateInput id="dob" value={values.dob || undefined} onChange={(iso) => setValues(s => ({ ...s, dob: iso ?? "" }))} />
      </FormField>

      <FormField label="Gender" htmlFor="gender" error={errors.gender}>
        <select id="gender" name="gender" value={values.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded" aria-label="Gender" required>
          <option value="">Select your gender...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Prefer not to say</option>
        </select>
      </FormField>

      <FormField label="Country" htmlFor="country" error={errors.country} helperLabel="Optional for mock">
        <select id="country" name="country" value={values.country} onChange={handleChange} className="w-full px-3 py-2 border rounded">
          <option value="">Select Country...</option>
          {Object.keys(mockCountryStateCity).map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="State" htmlFor="state" error={errors.state}>
          <select id="state" name="state" value={values.state} onChange={handleChange} className="w-full px-3 py-2 border rounded">
            <option value="">Select State / Province...</option>
            {stateOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </FormField>
        <FormField label="City" htmlFor="city" error={errors.city}>
          <select id="city" name="city" value={values.city} onChange={handleChange} className="w-full px-3 py-2 border rounded">
            <option value="">Select City / District...</option>
            {cityOptions.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </FormField>
      </div>

      <div className="mt-4">
        <button type="button" onClick={handleNext} className="w-full bg-blue-600 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );

}


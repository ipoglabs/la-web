"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, X } from "lucide-react";

import { Country, State, City } from "country-state-city";

import { updateLocation } from "@/app/actions/profile/updateLocation";
import { Form } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { FormField } from "@/components/FormField";
import { useMediaQuery } from "@/components/hooks/use-media-query";

/* ── Bottom Sheet (mobile) ────────────────────────────────────────────────── */
function BottomSheet({
  open,
  onClose,
  title,
  items,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  items: any[];
  onSelect: (item: any) => void;
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 flex flex-col bg-white rounded-t-2xl max-h-[75dvh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b shrink-0">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b shrink-0">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${title.replace("Select ", "").toLowerCase()}...`}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            autoFocus
          />
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">
              No results found
            </p>
          ) : (
            filtered.map((item) => (
              <button
                key={item.isoCode ?? item.name}
                type="button"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="w-full text-left px-4 py-3.5 text-sm text-slate-700 border-b border-slate-100 last:border-0 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                {item.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Dropdown (desktop) ───────────────────────────────────────────────────── */
function Dropdown({
  open,
  items,
  onSelect,
}: {
  open: boolean;
  items: any[];
  onSelect: (item: any) => void;
}) {
  if (!open || items.length === 0) return null;

  return (
    <div className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
      {items.map((item) => (
        <button
          key={item.isoCode ?? item.name}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSelect(item)}
          className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function LocationEditForm({ user, onSuccess }: any) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);

  const [queryCountry, setQueryCountry] = useState("");
  const [queryState, setQueryState] = useState("");
  const [queryCity, setQueryCity] = useState("");

  const countryRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    country: user.address?.country || "",
    countryCode: user.address?.countryCode || "",
    state: user.address?.state || "",
    stateCode: user.address?.stateCode || "",
    city: user.address?.city || "",
    postalCode: user.address?.postalCode || "",
  });

  const [loading, setLoading] = useState(false);

  /* LOAD DATA */
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (formData.countryCode) {
      setStates(State.getStatesOfCountry(formData.countryCode));
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [formData.countryCode]);

  useEffect(() => {
    if (formData.countryCode && formData.stateCode) {
      setCities(City.getCitiesOfState(formData.countryCode, formData.stateCode));
    } else {
      setCities([]);
    }
  }, [formData.stateCode]);

  /* CLOSE DESKTOP DROPDOWNS ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setOpenCountry(false);
        setQueryCountry("");
      }
      if (stateRef.current && !stateRef.current.contains(e.target as Node)) {
        setOpenState(false);
        setQueryState("");
      }
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setOpenCity(false);
        setQueryCity("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* FILTERED LISTS */
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(queryCountry.toLowerCase())
  );
  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(queryState.toLowerCase())
  );
  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(queryCity.toLowerCase())
  );

  /* SUBMIT */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateLocation({
        country: formData.country,
        countryCode: formData.countryCode,
        state: formData.state,
        stateCode: formData.stateCode,
        locality: formData.city,
        postalCode: formData.postalCode,
      });
      toast.success("Location updated");
      router.refresh();
      onSuccess?.();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* MOBILE SELECTOR BUTTON */
  const SelectorButton = ({
    value,
    placeholder,
    disabled,
    onClick,
  }: {
    value: string;
    placeholder: string;
    disabled?: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-lg border px-3 py-3 text-sm transition ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 active:bg-slate-50"
      }`}
    >
      <span className={value ? "text-slate-900" : "text-slate-400"}>
        {value || placeholder}
      </span>
      <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
    </button>
  );

  return (
    <>
      <Form onSubmit={onSubmit} className="space-y-5">

        {/* COUNTRY */}
        <FormField label="Country">
          {isMobile ? (
            <SelectorButton
              value={formData.country}
              placeholder="Select country"
              onClick={() => setOpenCountry(true)}
            />
          ) : (
            <div ref={countryRef} className="relative">
              <Input
                value={openCountry ? queryCountry : formData.country}
                placeholder="Type to search country..."
                onFocus={() => {
                  setQueryCountry(formData.country);
                  setOpenCountry(true);
                }}
                onChange={(e) => {
                  setQueryCountry(e.target.value);
                  setOpenCountry(true);
                }}
                onBlur={() => {
                  if (!formData.countryCode) setQueryCountry("");
                }}
              />
              <Dropdown
                open={openCountry}
                items={filteredCountries}
                onSelect={(c) => {
                  setFormData({
                    ...formData,
                    country: c.name,
                    countryCode: c.isoCode,
                    state: "",
                    stateCode: "",
                    city: "",
                  });
                  setQueryCountry("");
                  setOpenCountry(false);
                }}
              />
            </div>
          )}
        </FormField>

        {/* STATE */}
        <FormField label="State / Province">
          {isMobile ? (
            <SelectorButton
              value={formData.state}
              placeholder="Select state"
              disabled={!formData.countryCode}
              onClick={() => setOpenState(true)}
            />
          ) : (
            <div ref={stateRef} className="relative">
              <Input
                value={openState ? queryState : formData.state}
                placeholder="Type to search state..."
                disabled={!formData.countryCode}
                onFocus={() => {
                  setQueryState(formData.state);
                  setOpenState(true);
                }}
                onChange={(e) => {
                  setQueryState(e.target.value);
                  setOpenState(true);
                }}
                onBlur={() => {
                  if (!formData.stateCode) setQueryState("");
                }}
              />
              <Dropdown
                open={openState}
                items={filteredStates}
                onSelect={(s) => {
                  setFormData({
                    ...formData,
                    state: s.name,
                    stateCode: s.isoCode,
                    city: "",
                  });
                  setQueryState("");
                  setOpenState(false);
                }}
              />
            </div>
          )}
        </FormField>

        {/* CITY */}
        <FormField label="City">
          {isMobile ? (
            <SelectorButton
              value={formData.city}
              placeholder="Select city"
              disabled={!formData.stateCode}
              onClick={() => setOpenCity(true)}
            />
          ) : (
            <div ref={cityRef} className="relative">
              <Input
                value={openCity ? queryCity : formData.city}
                placeholder="Type to search city..."
                disabled={!formData.stateCode}
                onFocus={() => {
                  setQueryCity(formData.city);
                  setOpenCity(true);
                }}
                onChange={(e) => {
                  setQueryCity(e.target.value);
                  setOpenCity(true);
                }}
                onBlur={() => {
                  if (!formData.city) setQueryCity("");
                }}
              />
              <Dropdown
                open={openCity}
                items={filteredCities}
                onSelect={(c) => {
                  setFormData({ ...formData, city: c.name });
                  setQueryCity("");
                  setOpenCity(false);
                }}
              />
            </div>
          )}
        </FormField>

        {/* POSTAL */}
        <FormField label="Postal Code">
          <Input
            value={formData.postalCode}
            onChange={(e) =>
              setFormData({ ...formData, postalCode: e.target.value })
            }
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>

      </Form>

      {/* MOBILE BOTTOM SHEETS — rendered outside <Form> to avoid nesting issues */}
      <BottomSheet
        open={openCountry}
        onClose={() => setOpenCountry(false)}
        title="Select Country"
        items={countries}
        onSelect={(c) =>
          setFormData({
            ...formData,
            country: c.name,
            countryCode: c.isoCode,
            state: "",
            stateCode: "",
            city: "",
          })
        }
      />
      <BottomSheet
        open={openState}
        onClose={() => setOpenState(false)}
        title="Select State"
        items={states}
        onSelect={(s) =>
          setFormData({
            ...formData,
            state: s.name,
            stateCode: s.isoCode,
            city: "",
          })
        }
      />
      <BottomSheet
        open={openCity}
        onClose={() => setOpenCity(false)}
        title="Select City"
        items={cities}
        onSelect={(c) => setFormData({ ...formData, city: c.name })}
      />
    </>
  );
}

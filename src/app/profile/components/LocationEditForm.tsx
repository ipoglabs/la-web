"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Country, State, City } from "country-state-city";

import { updateLocation } from "@/app/actions/profile/updateLocation";

import { Form } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";

import { FormField } from "@/components/FormField";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

export default function LocationEditForm({ user, onSuccess }: any) {
  const router = useRouter();

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  /* ✅ STORE BOTH NAME + CODE */
  const [formData, setFormData] = useState({
    country: user.address?.country || "",
    countryCode: user.address?.countryCode || "",
    state: user.address?.state || "",
    stateCode: user.address?.stateCode || "",
    city: user.address?.city || "",
    postalCode: user.address?.postalCode || "",
  });

  const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ================= LOAD COUNTRIES ================= */
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  /* ================= LOAD STATES ================= */
  useEffect(() => {
    if (formData.countryCode) {
      setStates(State.getStatesOfCountry(formData.countryCode));
      setCities([]);
      setFormData((prev) => ({
        ...prev,
        state: "",
        stateCode: "",
        city: "",
      }));
    }
  }, [formData.countryCode]);

  /* ================= LOAD CITIES ================= */
  useEffect(() => {
    if (formData.countryCode && formData.stateCode) {
      setCities(
        City.getCitiesOfState(
          formData.countryCode,
          formData.stateCode
        )
      );
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  }, [formData.stateCode]);

  /* ================= SUBMIT ================= */
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
        postalCode: formData.postalCode.trim(),
      });

      toast.success("Location updated successfully");
      router.refresh();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit} className="space-y-5">

      {/* COUNTRY */}
      <FormField label="Country">
        <Popover open={openCountry} onOpenChange={setOpenCountry}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {formData.country || "Select country"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found</CommandEmpty>

              <CommandGroup className="max-h-60 overflow-auto">
                {countries.map((c) => (
                  <CommandItem
                    key={c.isoCode}
                    onSelect={() => {
                      setFormData({
                        ...formData,
                        country: c.name,           // ✅ FULL NAME
                        countryCode: c.isoCode,    // ✅ CODE
                        state: "",
                        stateCode: "",
                        city: "",
                      });
                      setOpenCountry(false);
                    }}
                  >
                    {c.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </FormField>

      {/* STATE */}
      <FormField label="State">
        <Popover open={openState} onOpenChange={setOpenState}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={!formData.countryCode}
            >
              {formData.state || "Select state"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search state..." />
              <CommandEmpty>No state found</CommandEmpty>

              <CommandGroup className="max-h-60 overflow-auto">
                {states.map((s) => (
                  <CommandItem
                    key={s.isoCode}
                    onSelect={() => {
                      setFormData({
                        ...formData,
                        state: s.name,          // ✅ FULL NAME
                        stateCode: s.isoCode,   // ✅ CODE
                        city: "",
                      });
                      setOpenState(false);
                    }}
                  >
                    {s.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </FormField>

      {/* CITY */}
      <FormField label="City">
        <Popover open={openCity} onOpenChange={setOpenCity}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={!formData.stateCode}
            >
              {formData.city || "Select city"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search city..." />
              <CommandEmpty>No city found</CommandEmpty>

              <CommandGroup className="max-h-60 overflow-auto">
                {cities.map((c) => (
                  <CommandItem
                    key={c.name}
                    onSelect={() => {
                      setFormData({
                        ...formData,
                        city: c.name,
                      });
                      setOpenCity(false);
                    }}
                  >
                    {c.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </FormField>

      {/* POSTAL */}
      <FormField label="Postal Code">
        <Input
          value={formData.postalCode}
          onChange={(e) =>
            setFormData({
              ...formData,
              postalCode: e.target.value,
            })
          }
        />
      </FormField>

      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </Form>
  );
}
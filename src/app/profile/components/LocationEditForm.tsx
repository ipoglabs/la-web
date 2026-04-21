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

export default function LocationEditForm({ user, onSuccess }: any) {
  const router = useRouter();

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);

  const [queryCountry, setQueryCountry] = useState("");
  const [queryState, setQueryState] = useState("");
  const [queryCity, setQueryCity] = useState("");

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
      setFormData((p: any) => ({
        ...p,
        state: "",
        stateCode: "",
        city: "",
      }));
    }
  }, [formData.countryCode]);

  useEffect(() => {
    if (formData.countryCode && formData.stateCode) {
      setCities(
        City.getCitiesOfState(
          formData.countryCode,
          formData.stateCode
        )
      );
      setFormData((p: any) => ({ ...p, city: "" }));
    }
  }, [formData.stateCode]);

  /* FILTER */
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
  const onSubmit = async (e: any) => {
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

  /* UI RENDER HELPERS */
  const renderList = (items: any[], onSelect: any) => (
    <div className="max-h-60 overflow-auto bg-white border rounded shadow">
      {items.map((item) => (
        <div
          key={item.isoCode || item.name}
          onClick={() => onSelect(item)}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
        >
          {item.name}
        </div>
      ))}
    </div>
  );

  const renderBottomSheet = (items: any[], onSelect: any, close: any, title: string) => (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
      <div className="bg-white w-full rounded-t-xl p-4 max-h-[70%] overflow-auto">
        <h3 className="text-lg font-medium mb-3">{title}</h3>

        {items.map((item) => (
          <div
            key={item.isoCode || item.name}
            onClick={() => {
              onSelect(item);
              close(false);
            }}
            className="py-3 border-b text-sm"
          >
            {item.name}
          </div>
        ))}

        <button
          onClick={() => close(false)}
          className="mt-4 w-full bg-gray-100 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <Form onSubmit={onSubmit} className="space-y-5">

      {/* COUNTRY */}
      <FormField label="Country">
        <Input
          value={formData.country}
          placeholder="Type country..."
          onFocus={() => setOpenCountry(true)}
          onChange={(e) => {
            setQueryCountry(e.target.value);
            setFormData({ ...formData, country: e.target.value });
            setOpenCountry(true);
          }}
        />

        {!isMobile && openCountry &&
          renderList(filteredCountries, (c: any) => {
            setFormData({
              ...formData,
              country: c.name,
              countryCode: c.isoCode,
              state: "",
              stateCode: "",
              city: "",
            });
            setOpenCountry(false);
          })}

        {isMobile && openCountry &&
          renderBottomSheet(filteredCountries, (c: any) => {
            setFormData({
              ...formData,
              country: c.name,
              countryCode: c.isoCode,
            });
          }, setOpenCountry, "Select Country")}
      </FormField>

      {/* STATE */}
      <FormField label="State">
        <Input
          value={formData.state}
          placeholder="Type state..."
          disabled={!formData.countryCode}
          onFocus={() => setOpenState(true)}
          onChange={(e) => {
            setQueryState(e.target.value);
            setFormData({ ...formData, state: e.target.value });
            setOpenState(true);
          }}
        />

        {!isMobile && openState &&
          renderList(filteredStates, (s: any) => {
            setFormData({
              ...formData,
              state: s.name,
              stateCode: s.isoCode,
              city: "",
            });
            setOpenState(false);
          })}

        {isMobile && openState &&
          renderBottomSheet(filteredStates, (s: any) => {
            setFormData({
              ...formData,
              state: s.name,
              stateCode: s.isoCode,
            });
          }, setOpenState, "Select State")}
      </FormField>

      {/* CITY */}
      <FormField label="City">
        <Input
          value={formData.city}
          placeholder="Type city..."
          disabled={!formData.stateCode}
          onFocus={() => setOpenCity(true)}
          onChange={(e) => {
            setQueryCity(e.target.value);
            setFormData({ ...formData, city: e.target.value });
            setOpenCity(true);
          }}
        />

        {!isMobile && openCity &&
          renderList(filteredCities, (c: any) => {
            setFormData({ ...formData, city: c.name });
            setOpenCity(false);
          })}

        {isMobile && openCity &&
          renderBottomSheet(filteredCities, (c: any) => {
            setFormData({ ...formData, city: c.name });
          }, setOpenCity, "Select City")}
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
  );
}
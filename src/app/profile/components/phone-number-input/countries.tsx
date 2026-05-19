import React from "react";
import { FlagIN, FlagSG, FlagGB } from "./flags";

export type Country = {
  code: string;
  name: string;
  dial: string; // without +
  Flag: React.ComponentType<any>;
};

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India",          dial: "91", Flag: FlagIN },
  { code: "SG", name: "Singapore",      dial: "65", Flag: FlagSG },
  { code: "GB", name: "United Kingdom", dial: "44", Flag: FlagGB },
];

export default COUNTRIES;

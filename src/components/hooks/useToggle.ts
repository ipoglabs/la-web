// src/hooks/useToggle.ts
// Custom hook for boolean toggle state

import { useState } from "react";

export function useToggle(initial: boolean = false): [boolean, () => void, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  const reset = () => setValue(initial);
  return [value, toggle, reset];
}

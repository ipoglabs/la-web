"use client";

import { useEffect, useState } from "react";
import type { PostFormSchemaData, PostFormSchemaResponse } from "@/posting/form-schema/types";

type Result = {
  key: string;
  schema: PostFormSchemaData | null;
  source: PostFormSchemaResponse["source"] | null;
  error: string | null;
};

/**
 * Forms already loaded in this tab, by request key. The details step and the
 * preview ask for the same form; without this the preview fetched it again
 * and, on a cold server just after a deploy, sat on "Loading your ad
 * details…" with Submit disabled for 10s+. Only successful loads are kept,
 * and only until the page reloads; the server still validates against the
 * live form on submit.
 */
const loaded = new Map<string, Pick<Result, "schema" | "source">>();

/** Loads the DB-driven post form for a category/subcategory/country via /api/post-form-schema. */
export function usePostFormSchema(
  category: string | null | undefined,
  subcategory: string | null | undefined,
  country: string,
) {
  const key = category && subcategory ? new URLSearchParams({ category, subcategory, country }).toString() : null;
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!key || loaded.has(key)) return;
    const ctrl = new AbortController();

    fetch(`/api/post-form-schema?${key}`, { signal: ctrl.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load form (${res.status})`);
        const data = (await res.json()) as PostFormSchemaResponse;
        loaded.set(key, { schema: data.schema, source: data.source });
        setResult({ key, schema: data.schema, source: data.source, error: null });
      })
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return;
        setResult({
          key,
          schema: null,
          source: null,
          error: err instanceof Error ? err.message : "Failed to load form",
        });
      });

    return () => ctrl.abort();
  }, [key]);

  // Only trust a result that belongs to the current request.
  const cached = key ? loaded.get(key) : undefined;
  const current = cached ? { key, ...cached, error: null } : result && result.key === key ? result : null;
  return {
    schema: current?.schema ?? null,
    source: current?.source ?? null,
    error: current?.error ?? null,
    loading: !!key && !current,
  };
}

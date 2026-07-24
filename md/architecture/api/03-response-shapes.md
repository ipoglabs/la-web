# Response Shapes — LokalAds API

> Every API route returns JSON in these exact shapes.  
> Consistent responses mean the frontend never needs to guess the error structure.  
> Last updated: 2026-07-07

---

## Success Responses

### Single resource

```json
{ "id": "abc123", "title": "3-bed flat", "price": 2500, ... }
```

Return the resource directly at the top level. No wrapper object.

```ts
return NextResponse.json(listing, { status: 200 });
```

### Created resource

```json
{ "id": "abc123", "ticketId": "RPT-2026-001234" }
```

Return the identifier(s) needed for the client to reference the new resource. Use `status: 201`.

```ts
return NextResponse.json({ id: report._id.toString(), ticketId: report.ticketId }, { status: 201 });
```

### List / paginated

```json
{
  "items": [...],
  "total": 247,
  "page": 1,
  "pageSize": 20,
  "hasMore": true
}
```

Always return `total` and `hasMore` — never make the client do `items.length < pageSize` to detect the last page.

```ts
return NextResponse.json({ items, total, page, pageSize, hasMore: offset + items.length < total });
```

### Action success (no resource to return)

```json
{ "ok": true }
```

For operations that succeed but have nothing to return (mark-as-read, logout, block user):

```ts
return NextResponse.json({ ok: true });
```

### Partial success

```json
{ "ok": true, "cleaned": [...], "warnings": ["row 3 was empty and skipped"] }
```

Used by the `good-to-know/validate` pattern — operation succeeded but with non-fatal notices.

---

## Error Responses

All errors use this envelope — **no exceptions**:

```json
{
  "error": "error_code",
  "message": "Human-readable description (optional — only for developer debugging)",
  "fields": ["fieldName1", "fieldName2"]
}
```

| Field | Required | Description |
|---|---|---|
| `error` | Always | Snake_case machine-readable code (see Error Codes below) |
| `message` | Optional | Developer-facing description — never show raw to end users |
| `fields` | Optional | Array of field names that failed validation — for form highlighting |

---

## HTTP Status Codes

| Code | When to use |
|---|---|
| `200 OK` | Successful GET, PATCH, DELETE |
| `201 Created` | Successful POST that created a new DB document |
| `400 Bad Request` | Invalid JSON · missing required field · failed validation · invalid enum value |
| `401 Unauthorized` | No session / session expired / sessionVersion mismatch |
| `403 Forbidden` | Authenticated but wrong role or not resource owner |
| `404 Not Found` | Resource with that ID/slug/ticketId does not exist |
| `409 Conflict` | Duplicate — resource already exists (duplicate email, duplicate save, duplicate follow) |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unhandled exception — log it, return generic message |
| `502 Bad Gateway` | Upstream API (Google Places, Cloudflare) returned an error |

**Rules:**
- Never return `200` for an error — the status code must match the outcome
- Never return `500` for a validation error — that's always `400`
- Never expose raw MongoDB errors, stack traces, or internal field names in `500` responses

---

## Error Codes — Complete List

Machine-readable codes used in the `error` field. Frontend maps these to UI copy.

### Generic
| Code | Status | Meaning |
|---|---|---|
| `invalid_json` | 400 | Request body could not be parsed as JSON |
| `validation_error` | 400 | One or more fields failed validation (see `fields` array) |
| `unauthorized` | 401 | Not logged in or session expired |
| `forbidden` | 403 | Logged in but not allowed to perform this action |
| `not_found` | 404 | Resource does not exist |
| `rate_limit` | 429 | Too many requests — try again later |
| `server_error` | 500 | Unexpected server error |

### Auth-specific
| Code | Status | Meaning |
|---|---|---|
| `email_taken` | 409 | Email already registered |
| `invalid_otp` | 400 | OTP code is wrong |
| `attempts_exceeded` | 400 | Max OTP attempts reached — re-send required |
| `otp_expired` | 400 | OTP has expired (TTL passed) |
| `invalid_token` | 400 | Magic link / reset token is invalid, used, or expired |
| `wrong_purpose` | 400 | Token exists but was issued for a different purpose |
| `age_restricted` | 400 | User is under 18 (DOB gate failed) |
| `account_suspended` | 403 | Account has been suspended by admin |
| `account_deleted` | 403 | Account has been soft-deleted |

### Listings
| Code | Status | Meaning |
|---|---|---|
| `category_not_allowed` | 400 | Category not enabled for the selected country |
| `slug_conflict` | 409 | Slug collision not resolved (should never reach client — handled server-side) |
| `listing_expired` | 409 | Listing cannot be edited — it has expired |

### Reports
| Code | Status | Meaning |
|---|---|---|
| `duplicate_report` | 409 | This user already has an active report for this ad |
| `invalid_status` | 400 | Status value not in allowed enum |

### Uploads
| Code | Status | Meaning |
|---|---|---|
| `upload_failed` | 502 | Cloudflare Images API returned an error |
| `invalid_file_type` | 400 | File type not accepted (only JPEG, PNG, WebP) |
| `file_too_large` | 400 | File exceeds 10 MB limit |

### Social
| Code | Status | Meaning |
|---|---|---|
| `self_follow` | 400 | User attempted to follow themselves |
| `self_review` | 400 | User attempted to review themselves |
| `already_following` | 409 | Follow relationship already exists |
| `not_following` | 404 | Unfollow attempted but relationship does not exist |
| `already_reviewed` | 409 | Reviewer already has a published review for this seller |

### Infrastructure
| Code | Status | Meaning |
|---|---|---|
| `service_unavailable` | 503 | Database or upstream service temporarily unreachable — retry after `Retry-After` seconds |

---

## Standard Error Handler — Wrap Every Route

Use this pattern in every handler's `catch` block:

```ts
export async function POST(req: NextRequest) {
  try {
    // ... handler logic
  } catch (err) {
    console.error("[POST /api/listings]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
```

**Rules:**
- Always `console.error` with the route path prefix — makes logs searchable
- Never `console.log` sensitive data (session contents, email addresses, tokens)
- The `500` response body must be exactly `{ error: "server_error" }` — no stack trace, no message

**Catch MongoDB network errors specifically and return `503`:**
```ts
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    // ... handler logic
  } catch (err) {
    // MongoDB unreachable (bufferCommands: false throws immediately)
    if (err instanceof mongoose.mongo.MongoNetworkError ||
        (err as any)?.name === "MongoNetworkError") {
      console.error("[POST /api/listings] DB unreachable", err);
      return new NextResponse(
        JSON.stringify({ error: "service_unavailable" }),
        { status: 503, headers: { "Retry-After": "30", "Content-Type": "application/json" } }
      );
    }
    console.error("[POST /api/listings]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
```

Add `serviceUnavailable` to `lib/api-response.ts`:
```ts
export const serviceUnavailable = () =>
  new NextResponse(
    JSON.stringify({ error: "service_unavailable" }),
    { status: 503, headers: { "Retry-After": "30", "Content-Type": "application/json" } }
  );
```

---

## TypeScript Response Helpers (optional, recommended)

Put these in `lib/api-response.ts` to avoid typing status codes and error shapes by hand:

```ts
// lib/api-response.ts
import { NextResponse } from "next/server";

export const ok = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

export const created = (data: unknown) =>
  NextResponse.json(data, { status: 201 });

export const badRequest = (error: string, fields?: string[]) =>
  NextResponse.json({ error, ...(fields ? { fields } : {}) }, { status: 400 });

export const unauthorized = () =>
  NextResponse.json({ error: "unauthorized" }, { status: 401 });

export const forbidden = () =>
  NextResponse.json({ error: "forbidden" }, { status: 403 });

export const notFound = () =>
  NextResponse.json({ error: "not_found" }, { status: 404 });

export const conflict = (error: string) =>
  NextResponse.json({ error }, { status: 409 });

export const rateLimited = () =>
  NextResponse.json({ error: "rate_limit" }, { status: 429 });

export const serverError = (label: string, err: unknown) => {
  console.error(`[${label}]`, err);
  return NextResponse.json({ error: "server_error" }, { status: 500 });
};
```

Usage:
```ts
import { ok, unauthorized, notFound, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const listing = await Listing.findById(id).lean();
    if (!listing) return notFound();

    return ok(listing);
  } catch (err) {
    return serverError("GET /api/listings/[id]", err);
  }
}
```

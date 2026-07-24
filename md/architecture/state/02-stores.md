# State — Zustand Stores

> Every store in `lib/stores/` — shape, actions, persistence, and usage rules.  
> All stores use Zustand 5.  
> Last updated: 2026-07-07

---

## Overview

| Store | File | Persisted | Purpose |
|---|---|---|---|
| `useFavouritesStore` | `favouritesStore.ts` | ✅ localStorage | Local-first saved listings + server sync |
| `useRecentSearchesStore` | `recentSearchesStore.ts` | ✅ localStorage | Last 8 keyword searches with location context |
| `useDeleteAccountStore` | `deleteAccountStore.ts` | ❌ in-memory | Multi-step account deletion flow state |
| `useDonationStore` | `donationStore.ts` | ❌ in-memory | Donation amount + payment method flow |

---

## `useFavouritesStore`

**Strategy:** Local-first. Works before login. Server sync on login.

### Shape

```ts
interface FavItem {
  id: string;
  image: { src: string; alt?: string };
  priceLabel: string;
  priceSuffix?: string;
  title: string;
  detailsLabel: string;
  locationLabel: string;
  postedAt: number;          // unix ms
  status?: "active" | "closed" | "off-market";
}

interface FavouritesState {
  items: FavItem[];
  add: (item: FavItem) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  syncFromServer: (serverItems: FavItem[]) => void;
  clear: () => void;
}
```

### Actions

| Action | Behaviour |
|---|---|
| `add(item)` | Appends if not already in list (deduped by `id`) |
| `remove(id)` | Removes by id |
| `has(id)` | Returns bool — used to determine filled/unfilled heart icon |
| `syncFromServer(items)` | Server items prepended; local-only items appended after; no duplicates |
| `clear()` | Empties list — call on logout if desired |

### Persistence

```
localStorage key: "la-favourites"
skipHydration: true  →  rehydrate after mount, never during SSR
```

### Usage pattern

```ts
// In a listing card
const { has, add, remove } = useFavouritesStore();
const saved = has(listing.id);

const toggle = () => saved ? remove(listing.id) : add(toFavItem(listing));

// On login
const { data } = await fetch('/api/favourites');
useFavouritesStore.getState().syncFromServer(data.items);
```

---

## `useRecentSearchesStore`

**Strategy:** Persisted, max 8 entries, deduped by keyword (case-insensitive).

### Shape

```ts
interface RecentSearch {
  id: string;
  keyword: string;
  locationLabel?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  unit?: "km" | "mi";
  searchedAt: number;   // unix ms
}

interface RecentSearchesState {
  items: RecentSearch[];
  add: (entry: Omit<RecentSearch, "id" | "searchedAt">) => void;
  remove: (id: string) => void;
  clear: () => void;
}
```

### Actions

| Action | Behaviour |
|---|---|
| `add(entry)` | Dedupes by keyword — if keyword already exists, moves it to top. Trims to 8. |
| `remove(id)` | Removes single entry |
| `clear()` | Clears full history |

### Persistence

```
localStorage key: "la:recent-searches"
skipHydration: true
```

### ⚠️ Remove before production

The store is seeded with `DUMMY_ITEMS` for POC/demo only. Before launch:
- Set initial state to `items: []`
- Delete the `DUMMY_ITEMS` constant

### Usage pattern

```ts
// On search submit
useRecentSearchesStore.getState().add({
  keyword: "Honda City",
  locationLabel: "Delhi",
  lat: 28.7041,
  lng: 77.1025,
  radius: 5,
  unit: "km",
});

// In RecentSearches component
const items = useRecentSearchesStore((s) => s.items);
```

---

## `useDeleteAccountStore`

**Strategy:** In-memory, no persistence. Manages the 3-step delete account flow.

### Shape

```ts
type DeleteStage = 2 | 3 | 4;   // Stage 1 is the entry page (outside the store)

interface DeleteAccountState {
  stage: DeleteStage;
  reasons: string[];        // selected reasons for leaving
  details: string;          // free-text elaboration
  confirmed: boolean;       // user typed "DELETE"
  isLoading: boolean;
  error: string | null;

  // Sync
  setStage: (stage) => void;
  toggleReason: (reason) => void;
  setDetails: (details) => void;
  setConfirmed: (confirmed) => void;
  clearError: () => void;
  reset: () => void;

  // Async API
  checkEligibility: () => Promise<boolean>;
  submitFeedback: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}
```

### Stage flow

```
Stage 2 → Eligibility check → reasons + feedback
Stage 3 → Final confirmation ("type DELETE")
Stage 4 → Goodbye screen (account deleted)
```

### ⚠️ Stage auto-progression — do NOT double-advance

Two async actions advance the stage automatically inside the store:

| Action called | Stage transition (automatic, inside the store) |
|---|---|
| `submitFeedback()` | Always advances to `stage: 3` in the `finally` block — even if the API call fails |
| `deleteAccount()` | Advances to `stage: 4` only on success — stays on `stage: 3` on error |

**Do not call `setStage()` after these actions** — the store already transitions. Calling `setStage(3)` after `submitFeedback()` will re-set an already-advanced stage and may skip to stage 3 twice.

### API placeholders

The store contains three `async` action stubs. Before go-live, replace:

| Action | Endpoint to call |
|---|---|
| `checkEligibility()` | `GET /api/users/me/delete-eligibility` |
| `submitFeedback()` | `POST /api/users/me/delete-feedback` |
| `deleteAccount()` | `DELETE /api/users/me` |

### Usage pattern

```ts
const { stage, checkEligibility, submitFeedback, deleteAccount, isLoading, error } = useDeleteAccountStore();

// Step 1 → 2: eligibility gate
const ok = await checkEligibility();
// if ok → UI shows stage 2 form (store stage is still 2 until submitFeedback)

// Step 2 → 3: submitFeedback auto-advances stage to 3
await submitFeedback(); // store sets stage: 3 internally

// Step 3 → 4: deleteAccount auto-advances stage to 4 on success
await deleteAccount(); // store sets stage: 4 internally
// Do NOT call setStage() after either of these
```

Always call `reset()` when the user exits the flow without completing it.

---

## `useDonationStore`

**Strategy:** In-memory, no persistence. Manages the 2-step donation flow (POC/snippet only).

### Shape

```ts
interface DonationState {
  // Step 1
  selectedAmount: number | null;   // null = custom amount
  customAmount: string;
  donorName: string;
  donorEmail: string;
  donorMessage: string;

  // Step 2
  paymentTier: "qr" | "wallet" | "card";
  walletMethod: "apple-pay" | "google-pay" | "paypal";
  cardMethod: "credit-card" | "bank-transfer";

  // Post-payment
  transactionId: string;
  paidAt: string;
}
```

### Key actions

| Action | Behaviour |
|---|---|
| `confirmPayment()` | Generates a mock `transactionId` + `paidAt` timestamp |
| `reset()` | Clears all fields back to initial state |

### Note

`donationStore` is a POC / snippet-only store. It is not wired to a real payment gateway. The `confirmPayment()` action generates a mock transaction ID for demo purposes only.

### ⚠️ Production gaps before real payment integration

| Missing | What to add |
|---|---|
| No `isLoading` field | Add to shape — payment API calls can take 3–10s |
| No `error` field | Add — card decline, network failure, invalid amount all need surfacing |
| No `paymentIntentId` / gateway ref | Add after payment intent creation — needed for webhook reconciliation |
| `confirmPayment()` is mock | Replace with real gateway call (Stripe, Razorpay, etc.) + server-side intent creation |

Do not use this store for real payments without adding these fields.

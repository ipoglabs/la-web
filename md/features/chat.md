# Chat — Feature Documentation

> **"Context before conversation."**
> Every message lives inside the listing that started it. Never lose the thread.

---

## 1. Design Philosophy

Classifieds chat is fundamentally different from a general messenger. Every conversation exists for one reason: **two people interested in the same item**. That context — the listing — must always be visible. The moment a buyer forgets which sofa or which iPhone they were asking about, trust erodes and deals fall through.

Three principles drive every decision:

- **Context-first** — the ad (thumbnail, title, price) is always pinned at the top of the chat view. Never hidden.
- **Role clarity** — you're either a buyer or a seller. The inbox filter makes this explicit so users can work both sides of the marketplace without confusion.
- **Minimum viable interface** — name, last message, timestamp, send. Nothing else unless essential.

---

## 2. User Flows

### 2.1 — Opening Messages (entry point)
```
Profile → Messages tab
        ↓
Conversation list loads — sorted by most recent
   → Tabs: All | Buying | Selling
   → Each row: avatar + online dot, name, last message preview, timestamp
        ↓
Tap a row
        ↓
Chat view opens — ad context bar pinned at top
        ↓
Scroll through history → type → send
```

### 2.2 — Starting a New Conversation (from a listing)
```
Browse listings
        ↓
Open a listing detail page
        ↓
Tap "Message Seller" button
        ↓
New chat opens with the ad pre-loaded in the context bar
   → If a conversation already exists for this ad → resume it
   → If first contact → create new conversation
        ↓
Type first message → send
        ↓
Conversation appears in inbox under "Buying" tab
```

### 2.3 — Receiving a Message (passive)
```
User is offline
        ↓
Push notification / email notification sent
        ↓
User opens app → unread badge on Messages icon
        ↓
Conversation list → unread row highlighted
        ↓
Opens chat → reads message → replies
```

---

## 3. Screens & Components

### Screen 1 — Conversation List (`/profile/chat`)

| Element | Details |
|---|---|
| Page header | "Messages" title + `All / Buying / Selling` tab filter |
| Conversation row | Avatar (initials + online dot), name, last message preview, relative timestamp, chevron |
| Empty state | Per-tab message: "No buying conversations yet" |
| Scroll | Infinite scroll or pagination for large inboxes |

**Tab filter logic:**
- `All` — every conversation
- `Buying` — conversations where `convo.role === "buying"` (I enquired about their listing)
- `Selling` — conversations where `convo.role === "selling"` (they enquired about my listing)

### Screen 2 — Chat View

| Element | Details |
|---|---|
| Ad context bar (fixed top) | Thumbnail image, listing title, price pill, category, contact name + online dot, "View ad →" link |
| Message thread | Scrollable. My messages right (dark), their messages left (light). Timestamp below each bubble. |
| Input bar (fixed bottom) | Auto-growing textarea, send button (arrow icon). Enter = send, Shift+Enter = newline. Disabled when empty. |
| Back button (mobile only) | Top-left chevron returns to conversation list |

---

## 4. Data Model

These are the TypeScript types that define the shape of data from the API.

```ts
// A single chat message
type Message = {
  id: string;
  from: "me" | "them";   // relative to the logged-in user
  text: string;
  time: string;           // formatted display string: "4/18 9:51 AM"
  // Future: status: "sent" | "delivered" | "read"
};

// The classifieds listing this conversation is about
type Ad = {
  id: string;             // used to build the "View ad" link
  title: string;
  price: string;
  category: string;
  imageUrl: string;       // thumbnail — Next.js <Image> in production
  // Current POC: uses a Tailwind bg color class as placeholder
};

// One full conversation thread
type Convo = {
  id: string;
  name: string;           // the other person's display name
  avatarUrl?: string;     // optional photo — falls back to initials
  initials: string;       // 2-letter fallback for avatar
  online: boolean;        // real-time presence status
  unreadCount?: number;   // badge for unread messages
  lastMessage: string;    // preview text shown in the list
  lastTime: string;       // relative label: "9:51 AM", "Yesterday", "Mon"
  role: "buying" | "selling";
  ad: Ad;
  messages: Message[];    // paginated in production — first page only on load
};
```

---

## 5. API Integration Plan

The POC uses static mock data. Here is every integration point and what needs to happen at each.

### 5.1 — Fetch Conversation List

```ts
// Replace CONVOS constant with:
const { data: convos, isLoading } = useQuery(
  ["conversations", activeTab],
  () => api.get(`/conversations?role=${activeTab === "all" ? "" : activeTab}`)
);
```

**Endpoint:** `GET /conversations?role=buying|selling`
**Auth:** Bearer token (logged-in user only)
**Returns:** `Convo[]` (without `messages` — list view only needs previews)
**Notes:** Sort by `updatedAt DESC`. Include `unreadCount` for badge support.

---

### 5.2 — Fetch Messages for a Conversation

```ts
// When a conversation is opened, load its messages:
const { data: messages } = useQuery(
  ["messages", conv.id],
  () => api.get(`/conversations/${conv.id}/messages?page=1&limit=50`)
);
```

**Endpoint:** `GET /conversations/:id/messages`
**Returns:** `Message[]` sorted oldest-first
**Notes:** Paginate — load latest 50 first, fetch more on scroll-to-top.

---

### 5.3 — Send a Message

```ts
// In ChatView.handleSend():
const mutation = useMutation(
  (text: string) => api.post(`/conversations/${conv.id}/messages`, { text }),
  {
    onMutate: (text) => {
      // Optimistic update — add message immediately before API responds
      setMessages(prev => [...prev, { id: `temp-${Date.now()}`, from: "me", text, time: formatNow() }]);
    },
    onError: () => {
      // Remove the optimistic message and show an error toast
    },
  }
);
```

**Endpoint:** `POST /conversations/:id/messages`
**Body:** `{ text: string }`
**Returns:** The created `Message` object with real `id` and `time`
**Notes:** Use optimistic updates for instant feel. Replace temp ID on success.

---

### 5.4 — Start a New Conversation (from listing page)

```ts
// Triggered by "Message Seller" button on a listing detail page
const mutation = useMutation(
  (adId: string) => api.post("/conversations", { adId }),
  {
    onSuccess: (newConvo) => router.push(`/profile/chat?convoId=${newConvo.id}`),
  }
);
```

**Endpoint:** `POST /conversations`
**Body:** `{ adId: string }`
**Logic:** Backend checks if a conversation already exists for this user+ad pair. Returns existing or creates new.

---

### 5.5 — Real-Time Updates (WebSocket / SSE)

For live online presence and instant message delivery:

```ts
// Subscribe to conversation events after list loads
useEffect(() => {
  const socket = new WebSocket(`wss://api.example.com/chat?token=${authToken}`);
  
  socket.onmessage = (event) => {
    const { type, data } = JSON.parse(event.data);
    
    if (type === "new_message" && data.convoId === selected?.id) {
      // Append to current chat view
      setMessages(prev => [...prev, data.message]);
    }
    if (type === "new_message") {
      // Update last message preview in conversation list
      updateConvoPreview(data.convoId, data.message);
    }
    if (type === "presence_update") {
      updateOnlineStatus(data.userId, data.online);
    }
  };

  return () => socket.close();
}, [selected?.id, authToken]);
```

**Alternative:** Server-Sent Events (SSE) via `GET /conversations/stream` — simpler if you don't need bidirectional real-time.

---

### 5.6 — Mark as Read

```ts
// Call when a conversation is opened
useEffect(() => {
  if (selected) {
    api.patch(`/conversations/${selected.id}/read`);
    clearUnreadBadge(selected.id);
  }
}, [selected?.id]);
```

**Endpoint:** `PATCH /conversations/:id/read`
**Effect:** Sets `unreadCount = 0`, marks all messages as read for this user.

---

### 5.7 — Push Notifications (mobile / web)

When the user receives a message while offline:

1. **Backend** sends a push via FCM (mobile) or Web Push (browser)
2. **Payload:** `{ type: "new_message", convoId, senderName, preview }`
3. **On tap:** Deep-link to `/profile/chat?convoId=<id>` — chat view opens directly
4. **Email fallback:** If user hasn't been online for >24h, send email digest

---

## 6. UI States to Handle

| State | Where | What to show |
|---|---|---|
| Loading conversations | Conversation list | Skeleton rows (3–5 placeholder rows) |
| Loading messages | Chat view | Skeleton bubbles |
| Empty inbox | Conversation list (All tab) | "No messages yet. Browse listings to get started." |
| Empty filtered tab | Conversation list (Buying/Selling) | "No [buying/selling] conversations yet." |
| Send error | Chat view | Inline error under bubble: "Failed to send. Tap to retry." |
| Contact offline | Ad context bar | Grey dot + no online label |
| Other person typing | Chat view | Typing indicator ("…" animated dot) |
| Listing no longer active | Ad context bar | "This listing is no longer active" banner |
| Blocked user | Chat view | "You can't message this user" state |

---

## 7. Security & Safety Considerations

- **Auth guard:** The entire `/profile/chat` route requires an authenticated session. Middleware should redirect unauthenticated users to login.
- **Message sanitisation:** All message text must be sanitised on the backend before storage and on render. Never use `dangerouslySetInnerHTML` for message content.
- **Rate limiting:** Enforce server-side message send rate limits (e.g. max 10 messages/minute) to prevent spam.
- **Reporting:** Each conversation should have a "Report" action. Attach `convoId` and `reportedUserId` to the report payload.
- **Phone/email detection:** Consider server-side scanning of message content for phone numbers or emails shared too early — common fraud vector on classifieds platforms.

---

## 8. File Structure (full integration)

```
app/
  profile/
    chat/
      page.tsx              ← conversation list (this POC lives here for now)
      [id]/
        page.tsx            ← individual chat view (can be split out later)

components/
  chat/
    ConversationList.tsx    ← extract from page.tsx when splitting
    ConversationRow.tsx
    ChatView.tsx
    ChatHeader.tsx
    MessageBubble.tsx
    ChatInput.tsx
    TypingIndicator.tsx     ← future: real-time typing dots
    EmptyState.tsx

  ui/
    tabs.tsx                ← already created ✓

lib/
  hooks/
    useConversations.ts     ← React Query hook: GET /conversations
    useMessages.ts          ← React Query hook: GET /conversations/:id/messages
    useChatSocket.ts        ← WebSocket subscription hook
  stores/
    chatStore.ts            ← Zustand: selected convo, unread counts, optimistic updates
```

---

## 9. Phased Build Plan

### Phase 1 — POC (done ✓)
- [x] Conversation list with avatar, online dot, last message, timestamp
- [x] Buying / Selling / All tab filter
- [x] Chat view with ad context bar (title, price, category, "View ad" link)
- [x] Message bubbles (me/them, timestamps)
- [x] Auto-growing textarea, Enter to send, optimistic local state
- [x] Mobile-first: full-screen list → full-screen chat
- [x] Desktop: two-panel side-by-side layout
- [x] Placeholder Header + Footer

### Phase 2 — Real API
- [ ] Swap mock data for `useConversations` hook (React Query)
- [ ] Swap mock messages for `useMessages` hook with pagination
- [ ] `POST /conversations/:id/messages` on send with optimistic update
- [ ] `PATCH /conversations/:id/read` on open
- [ ] Skeleton loading states for list and chat view
- [ ] `POST /conversations` from listing detail page ("Message Seller")
- [ ] Replace ad thumbnail div with `<Image>` component
- [ ] Deep-link support: `/profile/chat?convoId=x` opens directly into a chat

### Phase 3 — Real-Time
- [ ] WebSocket hook (`useChatSocket`) for live message delivery
- [ ] Presence updates (online/offline dot goes live)
- [ ] Typing indicator ("…" animated dots)
- [ ] Unread badge on conversation list rows + Messages nav icon

### Phase 4 — Polish & Safety
- [ ] Message send error state + retry
- [ ] "Listing no longer active" banner
- [ ] Report conversation flow
- [ ] Block user action
- [ ] Push notification deep-link handling
- [ ] Infinite scroll / load more messages on scroll-to-top

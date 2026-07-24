# Delete Account Journey — Analysis & Memory

## Final Flow (2026-04-15)

### 1. Entry Point (Danger Zone Banner)
- Fixed, inline warning banner at bottom of profile page
- Responsive: icon, title, description, and button layout adapts for mobile/tablet/desktop
- Button triggers eligibility check (API placeholder)
- Error handling: inline error in banner if not eligible
- Button disables and shows spinner while loading

### 2. Multi-Stage Confirmation (Zustand-powered)
- All state (stage, reasons, details, confirmed, loading, error) managed in Zustand store
- Stage 2: Feedback
  - Reason chips (multi-select)
  - Optional free-text details
  - "Continue" posts feedback (API placeholder)
- Stage 3: Review & Confirm
  - Shows selected reasons and details
  - Accessible custom checkbox (now a real input, not div)
  - "Delete my account" disables until confirmed
  - Error handling: inline error if API fails
- Stage 4: Goodbye
  - Personalized heading: "{userName}, sorry to see you go."
  - Factual subtext: "Your account and all associated data have been permanently deleted."
  - Warm, open-door message: "You're always welcome back — just sign up with the same email or phone number."
  - Button: "Back to Home" (slate dark, routes to /)

### 3. API Integration Points
- All API calls are placeholders with clear TODOs:
  - `GET /account/delete-eligibility`
  - `POST /account/delete-feedback`
  - `DELETE /account`
- Dev only needs to swap in real fetch/axios logic

### 4. Copy & UX Principles
- No bold, only font-medium/semibold for hierarchy
- Empathetic, clear, and retention-oriented copy
- No text truncation; all text wraps naturally
- Button and layout always accessible and visually clear
- All error and loading states handled inline
- No dead ends: always a way back to Home

### 5. Accessibility
- All interactive elements keyboard-accessible
- Checkbox uses real input for full a11y
- Color contrast and focus rings respected

### 6. Cleanliness & Dev Handoff
- No unused state or props
- All lint errors resolved (no-unescaped-entities, ARIA, etc.)
- All TODOs for API integration are clear and isolated
- No POC-only logic remains ("Start over" replaced with "Back to Home")

---

**Ready for dev handoff.**
- Plug in API calls
- Replace `userName` with real user session data
- All UI, state, and copy is production-grade and accessible.

# Leadzam: First-run "All Leads" redesign (prototype)

A focused redesign of the **empty All Leads page** in Leadzam, built as a working React + TypeScript prototype.

- Figma: https://www.figma.com/design/N7yNbV3KtAKY4L2fIaEXxL/LeadZam-%E2%80%93-Leads-Empty-State-Redesign?node-id=0-1&t=w55U8PzpJhPsgShe-1
- UI/UX audit: https://drive.google.com/file/d/1Z6Db-3xSUk1ScPx3wa0N4v21SllmsZx-/view?usp=sharing
- Walkthrough video: https://drive.google.com/file/d/1Qzwqtm5aMilq9XvwZVSZYvKrdS34woIM/view?usp=sharing

> This is an independent prototype made for an assessment. It uses mock data only, has no backend, and is not connected to the real Leadzam product.

## Run it locally

```bash
npm install
npm run dev      # opens http://localhost:5173
npm run build    # type-checks and builds
npm run lint
```

Requires Node 18+. Data lives in memory and resets on refresh.

A **"Prototype controls"** bar at the bottom jumps straight to the states a reviewer wants to see: Empty, Loading, Load error, With sample data. It is not part of the design.

## What I built

| Area | What it does |
| --- | --- |
| Empty state | Three clear ways to get leads in (add one, upload a file, connect a source) plus an optional sample-data path |
| Add lead drawer | Inline validation, "phone or email" rule, duplicate-phone error, loading state, focus moves to the first error |
| Upload panel | Reads a CSV, checks every row before importing, shows row-level problems, then imports the valid rows |
| Sample data | Rows are labelled SAMPLE, a banner explains them, and one click removes them |
| Page states | Skeleton loading, error with retry, "no search results" |
| Responsive | Cards stack on narrow screens, the drawer goes full width, no horizontal page scroll at 375px |

## Project structure

```
src/
  types.ts              shared types (Lead, PageStatus, ...)
  index.css             design tokens (colour, spacing, radius) + base styles
  data/                 mock sample leads and team members
  lib/                  pure logic: validation, CSV parsing, formatting
  hooks/                useLeads (the in-memory "backend"), useToasts
  components/           Button, Drawer, TextField, SelectField, Toasts,
                        EmptyState, AddLeadForm, UploadPanel, LeadsTable,
                        SampleBanner, LoadingState, ErrorState, AppShell
  App.tsx               wires the pieces together
```

Styling is plain CSS with CSS variables as design tokens, one `.css` file next to each component. No UI library, so every rule can be read and explained.

## Accessibility

- Drawers use the native `<dialog>` element: focus trap, Esc to close, page behind is inert, focus returns to the button that opened it.
- Every input has a visible label. Required fields are marked and use `aria-required`. Errors are linked with `aria-describedby`, inputs get `aria-invalid`, and a summary uses `role="alert"`.
- Toasts and loading messages are announced through live regions.
- Keyboard focus is always visible. The file drop zone is a real `<label>` around a real file input, so it works with keyboard and screen readers.
- Touch targets are at least 44px. Text and input borders meet contrast guidelines. `prefers-reduced-motion` is respected.

## My thinking

**Biggest UX problem I found.** A new customer lands on the All Leads page with no leads, and the page gives no obvious next step. The text only mentions forms ("Leads will appear here once forms start collecting submissions"), there is no button, and the real options (add a lead, bulk upload, integrations) are hidden in a small dropdown behind "Add Lead". The product already has good tools for getting leads in. The empty page just doesn't show them.

**Why this one.** It is the first thing every new user sees on the page they will use most, the fix is clear, and it is small enough to build properly. It also covers empty, loading, error, validation and success states. The other findings (onboarding answers not shaping the setup guide, faded disabled buttons with no explanation, "0 of 6" next to "0/22") matter, but they are less tied to the first successful action.

**What I intentionally did not redesign.** The sidebar, the dashboard, signup, the setup guide, the Filters/Columns toolbar, and the real leads table beyond what was needed to show the result. I also left the Bulk Upload "map columns" step alone: it is already good.

**Trade-offs.**
- On the empty page I removed the header buttons so nothing competes with the three cards. They return once leads exist, so upload stays discoverable.
- "Add a lead" is the single primary button. Someone with a spreadsheet may want Upload first, so this is a hypothesis to test.
- The prototype auto-detects CSV columns instead of showing a mapping step, to keep scope small.
- Validation runs on blur and submit rather than on every keystroke, to avoid showing errors on fields people haven't reached.

**How it improves the task.** Before: read a sentence, notice a small link or find the sidebar button, open a dropdown, pick an option. After: choose one of three labelled cards on the page. Errors now say what is wrong and where, and an import shows exactly which rows will be skipped before anything is saved.

**What I would validate before shipping.**
- Which path new users actually pick first (add one, upload, connect, sample), to decide the primary button.
- Whether sample data helps people learn or leaves them with data to clean up. Compare activation of users who load samples and those who don't.
- Time to first lead and drop-off on the empty page, before and after.
- Whether the "phone or email" rule matches how telecalling teams really capture leads.

**With two more hours.**
- Use the actual Leadzam design tokens and components instead of my own.
- Add a column-mapping step to the upload.
- Add component tests for validation and CSV parsing, plus a Playwright check for the main flow.
- Keep real table semantics in the stacked mobile layout.
- Test with a screen reader.

## Assumptions and limitations

- Phone numbers are assumed to be Indian mobiles (10 digits, +91).
- Excel (.xlsx) upload is not parsed in this prototype. It is rejected with a clear message and CSV is supported.
- The mobile card layout uses `display: block` on table elements, which can weaken table semantics in some screen readers. A production version should keep the roles.
- Navigation and "Connect a source" are placeholders.
- Fonts fall back to the system font. The real product uses a different typeface.

## AI usage notes

**Tools used:** Claude (chat) for the audit structure, the component code and this README. Figma for the design.

**How AI helped.**
- Audit: turned my notes and screenshots into prioritised findings and helped me see the pattern behind them.
- Design: suggested the three-card structure and which states to cover.
- Code: wrote the first version of the components, validation and CSV parser.

**Something I changed because the AI was wrong.** Early on the AI guessed the sidebar was icon-only and unlabelled, and listed that as a problem. I hovered over it myself, saw it expands with full labels, and removed it from my audit. It also first suggested there might be no CSV import on this page. I checked the Add Lead dropdown and found Bulk Upload there, which changed my finding from "missing" to "hidden".

**What I verified myself instead of trusting the AI.**
- Every audit finding by reproducing it in the live product (the faded Finish button doing nothing when clicked, the setup guide contents, the empty page, the Add Lead dropdown, the sample data).
- That the prototype runs and the main flow works. I ran it locally and tried the Add Lead panel by hand: submitting it empty to see the errors, then saving a lead and checking it appeared in the table with the count and the header buttons.
- That I can explain each file and the main decisions.
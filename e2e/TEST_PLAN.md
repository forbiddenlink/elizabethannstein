# Playwright Test Strategy

## 1. Risk-Based Test Plan

### Critical Risk (Blast Radius: HIGH)
| Flow | Risk If Broken | Current Coverage | Priority |
|------|---------------|------------------|----------|
| Homepage loads | Users see blank page, 100% bounce | None (E2E) | P0 |
| Project modal deep-linking | SEO/shareable URLs broken | None | P0 |
| Contact form submission | Lost leads, revenue impact | None | P0 |
| Navigation (CMD+K) | Power users frustrated | None | P0 |
| 3D scene fallback | WebGL errors crash page | None | P0 |

### High Risk (Blast Radius: MEDIUM)
| Flow | Risk If Broken | Current Coverage | Priority |
|------|---------------|------------------|----------|
| /work list view | Backup navigation fails | None | P1 |
| /work/[slug] case studies | SSG pages 404 | None | P1 |
| Chat API validation | 500 errors, bad UX | None | P1 |
| Keyboard navigation | Accessibility failure | None | P1 |
| Mobile layout | 60%+ users impacted | None | P1 |

### Medium Risk (Blast Radius: LOW)
| Flow | Risk If Broken | Current Coverage | Priority |
|------|---------------|------------------|----------|
| About/Privacy pages | Static content missing | None | P2 |
| OG image generation | Social sharing degraded | None | P2 |
| SEO schema.org | Rich snippets missing | None | P2 |
| Error pages (404, 500) | Poor error UX | None | P2 |

---

## 2. Test Suites

### Smoke Tests (Pre-Deploy Gate)
Run on every PR and before every deploy. Must pass in <2 minutes.

| Test | File | What It Validates |
|------|------|------------------|
| Homepage loads | `homepage.smoke.spec.ts` | 200 status, no JS errors, core elements visible |
| All routes return 200 | `routes.smoke.spec.ts` | /, /work, /about, /contact, /privacy |
| No broken links | `links.smoke.spec.ts` | All internal hrefs resolve |
| Contact form renders | `contact.smoke.spec.ts` | Form fields present, button clickable |
| API health | `api.smoke.spec.ts` | /api/chat accepts valid POST |

### Regression Tests (Full Suite)
Run on main branch merges and nightly.

| Category | Tests |
|----------|-------|
| Navigation | Command palette, keyboard nav, browser back/forward |
| Forms | Contact form validation, error states, success state |
| Project modal | Deep-linking, ESC close, backdrop click, focus trap |
| API | Input validation, error handling, timeout handling |
| Mobile | Touch gestures, responsive layouts, viewport switching |
| Error states | 404 page, network failures, empty states |
| Accessibility | Tab navigation, ARIA labels, skip links |

---

## 3. Test Data Requirements

### Static Data
- Project IDs from `galaxyData.ts` (84 projects)
- Galaxy IDs: enterprise, ai, full-stack, devtools, creative, experimental
- Test project slug: `lumira` (featured, has all fields)

### Form Data
```typescript
const validContact = {
  name: 'Test User',
  email: 'test@example.com',
  message: 'Test message for automation'
}

const invalidContact = {
  emptyFields: { name: '', email: '', message: '' },
  invalidEmail: { name: 'Test', email: 'not-an-email', message: 'Test' },
  longMessage: { name: 'Test', email: 'test@example.com', message: 'x'.repeat(5000) }
}
```

### API Test Data
```typescript
const validChatRequest = {
  messages: [{ role: 'user', content: 'Tell me about React projects' }]
}

const invalidChatRequests = [
  { messages: [] },                           // Empty array
  { messages: [{ role: 'user' }] },          // Missing content
  { messages: [{ content: 'test' }] },       // Missing role
  { messages: Array(51).fill({ role: 'user', content: 'x' }) }, // Too many
  { messages: [{ role: 'user', content: 'x'.repeat(2001) }] }   // Too long
]
```

---

## 4. File Structure

```
e2e/
├── fixtures/
│   └── test-fixtures.ts     # Shared test setup, custom matchers
├── pages/
│   ├── base.page.ts         # Base page object
│   ├── home.page.ts         # Homepage selectors & actions
│   ├── work.page.ts         # /work page selectors
│   ├── contact.page.ts      # Contact form selectors
│   └── modal.page.ts        # Project modal selectors
├── smoke/
│   ├── homepage.smoke.spec.ts
│   ├── routes.smoke.spec.ts
│   ├── links.smoke.spec.ts
│   ├── contact.smoke.spec.ts
│   └── api.smoke.spec.ts
├── regression/
│   ├── navigation/
│   │   ├── command-palette.spec.ts
│   │   └── keyboard-nav.spec.ts
│   ├── forms/
│   │   └── contact-form.spec.ts
│   ├── modals/
│   │   └── project-modal.spec.ts
│   ├── api/
│   │   └── chat-api.spec.ts
│   ├── mobile/
│   │   └── responsive.mobile.spec.ts
│   └── errors/
│       └── error-pages.spec.ts
└── TEST_PLAN.md             # This file
```

---

## 5. Environment Configuration

### Local Development
```bash
# Start dev server and run tests
pnpm test:e2e

# Run specific test file
pnpm exec playwright test e2e/smoke/homepage.smoke.spec.ts

# Run with UI
pnpm exec playwright test --ui
```

### CI (GitHub Actions)
```yaml
env:
  BASE_URL: http://localhost:3000
  CI: true
```

### Staging
```bash
BASE_URL=https://staging.elizabethannstein.com pnpm test:e2e
```

---

## 6. Priority Matrix

### P0 - Critical (Smoke Suite)
- [ ] Homepage loads without JS errors
- [ ] Project modal opens via URL (?p=slug)
- [ ] Contact form submits (mailto: opens)
- [ ] All main routes return 200
- [ ] No console errors on any page

### P1 - High (Core Regression)
- [ ] Command palette (CMD+K) opens/closes
- [ ] Search filters projects correctly
- [ ] Keyboard navigation (1-6, arrows, ESC)
- [ ] Browser back/forward with modal
- [ ] Contact form validation (required, email format)
- [ ] Mobile responsive at 320px, 768px
- [ ] /api/chat rejects invalid input

### P2 - Medium (Extended Regression)
- [ ] 404 page renders with animation
- [ ] Error boundary shows fallback
- [ ] OG images generate for projects
- [ ] Schema.org markup valid
- [ ] Focus trap in modal
- [ ] Screen reader announcements

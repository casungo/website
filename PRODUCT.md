# Product PRD — Casungo Website

Audit date: 2026-08-12
Status: portfolio site implementation; canonical live deployment is mismatched.

## Intent

- Target users: people who want to understand Alessandro’s work and reach the maintained projects from one personal site.
- Core job: provide localized profile, project catalog, contact/portfolio context, and selected supporting content through stable locale routes.
- Non-goals: a product dashboard, a duplicate project README, or a domain that silently serves a different application.

## Current maturity

### Shipped or verified in the repository

The Astro/Svelte/Tailwind site contains localized routes, project content collections/cards, profile pages, Spotify loading, and Cloudflare Worker configuration. Repository instructions define `/en/`, `/it/`, root redirect, and project routes.

### Real-use evidence

The expected live behavior was not verified. On 2026-08-12 `https://casungo.top/` returned the Gazzetta Recap page, `/en/`, `/it/`, and `/projects` returned 404, and `www.casungo.top` had a certificate hostname mismatch. This is a deployment/route ownership blocker, not evidence that the local site source is absent.

## Work state

- Completed: localized portfolio implementation and project catalog source.
- Active: none independently verified.
- Blocked: canonical domain, Cloudflare route ownership, and deployment alignment with this repository.
- Frozen/undecided: choose whether this repository or Gazzetta Recap owns `casungo.top` before any release action.

## Next action / owner decision

Resolve canonical domain/Cloudflare route ownership, then run one read-only check of root redirect, both locale routes, and project pages; no deployment was performed here.

## Anti-slop audit

### Text

No confirmed copy defect at 75% confidence or higher in the unverified local site. The visible domain copy belongs to Gazzetta Recap and is recorded as a route conflict, not silently attributed to this repository.

### Code

No confirmed anti-slop code defect at the threshold. The absence of a test framework is documented in [AGENTS.md](AGENTS.md#L27), but the primary blocker is the observed live route mismatch.

### Design

No confirmed design defect at the threshold because the intended site was not the live surface inspected. Do not judge the local design from the unrelated Gazzetta page.

## Evidence sources

- [AGENTS.md](AGENTS.md)
- `src/pages/`, `src/components/`, `src/content/`, `src/i18n/`
- `astro.config.mjs`, `wrangler.jsonc`, `package.json`
- Live read-only checks of `casungo.top`, `/en/`, `/it/`, `/projects`, and `www.casungo.top` on 2026-08-12.
- [Gazzetta Recap PRODUCT.md](../gazzettaRecap/PRODUCT.md) records the application currently served at the root domain.

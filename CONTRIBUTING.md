# Contributing to GNSSMetrics

Thanks for taking the time to contribute.

GNSSMetrics is a technical educational and tooling project focused on GNSS engineering, space weather awareness, and practical navigation software. Contributions are welcome, especially when they improve accuracy, clarity, reliability, or user experience.

## Before you start

- Open an issue first for larger feature ideas, structural changes, or new tooling proposals.
- Keep contributions scoped and focused. Small, reviewable pull requests are much easier to merge.
- Accuracy matters more than speed for educational or scientific content. When possible, include primary references.

## Local setup

Requirements:

- Node.js `>=22.12.0`
- npm

Install and run locally:

```bash
npm install
npm run dev
```

Build before opening a pull request:

```bash
npm run build
```

## Branches and pull requests

- Create a feature branch from `main`.
- Use clear branch names such as `feat/add-rinex-tool`, `fix/footer-links`, or `docs/update-ppp-article`.
- Keep one logical change per pull request when possible.
- Write a short PR description covering what changed, why it changed, and anything reviewers should check carefully.

## What kinds of contributions are helpful

- Bug fixes
- Broken link fixes
- UI or accessibility improvements
- Documentation improvements
- Technical corrections in GNSS educational content
- New project or tool suggestions

## Content quality expectations

- Prefer vendor-neutral wording unless a vendor-specific detail is essential.
- State assumptions clearly in technical explanations.
- Cite primary or authoritative sources for standards, equations, protocols, or performance claims.
- Avoid adding AI-generated technical content without review and verification.

## Style notes

- Match the existing Astro project structure and visual language.
- Keep copy concise and technically precise.
- Avoid unnecessary dependencies for simple features.

## Security

Do not open public issues for secrets, credentials, or vulnerabilities. Report security concerns privately using the instructions in `SECURITY.md` once that policy is added.

## Licensing

By submitting a contribution, you agree that your contributions will be licensed under the MIT License used by this repository.

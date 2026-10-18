# LeaseHive Client — Codex Engineering Instructions

> Scope: Angular frontend repository (`leasehive-client`). Follow existing project conventions and actual installed Angular/PrimeNG versions rather than assuming a different version.

## Technology and architecture

* Angular, TypeScript, PrimeNG, Tailwind CSS, RxJS and Angular Reactive Forms.
* Preserve the existing folder, routing, feature/module, shared-component, service, model, and environment configuration patterns.
* Use existing PrimeNG components, styling tokens and Tailwind conventions. Do not introduce another UI framework or UI library without approval.
* Keep API calls in existing services and domain behavior in appropriate services/components. Do not duplicate backend business rules in the browser.
* Respect current Angular patterns (standalone vs NgModules, signals vs observables, interceptors and lazy loading) as found in this repository.

## Forms, UX and accessibility

* Prefer Reactive Forms and existing form helpers/validators.
* Include required-field and format validation, meaningful error messages, disabled/submitting states, loading indicators, empty states and successful-save feedback according to existing patterns.
* Avoid double submissions; clean up subscriptions with established RxJS/Angular lifecycle patterns.
* Keep keyboard navigation, focus, labels and accessible feedback usable.
* Do not change global styling or unrelated screens for a local feature request.

## API contracts and multi-tenancy

* Reuse existing typed models, API services, HTTP interceptors, endpoints, response/error conventions and environment settings.
* Do not invent API routes, DTO properties or backend behavior. Inspect the relevant API contract or ask when unavailable.
* Use server-issued tenant and user context. Do not treat browser-controlled `TenantId` as an authorization mechanism.
* Honor organization/branch selection and scope as implemented by existing backend contracts.
* Do not log tokens, passwords, PII or sensitive responses. Never hardcode secrets.

## Authentication and permissions

* Reuse existing authentication flow and token handling; do not introduce alternative storage or auth frameworks without approval.
* Reuse the existing `/api/security/me` security-context API, `PermissionService`, and `\*appPermission` directive where present.
* Follow the existing normalized permission-code convention and use `hasPermission`, `hasAny` and `hasAll` appropriately.
* Hide or disable unauthorized actions in the UI, but remember that the backend remains the security authority.
* `UserPartyAccess` is only for Party entity data; do not impose its restrictions on Assets, Contracts, Procurement or Billing unless explicitly requested.
* Handle 401/403 and expired sessions through existing interceptor/navigation patterns.

## PrimeNG and TypeScript conventions

* Confirm installed PrimeNG component APIs and imports before editing templates; avoid using APIs from other major versions.
* Follow existing patterns for `p-table`, dropdown/select, dialogs, buttons, date inputs, validation and responsive layouts.
* Keep TypeScript strongly typed; avoid `any` where a known interface or type can be used.
* Prevent subscription leaks and unnecessary repeated HTTP requests; use RxJS operators purposefully.
* Keep backend enum/picklist mappings and form values consistent with actual contracts.

## Codex execution and context efficiency

1. Identify the exact page, component, service, model and route affected by the task.
2. Inspect only relevant files and nearby reusable examples; broaden searches only if necessary.
3. Make the smallest cohesive implementation; avoid unrelated formatting, renaming, dependency upgrades or sweeping refactors.
4. For routine tasks, give a brief plan and proceed. Ask for approval before significant UI architecture, authentication/authorization or breaking API changes.
5. When backend changes are necessary, explain the contract and coordinate with the separate `LeaseHive` source folder; follow its own `AGENTS.md`.
6. Avoid repeatedly running broad builds/tests after tiny changes or retrying unchanged failures.

## Validation and code review

* Small change: perform relevant TypeScript/template checks or targeted tests when practical.
* Medium change: run `npm run build` and affected tests when available.
* Large or security-sensitive change: broader frontend tests and focused integration review.
* Run `npm test` only when appropriate to the project's configured test runner; prefer targeted non-watch execution for automated tasks.
* Review changed code for form validation, RxJS leaks, incorrect API contracts, PrimeNG misuse, error/loading states, missing permission checks, accessibility and regressions.
* Do not claim tests or builds passed unless executed. Report existing failures separately.

## Azure DevOps tickets (only when explicitly requested)

1. Read ticket and acceptance criteria from authorized tools or request details.
2. Inspect relevant implementation and present a plan including UI/API/security impact.
3. Wait for human approval before implementing the ticket.
4. Create a ticket-specific branch when authorized, implement minimally, add tests and validate.
5. Summarize changed files and risks; create a linked PR only when authorized.
6. Never automatically merge or deploy production changes.

## Completion format

* Outcome and files changed.
* UI/API contract impacts (if any).
* Tests/builds actually executed and results.
* Remaining risks or blockers.
Keep the report concise. Do not commit, push, merge or deploy without authorization.


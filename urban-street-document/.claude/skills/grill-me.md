---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me". Ends with a structured Requirement Document.
---

# Grill Me

Elicit complete understanding through structured interrogation, then produce a Requirement Document.

---

## Phase 1: Interview

Interview relentlessly about every aspect of the plan or design.
Walk down each branch of the decision tree, resolving dependencies between decisions one-by-one.

Rules:
- Ask **one question at a time**
- For each question, provide your **recommended answer** as a starting point
- If a question can be answered by exploring the codebase, explore instead of asking
- Keep asking until no critical unknowns remain
- Focus on: **problem, scope, constraints, users, success criteria, API decisions, security model**

Stop when:
- All branches of the decision tree are resolved
- No vague or untestable statements remain
- Scope is clearly bounded
- All items in the **Pre-Close Checklist** below are answered

### Pre-Close Checklist

Before ending Phase 1, verify these decision categories are resolved:

**API & Data Contract**
- [ ] Partial update semantics — does `null` mean "clear field" or "field not sent"?
- [ ] Response shape — what does each endpoint return on success? full object or partial?
- [ ] Pagination / ordering — if list endpoint exists, how is it sorted and paginated?
- [ ] Idempotency — which endpoints are safe to retry?

**Security**
- [ ] Token / session storage strategy — where does the client store auth tokens? (HttpOnly Cookie / localStorage / memory)
- [ ] Ownership & authorization — does BE verify the resource belongs to the requesting user?
- [ ] Rate limiting — are any endpoints (auth, email, mutation) rate-limited? limits?
- [ ] Sensitive data logging policy — what must never appear in logs?

**Non-Functional**
- [ ] CORS policy — which origins are allowed?
- [ ] Timeout per endpoint type — what are acceptable response time limits?
- [ ] Error response envelope — what is the JSON shape of error responses?

**State & Business Rules**
- [ ] State machine — if the resource has states (e.g. CURRENT / CLOSED), what transitions are allowed?
- [ ] Timezone — which timezone is authoritative for date/time decisions?
- [ ] Immutability — which fields or resources are read-only after creation?

---

## Phase 2: Produce Requirement Document

After interviewing is complete, output the following document without prompting:

```
## Requirement Summary
- Intent:
- Problem:

## Functional Requirements
- FR-1: [description] | Priority: Must | AC: Done when...
- FR-2: [description] | Priority: Should | AC: Done when...

## Non-Functional Requirements
- NFR-1:
- NFR-2:

## Business Rules
- BR-1:

## Technical Decisions
<!-- Decisions resolved during interview — each entry must be explicit, no "TBD" allowed -->

### API & Data Contract
- Partial update semantics: [null = clear field | absent = unchanged | ...]
- Response shape per endpoint: [full object | partial | ...]
- Error response envelope: { "error": { "code": "...", "message": "...", "fields": {} } }

### Security
- Token storage: [HttpOnly Cookie | localStorage | memory] — reason: ...
- Ownership check: BE verifies [resource].user_id == token.user_id before every mutation
- Rate limits: [endpoint] → [limit/window]
- Log policy: [list of fields that must never appear in logs]

### Non-Functional
- CORS: Allow-Origin = [value]
- Timeouts: [read endpoints: Xs | mutation endpoints: Xs]
- Timezone: [UTC | UTC+7 | ...] used as authoritative for all date decisions

### State & Immutability
- States: [list states and allowed transitions]
- Immutable fields: [list fields that cannot change after creation]

## Constraints
- C-1:

## Assumptions
- A-1:

## Out of Scope
- OOS-1:

## Risks & Ambiguities
- R-1:
```

---

## Anti-Patterns

- Do not ask multiple questions at once
- Do not skip to solutions during the interview
- Do not produce the document mid-interview
- Do not leave any section blank — write "None identified" if empty
- Do not end Phase 1 without completing the Pre-Close Checklist
- Do not write "TBD" in Technical Decisions — every item must be resolved before producing the document

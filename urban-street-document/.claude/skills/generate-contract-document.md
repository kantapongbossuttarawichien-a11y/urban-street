---
name: generate-contract-document
description: Generate an enterprise-ready, versioned contract document defining API, data, error, state, and change rules between frontend, backend, and AI. Use as the single source of truth before design, TDD, and development.
---
# Generate Contract Document (Enterprise‑Ready)
Create a **versioned, enforceable contract** between Frontend, Backend, QA, and AI.  
This document defines **communication boundaries, behavioral guarantees, and change rules** — not implementation details.

---

## Workflow

### 1. Gather Inputs
Required:
- Feature description or Requirement Document
- High-level user flow
- Business constraints

Optional:
- Existing contract or API standards
- Security / compliance requirements
- SLA expectations

Ask internally:
- What decisions are costly to change after release?
- What must be frozen so teams can work independently?
- What failures must be handled deterministically?

---

### 2. Define Contract Scope & Versioning
Define upfront:
- Contract name
- Contract version (semantic versioning recommended)
- Scope (what is covered / explicitly not covered)
- Change policy:
  - Breaking change definition
  - Non-breaking change examples
  - Deprecation rules
  - Backward compatibility window

---

### 3. Define API Contract
For each endpoint:

- Method & path
- AuthN / AuthZ
- Idempotency requirement
- Request schema
- Success response schema
- Error response schema
- Timeout expectations

Rules:
- No implementation details
- Stable field names
- Explicit required vs optional
- Consistent naming across endpoints

---

### 4. Define Data Contract
Define **shared boundary models only**:

- Field name
- Data type
- Required / optional
- Enum constraints
- Source of truth (FE / BE / external)
- Mutability (read-only / writeable)

Rules:
- FE must not send BE‑owned fields
- BE must ignore unknown FE fields unless stated otherwise

---

### 5. Define Error Contract
Standardize failure behavior:

- Error code (stable, machine-readable)
- HTTP status mapping
- Description (human-readable, no sensitive data)
- Retryable vs non-retryable
- Client action expectation (retry / prompt user / block)

Rules:
- No generic error codes
- Same error code must always mean the same thing

---

### 6. Define State & Behavior Contract
For each stateful entity:

- Valid states
- Allowed transitions
- Terminal states
- Invalid transitions (must error)
- **Allowed API actions per state**
- **Forbidden API actions per state**

This enforces behavioral consistency across FE, BE, and tests.

---

### 7. Define Non‑Functional Contract
Lock boundary-level guarantees:

- Timeout
- Rate limit
- Pagination / cursor rules
- Ordering guarantees (if any)
- Consistency expectations (strong / eventual)

These are **contracts**, not optimizations.

---

### 8. Define Security & Compliance Contract (If Applicable)
- Data sensitivity classification
- Logging / masking rules
- Audit requirements
- Regulatory constraints (e.g. GDPR, PDPA)

---

### 9. Validate Contract Quality
Explicitly check for:
- Ambiguous terminology
- Missing error scenarios
- Unhandled state transitions
- Inconsistent naming
- Violations of change policy

Flag issues — do not auto-correct silently.

---

## Output Format

```
# Contract Document: [Feature Name]

## 1. Overview
- Purpose:
- Actors:
- Contract Version:
- Scope:
- Out of Scope:

## 2. Change & Versioning Policy
- Breaking Change Definition:
- Non‑Breaking Change Examples:
- Deprecation Policy:
- Backward Compatibility Window:

## 3. API Contract
### [Endpoint Name]
- Method:
- Path:
- Auth:
- Idempotency:
- Timeout:
- Request:
- Success Response:
- Error Responses:

## 4. Data Contract
### [Entity Name]
| Field | Type | Required | Owner | Mutability | Notes |

## 5. Error Contract
| Code | HTTP | Retryable | Client Action | Description |

## 6. State & Behavior Contract
- States:
- Allowed Transitions:
- Terminal States:
- Allowed Actions per State:
- Forbidden Actions per State:

## 7. Non‑Functional Contract
- Rate Limit:
- Pagination:
- Ordering:
- Consistency:

## 8. Security & Compliance
- Data Sensitivity:
- Logging / Masking:
- Audit Requirements:

## 9. Open Questions / Risks
- Q1:
- R1:
```

---

## Evaluation Criteria

- **Contract Depth**: Small surface, strong behavioral guarantees
- **Change Safety**: Versioning and compatibility are explicit
- **Cross‑Team Independence**: FE / BE / QA can work without sync meetings
- **AI Compatibility**: Can generate tests and code deterministically
- **Enterprise Readiness**: Supports scale, audit, and governance

---

## Anti‑Patterns

- Treating contract as documentation only
- Allowing silent breaking changes
- Encoding UI or DB decisions
- Over‑generalizing for hypothetical futures
- Letting AI infer unstated rules

---

## When to Use

- After Requirement Document approval
- Before Test Spec (TDD)
- Before FE / BE design
- As the authoritative artifact in PR reviews
- As the reference for AI code generation
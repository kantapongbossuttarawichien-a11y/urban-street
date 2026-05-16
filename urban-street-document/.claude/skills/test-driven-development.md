---
name: test-driven-development
description: Use when implementing any feature or bugfix, before writing implementation code. Also use after /generate-contract-document to produce Test Spec from the contract.
---

# Test-Driven Development (TDD)

## Overview

Write the test first. Watch it fail. Write minimal code to pass.

**Core principle:** If you didn't watch the test fail, you don't know if it tests the right thing.

**Violating the letter of the rules is violating the spirit of the rules.**

## When to Use

**Always:**
- New features
- Bug fixes
- Refactoring
- Behavior changes

**Input for Test Spec (Step 5):**
Run this skill after `/generate-contract-document`. The Contract Document is the authoritative input:
- API Contract → integration / API tests
- Error Contract → error-path unit tests
- State & Behavior Contract → state machine tests
- Data Contract → validation tests

**Exceptions (ask your human partner):**
- Throwaway prototypes
- Generated code
- Configuration files

Thinking "skip TDD just this once"? Stop. That's rationalization.

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? Delete it. Start over.

**No exceptions:**
- Don't keep it as "reference"
- Don't "adapt" it while writing tests
- Don't look at it
- Delete means delete

Implement fresh from tests. Period.

## Red-Green-Refactor

```
[RED: Write failing test] → [Verify fails correctly?]
        ↑                          ↓ yes            ↓ wrong failure
        |                  [GREEN: Minimal code]   (fix test, retry)
        |                          ↓
        |                  [Verify all pass?]
        |                    ↓ yes      ↓ no
        |             [REFACTOR]     (fix code)
        |                    ↓
        └──────────── [Next behavior]
```

### RED - Write Failing Test

Write one minimal test showing what should happen.

<Good>
```typescript
test('retries failed operations 3 times', async () => {
  let attempts = 0;
  const operation = () => {
    attempts++;
    if (attempts < 3) throw new Error('fail');
    return 'success';
  };

  const result = await retryOperation(operation);

  expect(result).toBe('success');
  expect(attempts).toBe(3);
});
```
Clear name, tests real behavior, one thing
</Good>

<Bad>
```typescript
test('retry works', async () => {
  const mock = jest.fn()
    .mockRejectedValueOnce(new Error())
    .mockRejectedValueOnce(new Error())
    .mockResolvedValueOnce('success');
  await retryOperation(mock);
  expect(mock).toHaveBeenCalledTimes(3);
});
```
Vague name, tests mock not code
</Bad>

**Requirements:**
- One behavior
- Clear name
- Real code (no mocks unless unavoidable)

### Verify RED - Watch It Fail

**MANDATORY. Never skip.**

```bash
npm test path/to/test.test.ts
```

Confirm:
- Test fails (not errors)
- Failure message is expected
- Fails because feature missing (not typos)

**Test passes?** You're testing existing behavior. Fix test.

**Test errors?** Fix error, re-run until it fails correctly.

### GREEN - Minimal Code

Write simplest code to pass the test.

<Good>
```typescript
async function retryOperation<T>(fn: () => Promise<T>): Promise<T> {
  for (let i = 0; i < 3; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === 2) throw e;
    }
  }
  throw new Error('unreachable');
}
```
Just enough to pass
</Good>

<Bad>
```typescript
async function retryOperation<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    backoff?: 'linear' | 'exponential';
    onRetry?: (attempt: number) => void;
  }
): Promise<T> {
  // YAGNI
}
```
Over-engineered
</Bad>

Don't add features, refactor other code, or "improve" beyond the test.

### Verify GREEN - Watch It Pass

**MANDATORY.**

```bash
npm test path/to/test.test.ts
```

Confirm:
- Test passes
- Other tests still pass
- Output pristine (no errors, warnings)

**Test fails?** Fix code, not test.

**Other tests fail?** Fix now.

### REFACTOR - Clean Up

After green only:
- Remove duplication
- Improve names
- Extract helpers

Keep tests green. Don't add behavior.

### Repeat

Next failing test for next feature.

---

## Acceptance Tests (Step 5: Test Spec)

Acceptance tests verify **feature behavior from the outside** — does the system do what was promised in the Contract Document?

**Scope:** One acceptance test per contract guarantee. Not per code path.

### Format: Given / When / Then

```
Given [precondition / system state]
When  [action performed]
Then  [observable outcome]
```

### Deriving Tests from Contract Document

| Contract Section | Test Type | What to Assert |
|-----------------|-----------|----------------|
| **API Contract** | Integration / E2E | Request → response shape, status code, auth |
| **Error Contract** | Error-path unit | Error code, retryable flag, client action |
| **State & Behavior Contract** | State machine | Allowed transitions succeed, forbidden ones error |
| **Data Contract** | Validation | Required fields rejected if missing, types enforced |
| **Non-Functional Contract** | Performance / load | Timeout, rate limit, pagination boundary |

### Example

**Contract says:**
> `POST /health-metrics` with empty `value` field → `METRIC_VALUE_REQUIRED`, HTTP 400, non-retryable

**Acceptance test (Given/When/Then):**
```typescript
// Given: authenticated user
// When: submitting health metric with empty value
// Then: receives METRIC_VALUE_REQUIRED error, HTTP 400

test('rejects health metric with empty value', async () => {
  const response = await api.post('/health-metrics', {
    type: 'weight',
    value: null,
  });

  expect(response.status).toBe(400);
  expect(response.body.code).toBe('METRIC_VALUE_REQUIRED');
  expect(response.body.retryable).toBe(false);
});
```

**State contract test:**
```typescript
// Given: metric in DRAFT state
// When: attempting to publish without required fields
// Then: transition is forbidden

test('cannot publish draft metric without required fields', async () => {
  const metric = await createMetric({ state: 'DRAFT' });
  const response = await api.post(`/health-metrics/${metric.id}/publish`, {});

  expect(response.status).toBe(422);
  expect(response.body.code).toBe('INVALID_STATE_TRANSITION');
});
```

### Acceptance Test Rules

- Write acceptance tests **before** unit tests for a feature
- One test per contract guarantee — no more
- Assert on **observable behavior**, not implementation (no internal calls)
- Acceptance tests must use real HTTP/DB where possible — not mocks
- Failing acceptance test = acceptance criteria not met. **Do not ship.**

### TDD Order for a Feature

```
1. Write acceptance tests from Contract Document (RED)
2. Confirm they fail
3. Write unit tests for each component (RED → GREEN per unit)
4. All acceptance tests turn GREEN
5. REFACTOR
```

---

## Good Tests

| Quality | Good | Bad |
|---------|------|-----|
| **Minimal** | One thing. "and" in name? Split it. | `test('validates email and domain and whitespace')` |
| **Clear** | Name describes behavior | `test('test1')` |
| **Shows intent** | Demonstrates desired API | Obscures what code should do |

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests passing immediately prove nothing. |
| "Tests after achieve same goals" | Tests-after = "what does this do?" Tests-first = "what should this do?" |
| "Already manually tested" | Ad-hoc ≠ systematic. No record, can't re-run. |
| "Deleting X hours is wasteful" | Sunk cost fallacy. Keeping unverified code is technical debt. |
| "Keep as reference, write tests first" | You'll adapt it. That's testing after. Delete means delete. |
| "Need to explore first" | Fine. Throw away exploration, start with TDD. |
| "Test hard = design unclear" | Listen to test. Hard to test = hard to use. |
| "TDD will slow me down" | TDD faster than debugging. Pragmatic = test-first. |
| "Manual test faster" | Manual doesn't prove edge cases. You'll re-test every change. |
| "Existing code has no tests" | You're improving it. Add tests for existing code. |

## Red Flags - STOP and Start Over

- Code before test
- Test after implementation
- Test passes immediately
- Can't explain why test failed
- Tests added "later"
- Rationalizing "just this once"
- "I already manually tested it"
- "Tests after achieve the same purpose"
- "It's about spirit not ritual"
- "Keep as reference" or "adapt existing code"
- "Already spent X hours, deleting is wasteful"
- "TDD is dogmatic, I'm being pragmatic"
- "This is different because..."

**All of these mean: Delete code. Start over with TDD.**

## Example: Bug Fix

**Bug:** Empty email accepted

**RED**
```typescript
test('rejects empty email', async () => {
  const result = await submitForm({ email: '' });
  expect(result.error).toBe('Email required');
});
```

**Verify RED**
```bash
$ npm test
FAIL: expected 'Email required', got undefined
```

**GREEN**
```typescript
function submitForm(data: FormData) {
  if (!data.email?.trim()) {
    return { error: 'Email required' };
  }
  // ...
}
```

**Verify GREEN**
```bash
$ npm test
PASS
```

**REFACTOR**
Extract validation for multiple fields if needed.

## Verification Checklist

Before marking work complete:

**Acceptance Tests (Step 5 / Feature level):**
- [ ] Acceptance tests written from Contract Document before any unit tests
- [ ] Each contract guarantee has a corresponding acceptance test
- [ ] All acceptance tests use real HTTP/DB (no mocks)
- [ ] All acceptance tests pass

**Unit Tests:**
- [ ] Every new function/method has a test
- [ ] Watched each test fail before implementing
- [ ] Each test failed for expected reason (feature missing, not typo)
- [ ] Wrote minimal code to pass each test
- [ ] All tests pass
- [ ] Output pristine (no errors, warnings)
- [ ] Tests use real code (mocks only if unavoidable)
- [ ] Edge cases and errors covered

Can't check all boxes? You skipped TDD. Start over.

## When Stuck

| Problem | Solution |
|---------|----------|
| Don't know how to test | Write wished-for API. Write assertion first. Ask your human partner. |
| Test too complicated | Design too complicated. Simplify interface. |
| Must mock everything | Code too coupled. Use dependency injection. |
| Test setup huge | Extract helpers. Still complex? Simplify design. |

## Debugging Integration

Bug found? Write failing test reproducing it. Follow TDD cycle. Test proves fix and prevents regression.

Never fix bugs without a test.

## Testing Anti-Patterns

When adding mocks or test utilities, read @testing-anti-patterns.md to avoid common pitfalls:
- Testing mock behavior instead of real behavior
- Adding test-only methods to production classes
- Mocking without understanding dependencies

## Final Rule

```
Production code → test exists and failed first
Otherwise → not TDD
```

No exceptions without your human partner's permission.
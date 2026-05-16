---
name: intake-requirement
description: Intake raw requests and convert them into clear, structured, validated requirements. Use when receiving vague requests, feature ideas, meeting notes, or stakeholder demands.
---
# Intake Requirement
Transform unstructured input into actionable, structured requirements.  
This skill focuses on **understanding the problem before proposing solutions**.

---

## Workflow

### 1. Gather Raw Input
Accept any form of input:
- Free-text request
- Chat logs
- Meeting notes
- Voice-to-text summary
- Half-baked feature ideas

Do **not** judge or optimize yet.

Ask internally:
- What is being requested?
- What problem is implied?
- What context is missing?

---

### 2. Clarify Intent vs Problem
Separate:
- **Stated Request** (what they say they want)
- **Underlying Problem** (why they want it)

If unclear, flag ambiguity instead of guessing.

Output:
- Intent summary (1–2 sentences)
- Problem statement (problem-focused, not solution-focused)

---

### 3. Structure the Requirements
Convert input into structured categories:

**Functional Requirements**
- What the system must do
- Observable behaviors only
- Tag each with MoSCoW priority: **Must / Should / Could / Won't**
- Include acceptance criteria: "Done when..." per requirement

**Non-Functional Requirements**
- Performance
- Security
- Usability
- Availability
- Compliance

**Business Rules**
- Constraints that must not be violated

**Constraints**
- Time, budget, tech stack, legal, legacy systems

**Assumptions**
- Things believed true but not yet confirmed

**Out of Scope (if detectable)**
- Explicitly excluded items

---

### 4. Detect Ambiguity & Risk
Analyze the structured requirements and flag:
- Vague or untestable statements
- Conflicting requirements
- Hidden scope expansion
- High technical or organizational risk

Do not resolve risks — only identify them.

---

### 5. Generate Follow-up Questions
Produce **only necessary questions** to unblock next steps.

Rules:
- Max 5 questions
- Ordered by importance
- Each question must reduce ambiguity or risk

Avoid “nice to know” questions.

---

## Output Format

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

## Constraints
- C-1:

## Assumptions
- A-1:

## Out of Scope
- OOS-1:

## Risks & Ambiguities
- R-1:

## Follow-up Questions (Priority Order)
1.
2.
```

---

## Evaluation Criteria

- **Clarity**: Can a third party understand the problem without extra context?
- **Structure**: Are requirements categorized correctly?
- **Neutrality**: No design or implementation decisions introduced
- **Completeness**: Missing information is explicitly called out
- **Actionability**: Output can feed directly into Requirement Document step

---

## Anti-Patterns

- Do not design solutions
- Do not invent requirements
- Do not assume technical details unless stated
- Do not ask excessive questions
- Do not merge problem and solution statements

---

## When to Use
- Step 1: Receiving new requirements
- Before writing Requirement Document
- Before planning, estimation, or design
- As the first skill in an AI-first delivery pipeline
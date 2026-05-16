# High-Level Design Template

Use this structure for HLD documents. Adapt sections as appropriate for project scope.

```markdown
# High-Level Design: [Project Name]

**Version:** 1.0  
**Date:** [Date]  
**Status:** Draft | Under Review | Approved

## 1. Overview

[2-3 sentences: What this system does and why it exists]

## 2. Goals and Non-Goals

### Goals
- [Primary objective 1]
- [Primary objective 2]

### Non-Goals
- [Explicitly out of scope item 1]
- [Explicitly out of scope item 2]

## 3. System Architecture

### Component Diagram
[ASCII diagram or description of major components and relationships]

### Component Descriptions
| Component | Responsibility | Key Interfaces |
|-----------|---------------|----------------|
| [Name] | [What it does] | [APIs/protocols] |

## 4. Data Flow

[Describe how data moves through the system for primary use cases]

## 5. Technology Choices

| Layer | Choice | Rationale |
|-------|--------|-----------|
| [e.g., API] | [e.g., FastAPI] | [Why] |

## 6. Key Design Decisions

[Brief summary of major decisions—details go in ADR-Lite]

## 7. Open Questions

### Ambiguities in Requirements
- [ ] [Question about unclear requirement] — **Default:** [suggested interpretation]

### Design Alternatives
- [ ] [Choice A vs Choice B] — **Default:** [recommended option]

### Clarifications Needed
- [ ] [Item requiring human input]

## 8. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk] | [H/M/L] | [Strategy] |

## 9. Traceability

| Intent | HLD Section | ADR |
|--------|-------------|-----|
| [Requirement from intent doc] | [Section addressing it] | [ADR ref, if resolved] |
```

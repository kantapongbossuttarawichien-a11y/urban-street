# ADR-Lite Template

Lightweight Architecture Decision Records. One entry per significant decision.

```markdown
# Architecture Decisions: [Project Name]

**Last Updated:** [Date]

---

## ADR-001: [Decision Title]

**Status:** Proposed | Accepted | Superseded by ADR-XXX

**Context:**  
[What situation prompted this decision? What problem needed solving?]

**Decision:**  
[What was decided, stated clearly and concisely]

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| [Option A] | [Benefits] | [Drawbacks] |
| [Option B] | [Benefits] | [Drawbacks] |

**Rationale:**  
[Why this option over alternatives. Reference constraints from intent doc if applicable.]

**Consequences:**
- [Positive consequence]
- [Trade-off or limitation accepted]
- [Follow-on work required]

**Resolves:** HLD Open Question #[N]

---

## ADR-002: [Next Decision]

[Same structure...]
```

## Guidelines

- **Keep entries focused:** One decision per ADR entry
- **Be concrete:** Avoid vague rationale like "it's better"—cite specific constraints or requirements
- **Link to HLD:** Reference which open question this resolves
- **Update status:** Mark decisions as superseded if they change later

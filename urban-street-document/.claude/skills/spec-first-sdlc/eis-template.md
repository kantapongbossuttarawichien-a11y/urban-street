# Executable Implementation Specification Template

Detailed specification that serves as the contract for code generation.

```markdown
# Implementation Specification: [Project Name]

**Version:** 1.0  
**Date:** [Date]  
**Based on:** HLD v[X], ADR-Lite v[X]

---

## 1. API Contracts

### Endpoint: [METHOD /path]

**Description:** [What this endpoint does]

**Authentication:** [None | API Key | Bearer Token | etc.]

**Request:**
```json
{
  "field_name": "type — description",
  "optional_field?": "type — description (optional)"
}
```

**Response (200 OK):**
```json
{
  "field_name": "type — description"
}
```

**Error Responses:**

| Status | Code | Description | When |
|--------|------|-------------|------|
| 400 | INVALID_INPUT | Validation failed | [Condition] |
| 404 | NOT_FOUND | Resource missing | [Condition] |
| 409 | CONFLICT | State conflict | [Condition] |

**Example:**
```bash
curl -X POST /api/resource \
  -H "Authorization: Bearer token" \
  -d '{"field": "value"}'
```

---

## 2. State Machines

### Entity: [Entity Name]

**States:** `DRAFT` → `PENDING` → `ACTIVE` → `ARCHIVED`

**Transitions:**

| From | To | Trigger | Guards | Side Effects |
|------|----|---------|--------|--------------|
| DRAFT | PENDING | submit() | all_fields_valid | notify_reviewer |
| PENDING | ACTIVE | approve() | has_approval | timestamp_activation |
| PENDING | DRAFT | reject() | — | notify_author |
| ACTIVE | ARCHIVED | archive() | no_dependents | cascade_archive |

**Diagram:**
```
[DRAFT] --submit--> [PENDING] --approve--> [ACTIVE] --archive--> [ARCHIVED]
                        |
                        +--reject--> [DRAFT]
```

---

## 3. Persistence

### Schema: [Table/Collection Name]

**Storage:** [PostgreSQL | SQLite | File | etc.]

```sql
CREATE TABLE entity_name (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_entity_status ON entity_name(status);
```

**Or for file-based:**
```
data/
├── entities/
│   ├── {id}.json
│   └── index.json
```

**File Format:**
```json
{
  "id": "uuid",
  "status": "state",
  "data": {},
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

---

## 4. Module Interfaces

### Module: [module_name]

**Responsibility:** [Single sentence]

**Public Interface:**
```python
class EntityService:
    """Manages entity lifecycle operations."""
    
    def create(self, data: EntityCreate) -> Entity:
        """
        Create new entity in DRAFT state.
        
        Args:
            data: Initial entity data
            
        Returns:
            Created entity with generated ID
            
        Raises:
            ValidationError: If data fails validation
        """
        ...
    
    def transition(self, id: UUID, action: str) -> Entity:
        """
        Attempt state transition.
        
        Args:
            id: Entity identifier
            action: Transition trigger name
            
        Returns:
            Updated entity
            
        Raises:
            NotFoundError: Entity doesn't exist
            InvalidTransitionError: Transition not allowed from current state
        """
        ...
```

**Dependencies:** [List other modules this depends on]

---

## 5. Traceability Matrix

| Requirement (Intent) | HLD Section | ADR | EIS Section | Test Category |
|---------------------|-------------|-----|-------------|---------------|
| [Req-1] | 3.1 | ADR-001 | 1.1, 2.1 | state_transition |
| [Req-2] | 4.2 | ADR-002 | 1.2 | contract |
```

## Guidelines

- **Be precise:** Specs should be unambiguous enough to code from directly
- **Include examples:** Concrete examples prevent misinterpretation
- **Specify errors:** Error handling is part of the contract
- **Trace everything:** Every spec element should link back to requirements

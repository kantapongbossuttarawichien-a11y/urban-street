# Claude Configuration — smart-lifestyle-document

This directory contains Claude Code configuration and custom skills for this project.

## Skills

Skills are custom slash commands invoked with `/skill-name`. Available skills for this project:

---

### `/intake-requirement` — รับและ structure requirement จาก raw input

แปลง input ที่ยังไม่ชัดเจนให้เป็น structured requirement document พร้อม FR, NFR, Business Rules, Constraints, Assumptions, Risks และ Follow-up Questions

**Use when:**
- ได้รับ requirement ใหม่ในรูปแบบใดก็ได้ (free-text, meeting notes, chat, voice summary)
- ต้องการ structure ข้อมูลก่อนเข้า planning หรือ design
- เป็น step แรกของ AI-first delivery pipeline

**Example:**
```
/intake-requirement อยากทำฟีเจอร์ให้ user track น้ำหนักและ BMI ได้
```

```
/intake-requirement [วางก้อนข้อความจาก meeting]
```

---

### `/grill-me` — Stress-test a plan or design → Requirement Document

Interviews you relentlessly about every aspect of a plan or design, walking down each branch of the decision tree one question at a time. Claude provides its recommended answer for each question. **เมื่อถามครบ จะ produce Requirement Document อัตโนมัติ**

**Use when:**
- Input มีข้อมูลบางส่วนแต่ยังไม่ครบ ต้องการ elicit เพิ่ม
- ต้องการ validate design ก่อน build
- ต้องการ surface blind spots หรือ scope ที่ยังไม่ชัด

**Example:**
```
/grill-me ฉันอยากออกแบบ notification system ที่ส่ง alert ให้ user เมื่อ health metric ผิดปกติ
```

```
/grill-me I want to add an offline-first sync mechanism to the mobile app
```

---

### `/to-issues` — Break a plan into GitHub issues

Converts a plan, spec, or PRD into independently-grabbable GitHub issues using tracer-bullet vertical slices. Each issue cuts through all integration layers end-to-end and can be demoed or verified on its own.

**Use when:**
- You want to convert a design or plan into implementation tickets
- You need to break down a feature into parallel-workable issues
- You want clear acceptance criteria and dependency ordering

**Example:**
```
/to-issues ฉันมี plan ออกแบบ health tracking feature อยากแตก issues ให้ team
```

```
/to-issues #42
```

---

### `/generate-contract-document` — Generate versioned Contract Document

Creates an enterprise-ready, versioned contract between Frontend, Backend, QA, and AI — covering API, Data, Error, State, Non-Functional, and Security contracts. Use as the single source of truth before design, TDD, and development.

**Use when:**
- Requirement Document is approved and ready to freeze boundaries
- Before FE / BE design to prevent sync-meeting dependencies
- Before writing Test Spec or TDD scaffold
- As the reference artifact for AI code generation and PR reviews

**Example:**
```
/generate-contract-document Health Tracking feature — user logs weight, BMI, body fat
```

```
/generate-contract-document [วาง Requirement Document ที่ผ่าน /intake-requirement แล้ว]
```

---

### `/test-driven-development` — TDD cycle + Acceptance Tests from Contract Document

ใช้ทำ Test Spec (Step 5) โดย derive acceptance tests จาก Contract Document แล้วดำเนิน Red-Green-Refactor cycle สำหรับแต่ละ behavior

**Use when:**
- หลังได้ Contract Document จาก `/generate-contract-document` — แปลง contract เป็น test spec
- เริ่ม implement feature ใหม่ หรือแก้ bug
- ต้องการ enforce TDD discipline ใน codebase

**Example:**
```
/test-driven-development [วาง Contract Document ที่ได้จาก /generate-contract-document]
```

```
/test-driven-development fix: empty email accepted in registration form
```

---

### `/design-an-interface` — Explore multiple interface designs

Generates multiple radically different interface designs for a module using parallel sub-agents, then compares them to surface trade-offs. Based on the "Design It Twice" principle from *A Philosophy of Software Design*.

**Use when:**
- You want to explore API or module interface options before committing
- You're designing a new module and want to compare different shapes
- You want to avoid locking into the first idea that comes to mind

**Example:**
```
/design-an-interface HealthMetric repository layer สำหรับ query และ aggregate health data
```

```
/design-an-interface notification service that supports push, email, and in-app alerts
```

---

## Workflow Coverage

Mapping ของ skill กับ development workflow ของ project นี้

| Step | ขั้นตอน | Skill ที่ครอบคลุม | ระดับ |
|------|---------|------------------|-------|
| 1 | รับ Requirement | `/intake-requirement` | ✅ ครอบคลุม |
| 2 | Requirement Document (Problem / Scope) | `/intake-requirement` + `/grill-me` | ✅ ครอบคลุม |
| 3 | Plan & Feature Breakdown | `/to-issues` | ✅ ครอบคลุม |
| 4 | **Contract Document (API / Data / Error / State)** ⭐ | `/generate-contract-document` | ✅ ครอบคลุม |
| 5 | **Test Spec (TDD / Acceptance)** ⭐ | `/test-driven-development` | ✅ ครอบคลุม |
| 6 | FE Design (UX / UI) | `/design-an-interface` + `senior-frontend`\* | ✅ ครอบคลุม |
| 7 | BE Design (DB / Architecture) | `/design-an-interface` | ⚠️ บางส่วน |
| 8 | Development — FE | `senior-frontend`\* | ✅ ครอบคลุม |
| 8 | Development — BE | — | ❌ ไม่มี |

> \* `senior-frontend` เป็น global skill ติดตั้งใน `~/.claude/skills/` ไม่ใช่ project skill

**Cross-cutting skills (ใช้ได้ทุก step):**

| Skill | บทบาท |
|-------|-------|
| `/grill-me` | Elicit requirements หรือ stress-test plan / design → ได้ Requirement Document |
| `simplify` (built-in) | Review code quality ใน step 8 |

**ช่องว่างที่ยังขาด (gap):**

- **Step 8 BE** — ยังไม่มี skill สำหรับ backend development (Go / Node / etc.)

---

## Structure

```
.claude/
├── README.md               # This file
├── settings.json           # Claude Code project settings
└── skills/
    ├── intake-requirement.md           # Receive & structure raw requirements
    ├── grill-me.md                     # Elicit requirements via interview → Requirement Document
    ├── to-issues.md                    # Break a plan into GitHub issues
    ├── generate-contract-document.md   # Versioned contract — API / Data / Error / State
    ├── test-driven-development.md      # TDD cycle + Acceptance Tests from Contract Document
    └── design-an-interface.md          # Explore multiple interface designs
```

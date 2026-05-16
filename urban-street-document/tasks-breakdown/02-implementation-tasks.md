# Implementation Tasks: Coffee Sales Tracker MVP

## Phase 1: Foundation (Tracer Bullet 1)
### Task 1.1: Project Initialization & Theme Setup
- [ ] Initialize Next.js project with Tailwind CSS.
- [ ] Setup `Noto Sans Thai` via Google Fonts.
- [ ] Configure Tailwind theme with the "High Contrast Solar" color palette.
- [ ] Setup basic Layout component (Mobile-first viewport constraints).
- [ ] **UI Requirement**: ใช้ skill `frontend-design.md` เพื่อออกแบบ Theme และ Layout ให้ดู Premium และอ่านง่ายกลางแดด

### Task 1.2: Authentication Layer
- [ ] Implement NextAuth.js with Google Provider.
- [ ] Create Protected Route logic.
- [ ] **UI Requirement**: ใช้ skill `frontend-design.md` เพื่อสร้างหน้า Login ที่เรียบง่ายแต่ดูดี (Minimalist Google Sign-in)

---

## Phase 2: Data Connectivity (Tracer Bullet 2)
### Task 2.1: Sheety Integration Service
- [ ] Create a settings page to input and store Sheety API URL.
- [ ] Create an API utility to fetch/post data using the user-provided URL.
- [ ] Connection validator (check if the URL returns a valid response).
- [ ] **UI Requirement**: ใช้ skill `frontend-design.md` สำหรับหน้าจอการตั้งค่า API

### Task 2.2: Local-First Storage (Offline Support)
- [ ] Implement `localStorage` synchronization for Orders.
- [ ] Logic to check connection status and retry sync for "Pending" orders.

---

## Phase 3: Core Features (Tracer Bullet 3)
### Task 3.1: Menu Management Screen
- [ ] Fetch menu items from Sheety `Menu` table.
- [ ] Create UI to Add/Edit/Delete menu items.
- [ ] Implement "Toggle Active" for menu items (to hide out-of-stock).
- [ ] **UI Requirement**: ใช้ skill `frontend-design.md` เพื่อสร้างหน้าจัดการเมนูที่ใช้งานง่ายบนมือถือ

### Task 3.2: POS Terminal UI & Logic
- [ ] Main grid of menu buttons (optimized for one-handed use).
- [ ] Order state management (add/remove items, calculate total).
- [ ] "Save Order" implementation (write to Sheety `Orders` and `OrderItems`).
- [ ] **UI Requirement**: ใช้ skill `frontend-design.md` เพื่อสร้างหน้าขาย (POS) ที่เน้นความเร็วและการตอบสนองที่ลื่นไหล

---

## Phase 4: Analytics & Polish (Tracer Bullet 4)
### Task 4.1: Daily Dashboard
- [ ] Fetch today's sales data (filtered by UTC+7 timezone).
- [ ] UI components for Revenue, Total Cups, and Top Selling chart.
- [ ] **UI Requirement**: ใช้ skill `frontend-design.md` เพื่อสร้าง Dashboard ที่แสดงข้อมูลได้ชัดเจนและสวยงาม

### Task 4.2: Order History & Voiding
- [ ] List recent orders.
- [ ] "Void" functionality (update status in Sheety instead of deleting).
- [ ] **UI Requirement**: ใช้ skill `frontend-design.md` สำหรับหน้าประวัติการขาย

### Task 4.3: UX Polish
- [ ] High contrast visibility check.
- [ ] Micro-animations for feedback (button press, success sync).
- [ ] **UI Requirement**: ใช้ skill `frontend-design.md` เพื่อเก็บรายละเอียด Micro-interactions และความลื่นไหลของแอปโดยรวม

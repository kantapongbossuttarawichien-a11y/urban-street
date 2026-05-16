# Requirement Document: Morning Shop Dashboard (MVP-02)

## 1. Requirement Summary
- **Intent**: ปรับปรุงหน้า "สรุปยอดขาย" เดิมให้เป็น Dashboard เชิงวิเคราะห์ที่เน้นพฤติกรรมลูกค้าช่วงเช้า
- **Problem**: เจ้าของร้านต้องการเห็นภาพรวมความเร็วในการขาย (Rush Hour) และเปรียบเทียบยอดขายในระยะต่างๆ เพื่อวางแผนเตรียมวัตถุดิบ

## 2. Functional Requirements
- **FR-1: Time-Period Tabs**: เพิ่ม Tab สำหรับสลับดูข้อมูล [วันนี้], [เมื่อวาน], [7 วัน], [เดือนนี้]
- **FR-2: Morning Summary Metrics**: แสดงยอดรวม (฿), จำนวนแก้ว, จำนวนออเดอร์ และยอดเฉลี่ยต่อบิล (AOV)
- **FR-3: Morning Rush Hour Chart**: กราฟแสดงจำนวนออเดอร์รายชั่วโมง (06:00 - 11:00 เป็นต้นไป)
- **FR-4: Top Selling Bar Chart**: กราฟแท่งแนวนอนแสดงเมนูขายดี 5 อันดับแรก
- **FR-5: Fast Selling Insight**: แสดงเมนูที่ขายหมดเร็วที่สุดพร้อมเวลาที่เลิกขาย (ถ้ามีข้อมูล) หรือความเร็วในการขายเฉลี่ย
- **FR-6: Transaction History**: แสดงรายการขายล่าสุดด้านล่างสุด พร้อมปุ่ม Void

## 3. Technical Decisions
### API & Data Contract
- **Aggregation Strategy**: ดึงข้อมูลแบบ **Raw Transactions** จาก GAS ทั้งหมด แล้วให้ Frontend ทำการ Group/Filter ตามช่วงเวลาที่เลือก
- **Data Source**: Google Apps Script (GAS) Endpoint
- **Status Machine**: `completed` (สำเร็จ), `voided` (ยกเลิก)

### Security
- **Authentication**: ใช้ระบบยืนยันตัวตนเดิม (Google OAuth)
- **Authorization**: Backend (GAS) ควรตรวจสอบ Allowed Emails ของผู้ขอข้อมูล

### Non-Functional
- **Timezone**: UTC+7 (Asia/Bangkok) เป็นมาตรฐานเดียวทั้งระบบ
- **UI/UX Design**: 
    - ธีม "Morning" (Warm Yellow / Coffee Brown / Sunrise Gradient)
    - High Contrast สำหรับการใช้งานหน้าร้าน
- **Data Granularity**:
    - [วันนี้/เมื่อวาน]: แสดงรายละเอียดรายชั่วโมง (Hourly)
    - [7 วัน/เดือนนี้]: แสดงรายละเอียดรายวัน (Daily)

## 4. Constraints
- **C-1**: ปริมาณข้อมูลใน Google Sheets ยังไม่เยอะมากจนทำให้การประมวลผลบน Frontend ช้า
- **C-2**: แสดงผลอัปเดตเฉพาะหน้า "สรุปยอดขาย" (Dashboard) เท่านั้น

## 5. Assumptions
- **A-1**: ข้อมูลออเดอร์ใน Sheet มี Timestamp ที่ถูกต้องสมบูรณ์
- **A-2**: ผู้ใช้สามารถเข้าถึงอินเทอร์เน็ตเพื่อโหลดข้อมูล Raw Data ได้

## 6. Out of Scope
- การพยากรณ์ยอดขายด้วย AI (ใช้การวิเคราะห์ Trend พื้นฐานก่อน)
- การจัดการสต็อกวัตถุดิบแบบละเอียด (Inventory Management)

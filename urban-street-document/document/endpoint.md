# API Endpoints Documentation - Coffee Sales Tracker

เอกสารฉบับนี้สรุปรายการ Endpoint ทั้งหมดที่ใช้ในแอปพลิเคชัน Urban Street Coffee Tracker โดยแบ่งออกเป็น 2 ส่วนคือ Internal Proxy และ Sheety (Google Sheets)

## 1. Internal Proxy API (Next.js Server)

เพื่อความปลอดภัย แอปพลิเคชันจะไม่เรียกใช้ API Key โดยตรงจากฝั่งเบราว์เซอร์ แต่จะส่งผ่านตัวกลางนี้:

- **Endpoint**: `/api/proxy`
- **Method**: `GET`, `POST`
- **หน้าที่**: 
    - รับคำสั่งจาก Client-side
    - แนบ `SHEETY_AUTH_TOKEN` จาก Environment Variables ในฝั่ง Server
    - ส่งคำขอต่อไปยัง Sheety API
    - ป้องกันรหัสผ่านรั่วไหลไปยังเบราว์เซอร์ของผู้ใช้

---

## 2. Sheety API Endpoints (Database)

ฐานข้อมูลหลักถูกเก็บไว้ใน Google Sheets และเชื่อมต่อผ่าน Sheety โดยมี 2 แผ่นงานหลักดังนี้:

### 📂 แผ่นงาน `menu` (รายการกาแฟ)
ใช้สำหรับจัดการสิ่งที่แสดงบนหน้าขาย (POS)

| Method | Endpoint | หน้าที่ |
| :--- | :--- | :--- |
| **GET** | `/menu` | ดึงรายการเมนูทั้งหมด (ชื่อ, ราคา, สี, สถานะเปิด/ปิด) |
| **POST** | `/menu` | เพิ่มรายการเมนูใหม่ลงในฐานข้อมูล |
| **PUT** | `/menu/[id]` | แก้ไขข้อมูลเมนู (เช่น เปิด/ปิด เมนูที่ของหมด, เปลี่ยนราคา) |
| **DELETE** | `/menu/[id]` | ลบรายการเมนูออกจากฐานข้อมูลถาวร |

### 📂 แผ่นงาน `sales` (ประวัติการขาย)
ใช้สำหรับบันทึกยอดขาย โดยระบบจะทำการบันทึก **แยก 1 แถว ต่อ 1 แก้ว** (เพื่อให้นำข้อมูลไปสรุปยอดขายแยกตามเมนูได้ง่ายใน Google Sheets)

| Column Header | คำอธิบาย |
| :--- | :--- |
| `timestamp` | เวลาที่บันทึก (UTC) |
| `items` | ชื่อเมนู (บันทึกเพียง 1 รายการต่อแถว) |
| `total` | ราคาของแก้วนั้นๆ |
| `status` | สถานะ (`completed` หรือ `voided`) |

#### 📋 ตัวอย่างข้อมูลเมื่อขาย 2 แก้ว (Espresso + Latte):
ระบบจะส่งคำขอไป 2 ครั้ง ได้ข้อมูลใน Sheet ดังนี้:
1. `2024-03-20...`, `Espresso`, `60`, `completed`
2. `2024-03-20...`, `Latte`, `80`, `completed`

#### 📋 โครงสร้างข้อมูล (JSON Payload) สำหรับ POST:
```json
{
  "sale": {
    "timestamp": "2024-03-20T10:00:00.000Z",
    "items": "Espresso",
    "total": 60,
    "status": "completed"
  }
}
```

#### 📋 โครงสร้างข้อมูลสำหรับการยกเลิก (PUT):
```json
{
  "sale": {
    "status": "voided"
  }
}
```

---

## ⚡ Offline Synchronization
ระบบมีการจัดการ Endpoint ในสถานะออฟไลน์ผ่าน **LocalStorage**:
1. หากเรียก **POST** ไปยัง `/sales` แล้วล้มเหลว ข้อมูลจะถูกเก็บลงใน `offline_orders` คิวในเครื่อง
2. ระบบจะพยายามส่งข้อมูล (Auto-Sync) ไปยัง Endpoint อีกครั้งเมื่อมีการบันทึกออเดอร์ถัดไป หรือเมื่อเปิดแอปพลิเคชันใหม่ในสถานะออนไลน์

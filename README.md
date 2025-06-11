# Frontend User Management

ระบบจัดการผู้ใช้งานด้วย Next.js และ Next Auth สำหรับการจัดการข้อมูลผู้ใช้

## 🚀 เทคโนโลยีที่ใช้

- **Framework**: Next.js
- **Runtime**: Bun
- **Authentication**: NextAuth
- **UI Library**: shadcn/ui
- **Containerization**: Docker

## ✨ ฟีเจอร์

### 🔐 ระบบการยืนยันตัวตน
- ระบบ Login โดยใช้ NextAuth
- การจัดการ Session และ Authentication
- ระบบ register

### 👥 การจัดการผู้ใช้
- **Get Users**: ดูรายชื่อผู้ใช้ทั้งหมด
- **Add User**: เพิ่มผู้ใช้ใหม่
- **Edit User**: เเก้ข้อมูลผู้ใช้งาน
- **Delete User**: ลบผู้ใช้งาน

## 📱 หน้าเว็บไซต์

1. **หน้า Login** - สำหรับการเข้าสู่ระบบ
2. **หน้า User** - สำหรับการจัดการข้อมูลผู้ใช้
3. **หน้า register** - สำหรับสมัครสมาชิก

## 🛠 การติดตั้งและใช้งาน

### ขั้นตอนที่ 1: Clone Repository

```bash
# Clone โปรเจคจาก GitHub
git clone https://github.com/korn9480/frontend_user_management.git

# เข้าไปในโฟลเดอร์โปรเจค
cd frontend_user_management
```

### ขั้นตอนที่ 2: รันโปรเจค

#### ขั้นตอนที่ 2.1 : รันโปรเจคบนเครื่องของตัวเอง

ต้องติด bun ก่อน เพราะผมใช้ bun แทน npm
ลิ้งติดตั้ง bun : https://bun.sh/docs/installation

```bash
# ติดตั้ง dependencies
bun install

# รันในโหมดพัฒนา
bun run dev
```

### ขั้นตอนที่ 2: รัน Docker Compose

- **หมายเหตุ** docker compose สามารถเข้าได้เเค่หน้า login เท่านั้น เพราะมีปัญหาเรื่อง network ของ docker ทำให้ api backend ใช้ไม่ได้ จึงส่งผลให้ไม่สามารถไป login ขอ token จาก backend มาเพื่อเข้าระบบได้ เเนะนำให้ใช้วิธีรัน โปรเจคในเครื่องตัวเอง 😁😁

```bash
# รันคำสั่งสำหรับ Docker Compose
docker compose up -d
```

คำสั่งนี้จะ:
- ดาวน์โหลดและติดตั้ง dependencies ทั้งหมด
- สร้าง container สำหรับแอปพลิเคชัน
- รัน service ในโหมด detached mode (-d)

### ขั้นตอนที่ 3: เข้าใช้งานระบบ

เปิดเบราว์เซอร์และไปที่:
```
http://localhost:3000
```

### โครงสร้างโปรเจค

```
frontend_user_management/
├── app/                    # Next.js App Router
├── components/            # React Components
├── lib/                   # Utility functions
├── public/               # Static files
├── docker-compose.yml    # Docker configuration
├── Dockerfile           # Docker build instructions
├── package.json         # Package dependencies
└── README.md           # Documentation
```

## 🎨 UI Components

โปรเจคนี้ใช้ **shadcn/ui** สำหรับ UI components ที่มีความสวยงามและใช้งานง่าย

## ➕ สิ่งพัฒนาเพิ่มจากครั้งเเรก

### ✨ ฟีเจอร์

- **Edit User**: เเก้ข้อมูลผู้ใช้งาน
- **Delete User**: ลบผู้ใช้งาน
- **Auth**: มีตรวจสอบสิทธิ์ก่อนจะเข้าหน้า users

## 📱 หน้าเว็บไซต์
- **หน้า register** - สำหรับสมัครสมาชิก

### 🤔 logic

- การจัดการเกี่ยวกับ form เปลี่ยนจากใช้ useState มาเป็น ใช้ useForm

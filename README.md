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

### 👥 การจัดการผู้ใช้
- **Get Users**: ดูรายชื่อผู้ใช้ทั้งหมด
- **Add User**: เพิ่มผู้ใช้ใหม่

## 📱 หน้าเว็บไซต์

1. **หน้า Login** - สำหรับการเข้าสู่ระบบ
2. **หน้า User** - สำหรับการจัดการข้อมูลผู้ใช้

## 🛠 การติดตั้งและใช้งาน

### ขั้นตอนที่ 1: Clone Repository

```bash
# Clone โปรเจคจาก GitHub
git clone <repository-url>

# เข้าไปในโฟลเดอร์โปรเจค
cd frontend_user_management
```

### ขั้นตอนที่ 2: รัน Docker Compose

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

## 🔧 การพัฒนาเพิ่มเติม

### การติดตั้งในโหมดพัฒนา (Development Mode)

หากต้องการพัฒนาโปรเจคเพิ่มเติม:

```bash
# ติดตั้ง dependencies
bun install

# รันในโหมดพัฒนา
bun run dev
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
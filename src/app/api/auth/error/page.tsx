'use client';
import { redirect } from 'next/navigation';


/**
 * หน้าแสดงข้อผิดพลาดสำหรับระบบยืนยันตัวตน (Keycloak)
 * แสดงข้อความที่เป็นมิตรและแนะนำวิธีแก้ไขให้ผู้ใช้
 */
export default function AuthErrorPage() {
  return redirect("/login")
}

"use client";
import { FieldInput, FieldInputPassword } from "@/components/share/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { AuthService } from "@/service/authService";
import { UserDtoCreated } from "@/types/interface/formData/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, Save, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FieldSelectOption = {
  value: string | number;
  label: string;
};

const availableRoles: FieldSelectOption[] = [
  { value: 1, label: "Admin" },
  { value: 2, label: "User" },
];

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const authService = new AuthService();
  const formSchemaUser = z
    .object({
      name: z.string().min(1, { message: "ไม่ได้กรอบชื่อผู้ใช้" }),
      email: z.string().email({ message: "email ไม่ถูกต้อง" }),
      password: z
        .string()
        .min(6, { message: "รหัสผ่านต้องมากกว่า 6 ตัวอักษร" }),
      confirmPassword: z
        .string()
        .min(6, { message: "รหัสผ่านต้องมากกว่า 6 ตัวอักษร" }),
      role: z.string({ invalid_type_error: "กรุณาเลือกบทบาท" }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "รหัสผ่านไม่ตรงกัน",
          path: ["password"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "รหัสผ่านไม่ตรงกัน",
          path: ["confirmPassword"],
        });
      }
    });
  const formUser = useForm<z.infer<typeof formSchemaUser>>({
    resolver: zodResolver(formSchemaUser),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: String(availableRoles[1].value),
    },
  });

  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: z.infer<typeof formSchemaUser>) => {
    setIsLoading(true);
    try {
      // เปลี่ยน role user string to number
      let submitData: UserDtoCreated = {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        role_id: Number(formData.role),
      };
      const resUser = await authService.register(submitData);
      if (resUser.data) {
        return router.push("/login");
      }
      // ถ้าเเก้ไขข้อมูลผู้ใช้  mode ต้องเป็น  edit เเละ มีข้อมูล user
    } catch (error: any) {
      const messageError = error.response.data.message as string;
      if (messageError.includes("already users")) {
        formUser.setError("email", {
          message: "อีเมลนี้ถูกใช้งานเเล้ว",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-foreground from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h5>เข้าสู่ระบบ</h5>
              </div>
            </CardTitle>
            <CardDescription className="text-center">
              กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...formUser}>
              <form ref={formRef}
                onSubmit={formUser.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FieldInput
                  control={formUser.control}
                  label="ชื่อ"
                  name="name"
                  placeholder="กรอกชื่อ"
                  icon={<User />}
                />
                <FieldInput
                  control={formUser.control}
                  label="อีเมล"
                  name="email"
                  placeholder="กรอกอีเมล"
                  icon={<Mail />}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FieldInputPassword
                    control={formUser.control}
                    label="รหัสผ่าน"
                    name="password"
                    placeholder="กรอกรหัสผ่าน"
                    icon={<Lock />}
                  />
                  <FieldInputPassword
                    control={formUser.control}
                    label="ยืนยันรหัสผ่าน"
                    name="confirmPassword"
                    placeholder="ยืนยันรหัสผ่าน"
                    icon={<Lock />}
                  />
                </div>
              </form>
            </Form>
            <div className="flex gap-3 pt-4">
              <Button onClick={() => {
                formRef.current?.requestSubmit()
              }} className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    กำลังสมัคร...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    สมัครเลย
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                กลับไปหน้า{" "}
                <Link
                  href="/login"
                  className="text-primary font-medium transition-colors"
                >
                  ล็อกอิน
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          © 2025 ระบบจัดการผู้ใช้งาน
        </div>
      </div>
    </div>
  );
}

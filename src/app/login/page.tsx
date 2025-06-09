"use client"
import { useState } from "react"
import Link from "next/link"
import { Lock, User, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"
import { FieldInput, FieldInputPassword } from "@/components/share/form"

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

export default function LoginPage() {
  const router = useRouter()

  const formSchemaLogin = z.object({
  email: z.string().email({
    message: "email ไม่ถูกต้อง"
  }),
  password: z.string()
    .min(6, { message: "รหัสผ่านต้องมากกว่า 6 ตัวอักษร" })
})

const formLogin = useForm<z.infer<typeof formSchemaLogin>>({
    resolver: zodResolver(formSchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: z.infer<typeof formSchemaLogin>) => {
    setIsLoading(true)
    
    try {    
      // Simulate API call
      const responseLogin = await signIn("credentials", {
        username: formData.email,
        password: formData.password,
        redirect: false
      });
      if (responseLogin?.ok) {
        return router.push("/users")
      }
      else if(responseLogin?.error) {
        if (responseLogin.error.includes("email")) {
          formLogin.setError("email", {
            message: "email ไม่มีในระบบ"
          });
        } else if (responseLogin.error.includes("password")) {
          formLogin.setError("password",{
            message: "รหัสผ่านไม่ถูก"
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

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
            <Form {...formLogin}>
              <form onSubmit={formLogin.handleSubmit(handleSubmit)} className="space-y-4">
                <FieldInput
                  control={formLogin.control}
                  name="email"
                  label="Email"
                  placeholder="email"
                  icon={<User/>}
                />
                <FieldInputPassword 
                  control={formLogin.control}
                  name="password"
                  label="Password"
                  placeholder="password"
                  icon={<Lock/>}
                />
                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      กำลังเข้าสู่ระบบ...
                    </>
                  ) : (
                    <>
                      เข้าสู่ระบบ
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                ยังไม่มีบัญชี?{' '}
                <Link href="/register" className="text-primary font-medium transition-colors">
                  สมัครสมาชิก
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
  )
}

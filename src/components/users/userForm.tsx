"use client";

import React, { useState } from "react";
import { Save, Mail, User, Shield, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserResponse, RoleResponse } from "@/types/interface/response/user";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Form } from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldInput, FieldInputPassword, FieldSelect } from "../share/form";
import { UserDto } from "@/types/interface/formData/user";
import { UserService } from "@/service/UserService";
import { DrawerModeFormUserEnum } from "@/types/enum/formUse";

interface UserFormProps {
  mode: DrawerModeFormUserEnum;
  user?: UserResponse;
  getNewlyCreatedUser: (userData: UserResponse) => void;
  onCancel: () => void;
}

type FieldSelectOption = {
  value: string | number
  label: string
}
const availableRoles: FieldSelectOption[] = [
  { value: 1, label: "Admin" },
  { value: 2, label: "User" },
];

const UserForm: React.FC<UserFormProps> = ({
  mode,
  user,
  getNewlyCreatedUser,
  onCancel,
}) => {
  const userService = new UserService();
  const formSchemaUser = z.object({
    name: z.string().min(1, { message: "ไม่ได้กรอบชื่อผู้ใช้" }),
    email: z.string().email({ message: "email ไม่ถูกต้อง" }),
    password: z.string().min(6, { message: "รหัสผ่านต้องมากกว่า 6 ตัวอักษร" }),
    confirmPassword: z.string().min(6, { message: "รหัสผ่านต้องมากกว่า 6 ตัวอักษร" }),
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
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      confirmPassword: "",
      role: String(user?.role.id) ?? ""
    },
  })

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: z.infer<typeof formSchemaUser>) => {
    setIsLoading(true);

    try {
      // เปลี่ยน role user string to number
      let submitData:UserDto = {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        role_id: Number(formData.role)
      };

      if (mode === DrawerModeFormUserEnum.add) {
        const resUser =  await userService.createUser(submitData)
        console.log("🚀 ~ handleSubmit ~ resUser:", resUser)
        if (resUser.error) {
          console.log(resUser)
        }else {
          getNewlyCreatedUser(resUser.data)
        }
      } 
      else if (mode === DrawerModeFormUserEnum.edit) {

      }

    } catch (error: any) {
      const messageError = error.response.data.message as string
      if (messageError.includes("already users")) {
        formUser.setError("email",{
          message: "อีเมลนี้ถูกใช้งานเเล้ว"
        })
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...formUser}>
      <form onSubmit={formUser.handleSubmit(handleSubmit)} className="space-y-4">
        <FieldInput 
          control={formUser.control} 
          label="ชื่อ"
          name="name"
          placeholder="กรอกชื่อ"
          icon={<User/>}
        />
        <FieldInput
          control={formUser.control}
          label="อีเมล"
          name="email"
          placeholder="กรอกอีเมล"
          icon={<Mail/>}
        />
        <div className="grid grid-cols-2 gap-4">
          <FieldInputPassword
            control={formUser.control}
            label="รหัสผ่าน"
            name="password"
            placeholder="กรอกรหัสผ่าน"
            icon={<Lock/>}
          />
          <FieldInputPassword
            control={formUser.control}
            label="ยืนยันรหัสผ่าน"
            name="confirmPassword"
            placeholder="ยืนยันรหัสผ่าน"
            icon={<Lock/>}
          />
        </div>
        <FieldSelect
          control={formUser.control}
          label="บทบาท"
          name="role"
          placeholder="กรุณาเลือกบทบาท"
          icon={<Shield/>}
          options={availableRoles}
        />
        
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {mode === "add" ? "กำลังเพิ่ม..." : "กำลังบันทึก..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {mode === "add" ? "เพิ่มผู้ใช้" : "บันทึกการแก้ไข"}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isLoading}
          >
            ยกเลิก
          </Button>
        </div>

      </form>
    </Form>
  );
};

interface DrawerUserFormProp {
  drawerOpen: boolean;
  drawerMode: DrawerModeFormUserEnum;
  selectedUser: UserResponse | undefined;
  setDrawerOpen: (value: boolean) => void;
  getNewlyCreatedUser: (formData: any) => void;
}
export default function DrawerUserForm({
  drawerOpen,
  setDrawerOpen,
  drawerMode,
  getNewlyCreatedUser,
  selectedUser,
}: DrawerUserFormProp) {
  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{`${drawerMode == DrawerModeFormUserEnum.add? "เพิ่มผู้ใช้งาน": "เเก้ไขข้อมูลผู้ใช้งาน"}`}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-16">
          <UserForm
            mode={drawerMode}
            user={selectedUser}
            getNewlyCreatedUser={getNewlyCreatedUser}
            onCancel={() => setDrawerOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

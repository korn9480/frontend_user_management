"use client";

import React, { useState } from "react";
import { Save, Mail, User, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserResponse } from "@/types/interface/response/user";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Form } from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldInput, FieldInputPassword, FieldSelect } from "../share/form";
import { UserDtoCreated, UserDtoUpdate } from "@/types/interface/formData/user";
import { UserService } from "@/service/UserService";
import { DrawerModeFormUserEnum } from "@/types/enum/formUse";

interface UserFormProps {
  mode: DrawerModeFormUserEnum;
  user?: UserResponse;
  getNewlyCreatedUser: (userData: UserResponse) => void;
  getUpdatedUser: (id: number, userData: UserResponse) => void
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
  getUpdatedUser,
  onCancel,
}) => {
  const userService = new UserService();
  const formSchemaUser = z.object({
    name: z.string().min(1, { message: "ไม่ได้กรอบชื่อผู้ใช้" }),
    email: z.string().email({ message: "email ไม่ถูกต้อง" }),
    password: z.string(),
    confirmPassword: z.string(),
    role: z.string({ invalid_type_error: "กรุณาเลือกบทบาท" }),
  })
  .superRefine((data, ctx) => {
    if (mode === DrawerModeFormUserEnum.add) {
      if (!data.password || data.password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 6,
          type: "string",
          inclusive: true,
          message: "รหัสผ่านต้องมากกว่า 6 ตัวอักษร",
          path: ["password"],
        });
      }
      if (!data.confirmPassword || data.confirmPassword.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 6,
          type: "string",
          inclusive: true,
          message: "รหัสผ่านต้องมากกว่า 6 ตัวอักษร",
          path: ["confirmPassword"],
        });
      }
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
    }   
  });

  console.log(">>> ", user)
  const formUser = useForm<z.infer<typeof formSchemaUser>>({
    resolver: zodResolver(formSchemaUser),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      confirmPassword: "",
      role: user? String(user.role.id) : String(availableRoles[1].value)
    },
  })

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: z.infer<typeof formSchemaUser>) => {
    setIsLoading(true);

    try {
      if (mode === DrawerModeFormUserEnum.add) {
        if (formData.password) {
          // เปลี่ยน role user string to number
          let submitData:UserDtoCreated = {
            email: formData.email,
            name: formData.name,
            password: formData.password,
            role_id: Number(formData.role)
          };
          const resUser =  await userService.createUser(submitData)
          getNewlyCreatedUser(resUser.data)
        }
      
      } 
      // ถ้าเเก้ไขข้อมูลผู้ใช้  mode ต้องเป็น  edit เเละ มีข้อมูล user
      else if (mode === DrawerModeFormUserEnum.edit && user) {
        let submitData:UserDtoUpdate = {
          email: formData.email,
          name: formData.name,
          role_id: Number(formData.role)
        };
        const resUser = await userService.updateUser(user?.id, submitData)
        getUpdatedUser(resUser.data.id,resUser.data)
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
          disabled={mode === DrawerModeFormUserEnum.edit}

        />
        <div className="grid grid-cols-2 gap-4" hidden={mode == DrawerModeFormUserEnum.edit}>
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
  getUpdatedUser: (id: number, userData: UserResponse) => void
}
export default function DrawerUserForm({
  drawerOpen,
  setDrawerOpen,
  drawerMode,
  getNewlyCreatedUser,
  getUpdatedUser,
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
            getUpdatedUser={getUpdatedUser}
            onCancel={() => setDrawerOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

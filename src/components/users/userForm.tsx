"use client";

import React, { useState } from "react";
import { Save, Mail, User, Shield, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserResponse, RoleResponse } from "@/types/interface/response/user";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

interface UserFormProps {
  mode: "add" | "edit";
  user?: UserResponse;
  onSubmit: (userData: any) => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  roleId?: string;
}

// Mock roles - replace with actual roles from your API
const availableRoles: RoleResponse[] = [
  { id: 1, name: "Admin" },
  { id: 2, name: "User" },
  { id: 3, name: "Moderator" },
];

const UserForm: React.FC<UserFormProps> = ({
  mode,
  user,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    roleId: user?.role.id || 2,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "roleId" ? Number(value) : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อ";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "ชื่อต้องไม่เกิน 50 ตัวอักษร";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    } else if (formData.email.length > 100) {
      newErrors.email = "อีเมลต้องไม่เกิน 100 ตัวอักษร";
    }

    // Validate password (only required for add mode or if password is provided in edit mode)
    if (mode === "add" || formData.password.trim()) {
      if (!formData.password.trim()) {
        newErrors.password = "กรุณากรอกรหัสผ่าน";
      } else if (formData.password.length < 6) {
        newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
      } else if (formData.password.length > 50) {
        newErrors.password = "รหัสผ่านต้องไม่เกิน 50 ตัวอักษร";
      }
    }

    // Validate confirm password
    if (mode === "add" || formData.password.trim()) {
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "กรุณายืนยันรหัสผ่าน";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
      }
    }

    // Validate role
    if (
      !formData.roleId ||
      !availableRoles.some((role) => role.id === formData.roleId)
    ) {
      newErrors.roleId = "กรุณาเลือกบทบาท";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">ชื่อ</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="กรอกชื่อ"
            className={`pl-10 ${
              errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
        </div>
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">อีเมล</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="กรอกอีเมล"
            className={`pl-10 ${
              errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
        </div>
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">
            รหัสผ่าน
            {mode === "edit" && (
              <span className="text-sm text-gray-500 font-normal ml-1">
                (เว้นว่างหากต้องการเปลี่ยน)
              </span>
            )}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={
                mode === "add"
                  ? "กรอกรหัสผ่าน"
                  : "เว้นว่างหากต้องการเปลี่ยนรหัสผ่าน"
              }
              className={`pl-10 pr-10 ${
                errors.password
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        {(mode === "add" || formData.password.trim()) && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="ยืนยันรหัสผ่าน"
                className={`pl-10 pr-10 ${
                  errors.confirmPassword
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        )}
      </div>

      {/* Role Field */}
      <div className="space-y-2">
        <Label htmlFor="roleId">บทบาท</Label>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <select
            id="roleId"
            name="roleId"
            value={formData.roleId}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
              errors.roleId
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          >
            <option value="">เลือกบทบาท</option>
            {availableRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        {errors.roleId && (
          <p className="text-sm text-red-600">{errors.roleId}</p>
        )}
      </div>

      {/* Form Actions */}
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
  );
};

interface DrawerUserFormProp {
  drawerOpen: boolean;
  drawerMode: "add" | "edit";
  selectedUser: UserResponse | undefined;
  setDrawerOpen: (value: boolean) => void;
  handleFormSubmit: (formData: any) => void;
}
export default function DrawerUserForm({
  drawerOpen,
  setDrawerOpen,
  drawerMode,
  handleFormSubmit,
  selectedUser,
}: DrawerUserFormProp) {
  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-16">
          <UserForm
            mode={drawerMode}
            user={selectedUser}
            onSubmit={handleFormSubmit}
            onCancel={() => setDrawerOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

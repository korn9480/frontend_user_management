"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserResponse } from "@/types/interface/response/user";
import { UserService } from "@/service/UserService";
import { useSession } from "next-auth/react";

interface UserDeletedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | undefined;
  deleteSucceed: (id: number) => void
}

export default function UserDeletedDialog({ open, onOpenChange, user, deleteSucceed }: UserDeletedDialogProps) {
  const { data: session } = useSession()
  const userService = new UserService()
  const confirmDeleteUser = async () => {
    if (user) {
        await userService.delteUser(user?.id);
        deleteSucceed(user.id)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ user?.email == session?.user.email ? "คุณไม่สามารถลบตัวเองออกได้": "ยืนยันที่ของลบผู้ใช้งาน"}</DialogTitle>
          <DialogDescription>
            รายละเอียดของผู้ใช้ที่จะลบ
          </DialogDescription>
        </DialogHeader>
        {user ? (
          <div className="space-y-2">
            <div><b>ชื่อ:</b> {user.name}</div>
            <div><b>อีเมล:</b> {user.email}</div>
            <div><b>บทบาท:</b> {user.role.name}</div>
            <div><b>สร้างเมื่อ:</b> {user.createdAt}</div>
          </div>
        ) : (
          <div>ไม่พบข้อมูลผู้ใช้</div>
        )}
        <DialogFooter>
            <Button type="submit" onClick={()=> confirmDeleteUser()} disabled={user?.email == session?.user.email}>ลบ</Button>
            <DialogClose asChild>
              <Button variant="outline">ยกเลิก</Button>
            </DialogClose>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
import { Calendar, Edit, Mail, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { UserResponse } from "@/types/interface/response/user";

interface UserCardProp {
    user: UserResponse
    colorRole: string
    handleEditUser: (user: UserResponse) => void
    handleDeleteUser: (id: number) => void
}
export function UserCard({user ,colorRole, handleDeleteUser,handleEditUser}: UserCardProp) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
  return (
    <Card key={user.id} className="w-80 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-foreground rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-medium text-lg">
              {user.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{user.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Mail className="w-3 h-3" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Role Badge */}
          <div>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorRole}}`}
            >
              {user.role.name}
            </span>
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>สร้างเมื่อ {formatDate(user.createdAt)}</span>
          </div>

          {/* Actions - Icon only buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleEditUser(user)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              title="แก้ไข"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleDeleteUser(user.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="ลบ"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

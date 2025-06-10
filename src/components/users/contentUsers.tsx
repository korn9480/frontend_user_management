import { UserResponse } from "@/types/interface/response/user"
import { UserCard, UserCardSkeleton } from "./cardUser"
import { Card } from "../ui/card"
import { Users } from "lucide-react"
import { Suspense } from "react"

interface ContentUsersPops {
    isLoading: boolean
    users: UserResponse[]
    handleEditUser: (user: UserResponse) => void
    handleDeleteUser: (user: UserResponse) => void
}

const getRoleColor = (roleName: string) => {
  const colors: { [key: string]: string } = {
    'Admin': 'bg-red-100 text-red-800',
    'User': 'bg-blue-100 text-blue-800',
    'Moderator': 'bg-green-100 text-green-800',
    'Manager': 'bg-purple-100 text-purple-800',
    'Editor': 'bg-yellow-100 text-yellow-800'
  };
  return colors[roleName] || 'bg-gray-100 text-gray-800';
};

export function ContentUsersSkeleton() {
    return (
        <div className="flex flex-wrap gap-4">
            {[...Array(5)].map((_, idx) => (
                <UserCardSkeleton key={idx} />
            ))}
        </div>
    )
}

export function ContentUsers({isLoading, users, handleEditUser, handleDeleteUser}: ContentUsersPops) {
    if (isLoading) {
        return <ContentUsersSkeleton/>
    }
    return (
        <Suspense fallback = {<ContentUsersSkeleton/>}>
            <div className="flex flex-wrap gap-4">
                {users.map((user, index) => (
                    <UserCard
                        key={index}
                        user={user}
                        colorRole={getRoleColor(user.role.name)}
                        handleEditUser={handleEditUser}
                        handleDeleteUser={handleDeleteUser}
                    />
                ))}
            </div>

            {/* No Results */}
            {users.length === 0 && ! isLoading && (
                <Card className="p-12">
                    <div className="text-center">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบผู้ใช้</h3>
                        <p className="text-gray-500">ไม่พบผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา</p>
                    </div>
                </Card>
            )}
        </Suspense>
        
    )
}
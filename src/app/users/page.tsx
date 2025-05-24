'use client'

import { UserService } from "@/service/userService";
import { UserResponse } from "@/types/interface/response/user";
import { useSession } from "next-auth/react"
import { useEffect, useState, useMemo } from "react";
import { Search, Plus, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import DrawerUserForm from "@/components/users/userForm";
import { RoleUser } from "@/types/enum/role";
import { UserCard } from "@/components/users/cardUser";

// Role colors mapping
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

export default function Page() {
    const {data: session} = useSession()
    const userService = new UserService();

    const [users, setUsers] = useState<UserResponse[]>([])
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    
    // Drawer states
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
    const [selectedUser, setSelectedUser] = useState<UserResponse | undefined>();
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await userService.getUserAll()
                const users = data.data
                setUsers(users || []);
            } catch (error) {
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers()
    }, [])

    // Get unique roles for filter
    const roles = useMemo(() => {
        const uniqueRoles = Array.from(new Set(users.map(user => user.role.name)));
        return uniqueRoles;
    }, [users]);

    // Filter users
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role.name === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAddUser = () => {
        setDrawerMode('add');
        setSelectedUser(undefined);
        setDrawerOpen(true);
    };

    const handleEditUser = (user: UserResponse) => {
        setDrawerMode('edit');
        setSelectedUser(user);
        setDrawerOpen(true);
    };

    const handleFormSubmit = async (formData: any) => {
        if (drawerMode === 'add') {
            // ลบ key data ที่ไม่จำเป็นต้องส่งไปหลังบ้าน
            delete formData.confirmPassword
            formData.role_id = formData.roleId
            delete formData.roleId
            const resUser =  await userService.createUser(formData)
            setUsers([resUser.data, ...users])
            setDrawerOpen(false);
        } else if (drawerMode === 'edit' && selectedUser) {
            // TODO: Call API to update user
            console.log('Updating user:', selectedUser.id, formData);
            // For now, just close the drawer
            setDrawerOpen(false);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (confirm('คุณต้องการลบผู้ใช้นี้หรือไม่?')) {
            try {
                // TODO: Call API to delete user
                console.log('Deleting user:', userId);
                // For now, just remove from state
                setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary-foreground rounded-lg">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">จัดการผู้ใช้</h1>
                            <p className="text-gray-600">จัดการข้อมูลผู้ใช้ในระบบ</p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder="ค้นหาผู้ใช้..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Role Filter */}
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">บทบาททั้งหมด</option>
                                    {roles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Add User Button */}
                            { session?.user.role.name == RoleUser.admin && (
                                <Button onClick={handleAddUser}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    เพิ่มผู้ใช้ใหม่
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Users Grid - Horizontal layout */}
                <div className="flex flex-wrap gap-4">
                    {filteredUsers.map((user) => (
                        <UserCard
                            user={user}
                            colorRole={getRoleColor(user.role.name)}
                            handleEditUser={handleEditUser}
                            handleDeleteUser={handleDeleteUser}
                        />
                    ))}
                </div>

                {/* No Results */}
                {filteredUsers.length === 0 && !loading && (
                    <Card className="p-12">
                        <div className="text-center">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบผู้ใช้</h3>
                            <p className="text-gray-500">ไม่พบผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา</p>
                        </div>
                    </Card>
                )}

                {/* Results Count */}
                {filteredUsers.length > 0 && (
                    <div className="mt-8 text-center text-sm text-gray-500">
                        แสดง {filteredUsers.length} จาก {users.length} ผู้ใช้
                    </div>
                )}
            </div>

            {/* Drawer */}
            <Drawer 
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
            >
                 <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Edit profile</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-16">
                        <DrawerUserForm
                            selectedUser={selectedUser}
                            drawerOpen={drawerOpen}
                            drawerMode={drawerMode}
                            handleFormSubmit={handleFormSubmit}
                            setDrawerOpen={setDrawerOpen}
                        />
                    </div>
                    
                    
                </DrawerContent>
            </Drawer>
        </div>
    );
}

export interface RoleResponse {
  id: number;
  name: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: string; // หรือ Date
  role: RoleResponse;
}
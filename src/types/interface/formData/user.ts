export interface UserDtoCreated {
  name: string;
  email: string;
  role_id: number;
  password: string;
}

export type UserDtoUpdate = Omit<UserDtoCreated, "password">; 
import { ApiClient } from './api';
import { UserResponse } from '@/types/interface/response/user';
import { ApiResponse } from '@/types/interface/response/apiResponse';
import { UserDto } from '@/types/interface/formData/user';
export class UserService {
  private readonly api = ApiClient.getInstance().getApi();

  async getUserAll(search?: string): Promise<ApiResponse<UserResponse[]>> {
    const urlQuery = search? "?search=${search}": ""
    const respose = await this.api.get(`/user${urlQuery}`)
    return respose.data
  }

  async getUserById(id: number): Promise<ApiResponse<UserResponse[]>> {
    const respose = await this.api.get(`/user?id=${id}`)
    return respose.data
  }

  async createUser(body: UserDto): Promise<ApiResponse<UserResponse[]>> {
    const respose = await this.api.post("/user",body)
    return respose.data
  }

  async updateUser(id: number, body: UserDto): Promise<ApiResponse<UserResponse[]>> {
    const respose = await this.api.put(`/user/${id}`,body)
    return respose.data
  }

  async delteUser(id: number): Promise<ApiResponse<UserResponse[]>> {
    const respose = await this.api.delete(`/user/${id}`)
    return respose.data
  }

}

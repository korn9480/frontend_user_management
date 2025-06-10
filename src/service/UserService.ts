import { ApiClient } from './api';
import { UserResponse } from '@/types/interface/response/user';
import { ApiResponse } from '@/types/interface/response/apiResponse';
import { UserDtoCreated, UserDtoUpdate } from '@/types/interface/formData/user';
import { PaginationSearch } from '@/types/interface/search/pagination';
export class UserService {
  private readonly api = ApiClient.getInstance().getApi();

  async getUserAll(search: PaginationSearch): Promise<ApiResponse<UserResponse[]>> {
    const params = new URLSearchParams();
    if (search.search) params.append("search", search.search);
    if (search.limit) params.append("limit", String(search.limit));
    if (search.page) params.append("page", String(search.page))
    // const urlQuery = search? "?search=${search}": ""
    const respose = await this.api.get(`/user?${params.toString()}`);
    return respose.data
  }

  async getUserById(id: number): Promise<ApiResponse<UserResponse[]>> {
    const respose = await this.api.get(`/user?id=${id}`)
    return respose.data
  }

  async createUser(body: UserDtoCreated): Promise<ApiResponse<UserResponse>> {
    const respose = await this.api.post("/user",{
      ...body,
      role_id: body.role_id
    })
    return respose.data
  }

  async updateUser(id: number, body: UserDtoUpdate): Promise<ApiResponse<UserResponse>> {
    const respose = await this.api.put(`/user/${id}`,body)
    return respose.data
  }

  async delteUser(id: number): Promise<ApiResponse<UserResponse>> {
    const respose = await this.api.delete(`/user/${id}`)
    return respose.data
  }

}

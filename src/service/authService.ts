import { LoginDto } from "@/types/interface/formData/auth";
import { ApiClient } from "./api";
import { ApiResponse } from "@/types/interface/response/apiResponse";
import { UserResponse } from "@/types/interface/response/user";
import { UserDtoCreated } from "@/types/interface/formData/user";

export class AuthService {
    private readonly api = ApiClient.getInstance().getApi();

    async login(formData: LoginDto) {
        const respose = await this.api.post("auth/login",{
            ...formData,
        })
        return respose.data
    }

    async register(formData: UserDtoCreated): Promise<ApiResponse<UserResponse>> {
        const respose = await this.api.post("auth/register",{
            ...formData,
        })
        return respose.data
    }
}
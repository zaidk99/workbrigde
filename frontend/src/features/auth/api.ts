import  {api}  from "../../api/client";
import type { LoginRequest, LoginResponse } from "../../types/auth";


export const login = async(body: LoginRequest):Promise<LoginResponse>=>{
    const response = await api.post<LoginResponse>("/auth/login",body);
    return response.data;
};


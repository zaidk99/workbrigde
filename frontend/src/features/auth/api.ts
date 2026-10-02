import  {apiRequest}  from "../../api/client";
import type { LoginRequest, LoginResponse } from "../../types/auth";


export const login = async (
    body: LoginRequest
): Promise<LoginResponse> =>{
    const response = await apiRequest<LoginResponse>(
        "POST",
        "/auth/login",
        body
    );
    return response;
};


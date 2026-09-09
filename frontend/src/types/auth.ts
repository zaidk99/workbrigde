export interface AuthUser{
   id:string;
   name:string;
   role: "admin" | "employee" | "client";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse{
        message: string;
        token: string;
        user: AuthUser;
}


export interface AuthContextType {
    user: AuthUser | null;
    token: string| null;
    isAuthenticated: boolean;
    loginAuth: (data:LoginResponse) => void;
    logut: ()=> void;
}


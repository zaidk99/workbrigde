const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// error class : LoginPage can show backend message

export class AppError extends Error {
    status:number;

    constructor(status:number,message:string){
        super(message);
        this.status = status;
    }
}   

export async function apiRequest<T>(
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    path: string,
    body?: unknown,
    options?: {skipAuth?: boolean}
):Promise<T>{
    
    const url = `${BASE_URL}${path}`;
    const headers : HeadersInit = {
        "Content-Type":"application/json",
    };

    const token = localStorage.getItem("authToken");

    if(token && !options?.skipAuth){
        headers.Authorization = `Bearer ${token}`;
    }

    const config : RequestInit = {
         method,
         headers,
    };

    if(body !== undefined){
        config.body = JSON.stringify(body);
    }

    const response = await fetch(url,config);

    if(!response.ok){
        const errorData = await response.json();
        throw new AppError(
            response.status,
            errorData.message
        );
    }
    const data = await response.json();
    return data;


}




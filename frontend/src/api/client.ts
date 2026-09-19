const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// error class : LoginPage can show backend message

export class AppError extends Error {
    status:number;

    constructor(status:number,message:string){
        super(message);
        this.status = status;
    }
}   







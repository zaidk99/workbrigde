import { ENV } from "../config/env";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwt.types";

export const generateToken = (id : string , role : string): string =>{
    const payload : JwtPayload = {id,role};
    return jwt.sign(
        payload,
        ENV.JWT_SECRET as string,
        {expiresIn: '1d'}
    );
};


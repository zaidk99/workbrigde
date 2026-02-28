import express from "express";
import { pool } from "../../config/db";
import { usePasswordCompare } from "../../utils/hashPassword";
import { generateToken } from "../../utils/generateToken";


interface AuthResponse {
    token : string;
    user: {
        id:string;
        name:string;
        role:string;
    }
}
export const authServiceslogin = async (email:string , password:string): Promise <AuthResponse> => {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    const user = result.rows[0];
    if(!user) throw new Error('User not found');
    const isMatch = await usePasswordCompare(password , user.password);
    if(!isMatch) throw new Error('Invalid credentials');
    const token = generateToken(user.id , user.role);
    return {
        token ,
        user: {id:user.id , name:user.name , role:user.role}
    }
};


import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { pool } from "../../config/db";
import { userPasswordHash } from "../../utils/hashPassword";

interface registeredUserResponse {
    user : {
        id:string;
        email:string;
        name:string;
        password:string;
        role:string;
        is_active:boolean;
        company_name:string;
        phone:string;
        company_address:string;
    }

};

export const registerUser = async (registeredUserResponse): Promise <registeredUserResponse> => {
    
   const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [registeredUserResponse.email]
   );
   const user = result.rows[0];
   if(user) throw new Error("User Exists");
   
   const processPassword = await userPasswordHash(registeredUserResponse.password);

    const insertUsers = await pool.query(
            'INSERT INTO users(name,email,password,role,is_active) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,role',
            [registeredUserResponse.name,registeredUserResponse.email,processPassword,registeredUserResponse.role,registeredUserResponse.is_active]
    )
    
    if(insertUsers.rows[0].role === 'client'){
        const getClientId = insertUsers.rows[0].id;
        const insertClientProfile = await pool.query(
            'INSERT INTO client_profile(client_user_id,company_name,phone,company_address) VALUES ($1,$2,$3,$4)',
            [getClientId,registeredUserResponse.company_name,registeredUserResponse.phone,registeredUserResponse.company_address]
        )
    }

    const newUser = insertUsers.rows[0];

    return {
        user: {
            id : newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        }
    }
};
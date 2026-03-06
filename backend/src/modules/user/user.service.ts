import { pool } from "../../config/db";
import { userPasswordHash } from "../../utils/hashPassword";

interface returnregisteredUserResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface inputregisteredUserResponse {
  email: string;
  password: string;
  name: string;
  role: string;
  is_active: boolean;
  company_name?: string;
  phone?: string;
  company_address?: string;
}

interface UserResponse {
    id: string;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
}

export const registerUser = async (
  data: inputregisteredUserResponse
): Promise<returnregisteredUserResponse> => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    data.email,
  ]);
  const user = result.rows[0];
  if (user) throw new Error("user exists");

  const processPassword = await userPasswordHash(data.password);

  const insertUsers = await pool.query(
    `INSERT INTO users(name,email,password,role,is_active) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,role`,
    [data.name, data.email, processPassword, data.role, data.is_active],
  );

  if (insertUsers.rows[0].role === "client") {
    const getClientId = insertUsers.rows[0].id;
    const insertClientProfile = await pool.query(
      `INSERT INTO client_profiles(client_user_id,company_name,phone,company_address) VALUES ($1,$2,$3,$4)`,
      [getClientId, data.company_name, data.phone, data.company_address],
    );
  }

  const newUser = insertUsers.rows[0];

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  };
};


export const getUserByrole = async (role:string):Promise<UserResponse[]>=>{
    const result = await pool.query(`SELECT id,name,email,role,is_active FROM users WHERE role = $1`, [role]);
    if(result.rowCount === 0 ) throw new Error('user not found with this role');
    return result.rows ;
};

export const deactivateUserByid = async (id:string):Promise<void>=>{
    const result = await pool.query(`UPDATE users SET is_active = FALSE WHERE id=$1` , [id]);
    if(result.rowCount === 0) throw new Error('user not found');
}

export const deleteUserById = async (id:string):Promise<void>=>{
    const result = await pool.query(`DELETE FROM users WHERE id=$1` , [id]);
    if(result.rowCount === 0 ) throw new Error('user not found');
}



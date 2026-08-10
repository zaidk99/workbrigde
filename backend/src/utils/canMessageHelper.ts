import { pool } from "../config/db";

export const canMessage = async (
  sender_id: string,
  sender_role: string,
  receiver_id: string,
) => {
  const get_receiver_role = await pool.query(
    `SELECT role FROM users WHERE id = $1`,
    [receiver_id],
  );

  const receiver_role = get_receiver_role.rows[0]?.role;
  console.log("receiver_role in helper function canMessage :", receiver_role);

  if (!receiver_role) {
    throw new Error("receiver not found");
  }

  if (sender_role === "admin" || receiver_role === "admin") {
    return true;
  }

  if (sender_role === "employee" && receiver_role === "employee") {
    const result = await pool.query(
      `
                                SELECT EXISTS(SELECT 1 FROM project_employees 
                                pe1 JOIN project_employees pe2  
                                      ON pe1.project_id = pe2.project_id 
                                WHERE pe1.employee_id = $1
                                AND   pe2.employee_id = $2
                                )`,
      [sender_id, receiver_id],
    );

    return result.rows[0].exists;
  }

  if (sender_role === "employee" && receiver_role === "client") {
    // check employee belongs to client's project
    const result = await pool.query(
      `SELECT EXISTS (SELECT 1 
         FROM projects p 
         JOIN project_employees pe 
         ON p.id = pe.project_id
         WHERE pe.employee_id = $1
         AND p.client_user_id = $2 
         AND p.status = 'inprogress' )`,
      [sender_id, receiver_id],
    );
    return result.rows[0].exists;
  }

  if (sender_role === "client" && receiver_role === "employee") {
      const result = await pool.query( `SELECT EXISTS (SELECT 1 FROM projects p 
        JOIN project_employees pe 
        ON p.id = pe.project_id 
        WHERE 
        pe.employee_id = $2 
        AND
        p.client_user_id = $1 
        AND 
        p.status = 'inprogress' )`,[sender_id,receiver_id]);
        return result.rows[0].exists;
  }

  return false;
};

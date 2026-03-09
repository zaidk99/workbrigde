import express from "express";
import { pool } from "../../config/db";

interface inputForCreatingSr {
  client_user_id: string;
  title: string;
  description: string;
}
interface outForafterCreatingSr extends inputForCreatingSr {
  id: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
export const createServiceRequestsbyClientService = async (
  data: inputForCreatingSr,
): Promise<outForafterCreatingSr> => {
  const result = await pool.query(
    `INSERT INTO service_requests(client_user_id,title,description) VALUES($1,$2,$3) RETURNING * `,
    [data.client_user_id, data.title, data.description],
  );
  return result.rows[0];
};

export const getallSRforSpecificClientServiceRequestService = async (
  client_user_id:string,
): Promise<outForafterCreatingSr[]> => {
  const result = await pool.query(
    `SELECT * FROM service_requests WHERE client_user_id = $1 `,
    [client_user_id]
  );
  return result.rows;
};

export const getallServiceRequestsService = async ():Promise<outForafterCreatingSr[]> => {
   const result = await pool.query(`SELECT * FROM service_requests`);
   return result.rows;
}

export const getServiceRequestsByidinitiaterclientandadminservice = async (id:string):Promise<outForafterCreatingSr | null>=>{
  const result = await pool.query(`SELECT * FROM service_requests WHERE id = $1`,[id]);
  return result.rows[0] || null;
};


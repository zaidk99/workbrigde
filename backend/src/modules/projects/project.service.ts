import express from "express";
import { pool } from "../../config/db";

interface inputForprojectServie {
  id: string;
}
interface outputForprojectService {
  id: string;
  name: string;
  description: string;
  client_user_id: string;
  service_request_id: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  client_name: string;
  client_email: string;1
}

export const getallProjectsinitiatoradminOnly = async () : Promise <outputForprojectService[]> => {

    const result = await pool.query(`SELECT 
        p.id,
        p.name,
        p.description,
        p.client_user_id,
        p.service_request_id,
        p.status,
        p.created_at,
        p.updated_at,
        u.name AS client_name,
        u.email AS client_email

        FROM projects p JOIN users u ON u.id = p.client_user_id
        ORDER BY p.created_at DESC
        `);

        return result.rows;

};

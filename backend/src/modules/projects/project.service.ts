import express from "express";
import { pool } from "../../config/db";

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
  client_email: string;
}

export const getallProjectsinitiatoradminOnly = async (): Promise<
  outputForprojectService[]
> => {
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

export const getallProjectsSpecifictoClientService = async (
  client_user_id: string,
): Promise<outputForprojectService[]> => {
  const result = await pool.query(
    `SELECT 

      id,
      name,
      description,
      client_user_id,
      service_request_id,
      status,
      created_at,
      updated_at

      FROM projects WHERE client_user_id = $1`,
    [client_user_id],
  );

  return result.rows;
};

export const getallassignedprojectsbyemployeeService = async (
  employee_user_id: string,
): Promise<outputForprojectService[]> => {
  const result = await pool.query(
  `SELECT 

  pe.project_id,
  pe.assigned_at,

  p.name,
  p.description,
  p.service_request_id,
  p.status,
  p.created_at,
  p.updated_at,


  u.name AS client_name

  FROM project_employees pe 
  JOIN projects p
     ON pe.project_id = p.id
  JOIN users u 
     ON p.client_user_id = u.id
  WHERE pe.employee_id = $1`,
  [employee_user_id],
  );

  return result.rows;
};

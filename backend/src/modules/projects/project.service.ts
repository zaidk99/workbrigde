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

export const getProjectsByidservice = async (
  project_id: string,
  user_role: string,
  user_id: string,
): Promise<outputForprojectService | null> => {
  const getProject = await pool.query(
    `
  
  SELECT 
  
  id,
  name,
  description,
  client_user_id,
  service_request_id,
  status,
  created_at,
  updated_at

  FROM projects WHERE id = $1`,
    [project_id],
  );

  const project = getProject.rows[0];

  if (!project) {
    throw new Error("project does not exist");
  }

  if (user_role === "admin") {
    return project;
  }

  if (user_role === "client") {
    if (project.client_user_id === user_id) {
      return project;
    }
    throw new Error("unauthorized");
  }

  if (user_role === "employee") {
    const assignedproject = await pool.query(
      `
      SELECT * FROM project_employees WHERE project_id = $1 AND employee_id = $2`,
      [project_id, user_id],
    );

    if (!assignedproject.rows[0]) {
      throw new Error("unauthorized");
    }

    return project;
  }

  throw new Error("unauthorized");
};

export const getEmpolyeesandthereworkloadforassigningProjects = async (project_id:string) => {
  const allEmployees = await pool.query(
    `   SELECT 
        u.id,
        u.name,
        COUNT(pe.project_id) AS project_count
          FROM users u
          LEFT JOIN project_employees pe ON pe.employee_id = u.id
            WHERE u.role = 'employee'
            AND u.is_active = true
		        AND u.id NOT IN (
			      SELECT employee_id FROM project_employees
			      WHERE project_id = $1)
        GROUP BY u.id,u.name
        ORDER BY project_count ASC
        `,[project_id]);
  return allEmployees.rows;
};

export const assigningEmployeetospecificProject = async (
  project_id: string, assigned_employees:string[]
) => {

  const validEmps = await pool.query(
    ` 
    SELECT id FROM users 
    WHERE id = ANY($1::uuid[])
    AND role = 'employee'
    AND is_active = true `,
    [assigned_employees]

  );

  const validIds = new Set(validEmps.rows.map(r=>r.id));
  const invalidIds = assigned_employees.filter(id=>!validIds.has(id));

  const allreadyAssigned = await pool.query(`
    SELECT employee_id FROM project_employees
    WHERE project_id = $1
    AND employee_id = ANY($2::uuid[])`,[project_id,assigned_employees]);


  const assignedIdsalready = new Set(allreadyAssigned.rows.map(r=>r.employee_id));
  const allreadyAssignedList = assigned_employees.filter(id=>assignedIdsalready.has(id));


  const toAssign = assigned_employees.filter(
    id=>validIds.has(id) && !assignedIdsalready.has(id)
  );

  // bulk insert the employees

  if(toAssign.length > 0){
      const values = toAssign.map((_,i)=>`($1,$${i+2})`).join(',');

  await pool.query(
    `INSERT INTO project_employees (project_id,employee_id)
     VALUES ${values}`,[project_id,...toAssign]
  );
}


return {
    assigned: toAssign,                      // successfully assigned
    already_assigned: allreadyAssignedList,  // were already on project
    invalid: invalidIds,                     // don't exist or not employees
  };

};

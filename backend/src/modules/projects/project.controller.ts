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
}

export const getallProjectsinitiatoradminOnly = async (
  inputForprojectServi,
): Promise<outputForprojectService[]> => {

    
};

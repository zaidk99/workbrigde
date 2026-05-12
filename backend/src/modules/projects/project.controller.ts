import { Request, Response } from "express";
import {
  getallassignedprojectsbyemployeeService,
  getallProjectsinitiatoradminOnly,
  getallProjectsSpecifictoClientService,
  getProjectsByidservice,
} from "./project.service";

export const getallProjectsinitiatoradminOnlyController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const getallproj = await getallProjectsinitiatoradminOnly();

    res.status(200).json({
      success: true,
      message: "got all projects successfully",
      count: getallproj.length,
      allprojects: getallproj,
    });
  } catch (error: any) {
    console.error("error fetching projects", error);

    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error instanceof Error ? error.message : "unknown error",
    });
  }
};

export const getallProjectsSpecifictoClientController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  // getting client user id
  const client_user_id = req.user.id;

  try {
    const gettingClientsprojects =
      await getallProjectsSpecifictoClientService(client_user_id);
    res.status(200).json({
      success: true,
      message: "got clients projects",
      clientsProjects: gettingClientsprojects,
    });
  } catch (error: any) {
    console.error("error fetching clients projects", error);

    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error instanceof Error ? error.message : "unknow error",
    });
  }
};

export const getallassignedprojectsbyemployeeController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
  const getEmpoyeedId = req.user.id;

  try {
    const getProjectsassigned =
      await getallassignedprojectsbyemployeeService(getEmpoyeedId);
    res.status(200).json({
      success: true,
      message: "got assigned projects successfully",
      allassignedProjects: getProjectsassigned,
    });
  } catch (error: any) {
    console.error("error fetching employee assigned projects", error);
    res.status(500).json({
      success: false,
      message: "internal server error",
      errro: error instanceof Error ? error.message : "unknown error",
    });
  }
};

export const getProjectsByidcontroller = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const user_role = req.user.role;
  const user_id = req.user.id;
  const { project_id } = req.params;

  try {
    const getProjectByid = await getProjectsByidservice(
      project_id as string,
      user_role,
      user_id,
    );

    res.status(200).json({
      success: true,
      message: "got the project successfully",
      project: getProjectByid,
    });
  } catch (error: any) {
    if (error.message === "project does not exist") {
      res.status(404).json({
        success: false,
        message: "project not found",
      });
      return;
    }

    if (error.message === "unauthorized") {
      res.status(403).json({
        success: true,
        message: "you dont have access to this project",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error instanceof Error ? error.message : "unknown error",
    });
  }
};

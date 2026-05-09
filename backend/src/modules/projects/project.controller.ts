import { Request, Response } from "express";
import {
  getallProjectsinitiatoradminOnly,
  getallProjectsSpecifictoClientService,
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

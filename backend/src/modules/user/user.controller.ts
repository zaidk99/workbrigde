import express from "express";
import { Request, Response } from "express";
import {
  deactivateUserByid,
  deleteUserById,
  getUserByrole,
  registerUser,
} from "./user.service";

export const registerUserController = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    role,
    is_active,
    company_name,
    phone,
    company_address,
  } = req.body;

  try {
    const result = await registerUser({
      name,
      email,
      password,
      role,
      is_active,
      company_name,
      phone,
      company_address,
    });
    res.status(201).json({
      message: "User registered successfully",
      user: result.user,
    });
  } catch (error: any) {
    if (error.message === "User Exists") {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserByrolecontroller = async (req: Request, res: Response) => {
  try {
    const role = req.query.role as string;
    if (!role) {
      return res.status(400).json({ message: "role is required" });
    }
    const users = await getUserByrole(role);
    res.status(200).json({
      message: "users fetched successfully",
      users,
    });
  } catch (error: any) {
    if (error.message === "users not found with this role") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deactivateUserByidController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = req.params.id as string;
    if (!id) {
      return res.status(400).json({ message: "user id is required" });
    }
    await deactivateUserByid(id);
    return res.status(200).json({ message: "user deactivate successfully" });
  } catch (error: any) {
    if (error.message === "user not found") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) {
      return res.status(400).json({ message: "user Id is required" });
    }
    await deleteUserById(id);
    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error: any) {
    if (error.message === "user not found") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

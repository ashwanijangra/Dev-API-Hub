import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import History from "../models/History";

export const saveHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const history = await History.create({
      user: req.user?.id,
      ...req.body,
    });

    res.status(201).json(history);
  } catch {
    res.status(500).json({
      message: "Failed to save history",
    });
  }
};

export const getHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const history = await History.find({
      user: req.user?.id,
    }).sort({
      createdAt: -1,
    });

    res.json(history);
  } catch {
    res.status(500).json({
      message: "Failed to fetch history",
    });
  }
};
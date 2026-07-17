import { Router } from "express";

import {
  saveHistory,
  getHistory,
} from "../controllers/historyController";

import {
  protect,
} from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, saveHistory);

router.get("/", protect, getHistory);

export default router;
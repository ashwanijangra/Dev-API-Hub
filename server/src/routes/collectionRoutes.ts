import { Router } from "express";

import {
  saveCollection,
  getCollections,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, saveCollection);

router.get("/", protect, getCollections);

router.put("/:id", protect, updateCollection);

router.delete("/:id", protect, deleteCollection);

export default router;
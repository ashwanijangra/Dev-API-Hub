import { Request, Response } from "express";
import Collection from "../models/Collection";
import { AuthRequest } from "../middleware/authMiddleware";

// Save Collection
export const saveCollection = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      name,
      method,
      url,
      body,
      headers,
      params,
      token,
    } = req.body;

    const collection = await Collection.create({
      user: req.user?.id,
      name,
      method,
      url,
      body,
      headers,
      params,
      token,
    });

    res.status(201).json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to save collection",
    });
  }
};

// Get Collections
export const getCollections = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const collections = await Collection.find({
      user: req.user?.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch collections",
    });
  }
};
// Delete Collection
export const deleteCollection = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    await Collection.findOneAndDelete({
      _id: req.params.id,
      user: req.user?.id,
    });

    res.json({
      message: "Collection Deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: "Delete Failed",
    });

  }
};

// Update Collection
export const updateCollection = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const collection =
      await Collection.findOneAndUpdate(

        {
          _id: req.params.id,
          user: req.user?.id,
        },

        req.body,

        {
          new: true,
        }

      );

    res.json(collection);

  } catch (error) {

    res.status(500).json({
      message: "Update Failed",
    });

  }

};
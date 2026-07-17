import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    method: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      default: "",
    },

    headers: {
      type: Array,
      default: [],
    },

    params: {
      type: Array,
      default: [],
    },

    token: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Collection",
  collectionSchema
);
import mongoose from "mongoose";

const CollaborationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a collaborator or brand name."],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Please provide a partnership role."],
      trim: true,
    },
    coverImage: {
      type: String,
      required: [true, "Please provide a cover image URL."],
    },
    logo: {
      type: String,
      required: [true, "Please provide a logo URL."],
    },
    shortDesc: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Collaboration ||
  mongoose.model("Collaboration", CollaborationSchema);
import mongoose from "mongoose";

const BlogModel = new mongoose.Schema({
  title: String,
  img: String,
  postedby: String,
  slug: String,
  category: String,
  imgalt: String,
  description: String,
  metaDescription: { // ADDED THIS FIELD
    type: String,
    default: "",
  },
  blog_detail: [],
  tags: [String],
  comments: [
    {
      img: String,
      name: String,
      email: String,
      message: String,
      status: {
        type: String,
        default: "Active",
      },
      replies: [
        {
          img: String,
          name: String,
          email: String,
          message: String,
          status: {
            type: String,
            default: "Active",
          },
          postedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      postedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    default: "Inactive", 
  },
  scheduledAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
});

export const BLOGMODEL = mongoose.models.blogs || mongoose.model("blogs", BlogModel);
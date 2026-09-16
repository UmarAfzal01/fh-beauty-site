import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema(
  {
    subtitle: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    imgalt: {
      type: String,
      default: '',
    },
    // Using Mixed type allows you to save any object structure 
    // (like triplet-batch, side-image, etc.) without strict schema validation errors
    about_detail: [
      {
        type: mongoose.Schema.Types.Mixed, 
      }
    ]
  },
  { timestamps: true }
);

export const ABOUTMODEL = mongoose.models.About || mongoose.model('About', AboutSchema);
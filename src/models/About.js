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
    // Using Mixed type for flexible custom layouts/batches
    about_detail: [
      {
        type: mongoose.Schema.Types.Mixed, 
      }
    ],
    // Array of Doctor references (storing ObjectIds as strings)
    doctors: [
      {
        type: String,
      }
    ],
    // Structured reviews section
    reviews: [
      {
        image: {
          type: String,
          default: '',
        },
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          default: '',
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
          default: 5,
        },
        message: {
          type: String,
          required: true,
        },
      }
    ]
  },
  { timestamps: true }
);

export const ABOUTMODEL = mongoose.models.About || mongoose.model('About', AboutSchema);
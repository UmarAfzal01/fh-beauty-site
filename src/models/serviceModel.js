import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    // You can easily add more fields here in the future (e.g., price, description, icon)
  },
  { timestamps: true }
);

export const SERVICE_MODEL =
  mongoose.models.services || mongoose.model('services', serviceSchema);
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        productId: {
          type: String,
          required: false,
        },
        name: { 
          type: String, 
          required: true 
        },
        price: { 
          type: Number, 
          required: true 
        },
        quantity: { 
          type: Number, 
          required: true, 
          min: 1 
        },
        selectedOption: { 
          type: String, 
          default: "Standard" 
        },
        image: { 
          type: String 
        },
      },
    ],

    shippingInfo: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },

    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    paymentMethod: { type: String, default: "COD" },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    orderStatus: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
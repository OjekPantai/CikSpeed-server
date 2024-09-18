import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },
    totalEstimatedTime: {
      type: Number,
      required: [true, "Total estimated time is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    services: [
      {
        service: {
          type: Schema.Types.ObjectId,
          ref: "Service",
          required: [true, "Service is required"],
        },
        name: String,
        price: Number,
        estimatedTime: Number,
      },
    ],
    status: {
      type: String,
      enum: ["menunggu konfirmasi", "dalam antrian", "selesai"],
      default: "menunggu konfirmasi",
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    motorcycleType: {
      type: String,
      required: [true, "Motorcycle type is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    complaintMessage: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;

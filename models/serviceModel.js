import mongoose from "mongoose";

const { Schema } = mongoose;

const serviceSchema = new Schema({
  name: {
    type: String,
    required: [true, "Service name is required"],
    unique: [true, "Service with this name already exists"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  description: {
    type: String,
    required: [true, "Service description is required"],
  },
  category: {
    type: String,
    required: [true, "Service category is required"],
    enum: ["servis ringan", "servis besar"],
  },
  estimatedTime: {
    type: Number,
    required: [true, "Estimated time is required"],
  },
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;

import asyncHandler from "../middlewares/asyncHandler.js";
import Service from "../models/serviceModel.js";
import Order from "../models/orderModel.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { name, motorcycleType, phone, complaintMessage, address, services } =
    req.body;
  const userId = req.user._id; // Assuming you have middleware that sets req.user

  if (!services || services.length === 0) {
    res.status(400);
    throw new Error("Please provide at least one service");
  }

  let totalPrice = 0;
  let totalEstimatedTime = 0;
  let uniqueServices = [...new Set(services)]; // Remove duplicates
  let orderServices = [];

  for (const serviceId of uniqueServices) {
    const serviceData = await Service.findById(serviceId);
    if (!serviceData) {
      res.status(404);
      throw new Error(`Service with id ${serviceId} not found`);
    }
    totalPrice += serviceData.price;
    totalEstimatedTime += serviceData.estimatedTime;
    orderServices.push({
      service: serviceData._id,
      name: serviceData.name,
      price: serviceData.price,
      estimatedTime: serviceData.estimatedTime,
    });
  }

  const order = await Order.create({
    name,
    motorcycleType,
    phone,
    complaintMessage,
    address,
    services: orderServices,
    totalPrice,
    totalEstimatedTime,
    user: userId,
  });

  // Populate the user field
  await order.populate("user", "name email");

  return res.status(201).json({
    message: "Success create order",
    order,
  });
});

export const getAllOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .select(
      "name motorcycleType phone complaintMessage address total services status createdAt updatedAt"
    )
    .populate({
      path: "services",
      select: "name price estimatedTime",
    })
    .populate({
      path: "user",
      select: "name",
    });

  return res.status(200).json({
    message: "Success get all orders",
    data: orders.map((order) => ({
      id: order._id,
      name: order.name,
      motorcycleType: order.motorcycleType,
      phone: order.phone,
      complaintMessage: order.complaintMessage,
      address: order.address,
      total: order.total,
      status: order.status,
      services: order.services.map((service) => ({
        id: service._id,
        name: service.name,
        price: service.price,
        estimatedTime: service.estimatedTime,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt, // Menambahkan updatedAt
    })),
  });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("services.service");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  return res.status(200).json({
    id: order._id,
    name: order.name,
    motorcycleType: order.motorcycleType,
    phone: order.phone,
    complaintMessage: order.complaintMessage,
    address: order.address,
    totalPrice: order.totalPrice,
    totalEstimatedTime: order.totalEstimatedTime,
    status: order.status,
    user: {
      id: order.user._id,
      name: order.user.name,
      email: order.user.email,
    },
    services: order.services.map((service) => ({
      id: service.service._id,
      name: service.service.name,
      price: service.service.price,
      description: service.service.description,
      category: service.service.category,
      estimatedTime: service.service.estimatedTime,
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = [
    "menunggu konfirmasi",
    "dalam antrian",
    "sedang dikerjakan",
    "selesai",
  ];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;

  const updatedOrder = await order.save();

  return res.status(200).json({
    message: "Update Order status success",
    data: updatedOrder,
  });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  // Temukan order berdasarkan ID
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Hapus order
  await Order.deleteOne({ _id: orderId });

  return res.status(200).json({
    message: "Delete Order success",
  });
});

export const currentUserOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Ambil user ID dari request
  const orders = await Order.find({ user: userId })
    .populate("services.service")
    .sort({ createdAt: -1 }); // Urutkan berdasarkan waktu pembuatan terbaru

  if (!orders || orders.length === 0) {
    return res.status(404).json({
      message: "No orders found for current user",
    });
  }

  const formattedOrders = orders.map((order) => ({
    id: order._id,
    name: order.name,
    motorcycleType: order.motorcycleType,
    phone: order.phone,
    complaintMessage: order.complaintMessage,
    address: order.address,
    totalPrice: order.totalPrice,
    totalEstimatedTime: order.totalEstimatedTime,
    status: order.status,
    services: order.services.map((service) => ({
      id: service.service._id,
      name: service.service.name,
      price: service.service.price,
      description: service.service.description,
      category: service.service.category,
      estimatedTime: service.service.estimatedTime,
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));

  return res.status(200).json({
    message: "Current User Orders",
    data: formattedOrders,
  });
});

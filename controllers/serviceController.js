import Service from "../models/serviceModel.js";

import asyncHandler from "../middlewares/asyncHandler.js";

export const createService = asyncHandler(async (req, res) => {
  const newService = await Service.create(req.body);

  return res.status(201).json({
    message: "Add service successfully",
    data: newService,
  });
});

export const getAllService = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "limit", "name"];
  excludeFields.forEach((el) => delete queryObj[el]);

  let query;

  if (req.query.name) {
    query = Service.find({ name: { $regex: req.query.name, $options: "i" } });
  } else {
    query = Service.find(queryObj);
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limitData = parseInt(req.query.limit) || 10;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  const countService = await Service.countDocuments(queryObj);

  if (req.query.page && skipData >= countService) {
    res.status(404);
    throw new Error("This page does not exist");
  }

  const services = await query;
  const totalPage = Math.ceil(countService / limitData);

  return res.status(200).json({
    message: "Success",
    data: services,
    pagination: {
      totalPage,
      page,
      totalService: countService,
    },
  });
});

export const getService = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;

  const service = await Service.findById(paramsId);

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  return res.status(200).json({
    message: "Success",
    data: service,
  });
});

export const updateService = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const updateService = await Service.findByIdAndUpdate(paramsId, req.body, {
    runValidators: false,
    new: true,
  });

  return res.status(201).json({
    message: "Update service successfully",
    data: updateService,
  });
});

export const deleteService = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  await Service.findByIdAndDelete(paramsId);

  return res.status(200).json({
    message: "Delete service success",
  });
});

import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};

const createSendResToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const isDev = process.env.NODE_ENV === "development" ? false : true;

  const cookieOptions = {
    expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isDev ? false : true,
  };
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const register = asyncHandler(async (req, res) => {
  const isOwner = (await User.countDocuments({ role: "owner" })) === 0;
  const role = isOwner ? "owner" : "user";
  const createUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role,
  });
  createSendResToken(createUser, 201, res);
});

export const login = asyncHandler(async (req, res) => {
  // Validator
  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Please input email and password");
  }

  const userData = await User.findOne({
    email: req.body.email,
  });

  if (userData && (await userData.comparePassword(req.body.password))) {
    createSendResToken(userData, 200, res);
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (user) {
    res.status(200).json({
      data: {
        user,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
  });
  res.status(200).json({ status: "success" });
};

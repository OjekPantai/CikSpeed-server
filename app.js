import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import authRouter from "./routes/authRouter.js";
import serviceRouter from "./routes/serviceRouter.js";
import orderRouter from "./routes/orderRouter.js";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running 🚀 on port ${port}`);
});

mongoose.connect(process.env.DATABASE, {}).then(() => {
  console.log("Database connected 😎");
});

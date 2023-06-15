import cors from "cors";
import express from "express";
import path from "path";
import dbConnect from "../config/dbConnect.js";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import brandsRouter from "../routes/brandRoute.js";
import categoriesRouter from "../routes/categoryRoute.js";
import colorRouter from "../routes/colorRoute.js";
import orderRouter from "../routes/orderRoute.js";
import productsRouter from "../routes/productsRoute.js";
import reviewRouter from "../routes/reviewRoute.js";
import userRoutes from "../routes/usersRoute.js";
import genderRouter from "../routes/genderRoute.js";
import { stripeWebhook } from "../utils/stripe.js";
import * as dotenv from "dotenv";
import smRouter from "../routes/smRoute.js";
import pmRouter from "../routes/pmRoute.js";
import refundRouter from "../routes/refundRoute.js";
dotenv.config();

//db connect
dbConnect();
const app = express();

//cors
app.use(cors());
//stripe
app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
//pass incoming data
app.use(express.json());
//url encoded
app.use(express.urlencoded({ extended: true }));
//server static files
app.use(express.static("public"));

//*Home route
app.get("/", (req, res) => {
	res.sendFile(path.join("public", "index.html"));
});
//!routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productsRouter);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandsRouter);
app.use("/api/v1/colors/", colorRouter);
app.use("/api/v1/genders/", genderRouter);
app.use("/api/v1/reviews/", reviewRouter);
app.use("/api/v1/orders/", orderRouter);
app.use("/api/v1/refund/", refundRouter);
app.use("/api/v1/pm/", pmRouter);
app.use("/api/v1/sm/", smRouter);

//?err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;

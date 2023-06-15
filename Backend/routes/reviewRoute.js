import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createReviewCtrl } from "../controllers/reviewsCtrl.js";

const reviewRoute = express.Router();

reviewRoute.post("/:productID", isLoggedIn, createReviewCtrl);

export default reviewRoute;

import express from "express";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createRefundCtrl } from "../controllers/refundCtrl.js";

const refundRouter = express.Router();

refundRouter.post("/:id", isLoggedIn, createRefundCtrl);

export default refundRouter;

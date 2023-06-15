import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
	getAllColorCtrl,
	getSingleColorCtrl,
} from "../controllers/colorsCtrl.js";

const colorRouter = express.Router();

colorRouter.get("/", getAllColorCtrl);
colorRouter.get("/:id", getSingleColorCtrl);

export default colorRouter;

import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
	getAllBrandCtrl,
	getSingleBrandCtrl,
} from "../controllers/brandsCtrl.js";

const brandRouter = express.Router();

brandRouter.get("/", getAllBrandCtrl);
brandRouter.get("/:id", getSingleBrandCtrl);

export default brandRouter;

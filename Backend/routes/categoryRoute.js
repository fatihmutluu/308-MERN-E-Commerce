import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
	getAllCategoryCtrl,
	getSingleCategoryCtrl,
} from "../controllers/categoriesCtrl.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategoryCtrl);
categoryRouter.get("/:id", getSingleCategoryCtrl);

export default categoryRouter;

import express from "express";
import {
	getAllGenderCtrl,
	getSingleGenderCtrl,
} from "../controllers/genderCtrl.js";

const genderRouter = express.Router();

genderRouter.get("/", getAllGenderCtrl);
genderRouter.get("/:id", getSingleGenderCtrl);

export default genderRouter;

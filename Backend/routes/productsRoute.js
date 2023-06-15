import express from "express";
import {
	getProductCtrl,
	getProductsCtrl,
	addToWishlist,
	removeFromWishlist,
} from "../controllers/productsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const productsRouter = express.Router();

productsRouter.get("/", getProductsCtrl);
productsRouter.get("/:id", getProductCtrl);

productsRouter.post("/wishlist", isLoggedIn, addToWishlist);
productsRouter.delete("/wishlist", isLoggedIn, removeFromWishlist);

export default productsRouter;

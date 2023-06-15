import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isPM } from "../middlewares/isAdmin.js";
import { createProductCtrl, deleteProductCtrl, updateProductCtrl } from "../controllers/productsCtrl.js";
import { createGenderCtrl, deleteGenderCtrl, updateGenderCtrl } from "../controllers/genderCtrl.js";
import { createBrandCtrl, deleteBrandCtrl, updateBrandCtrl } from "../controllers/brandsCtrl.js";
import { createColorCtrl, updateColorCtrl, deleteColorCtrl } from "../controllers/colorsCtrl.js";
import { createCategoryCtrl, updateCategoryCtrl, deleteCategoryCtrl } from "../controllers/categoriesCtrl.js";
import {
	getAllordersCtrl,
	updateOrderCtrl,
	getOrdersLast30DaysCtrl,
	getOrdersByDateCtrl,
	getOrdersByStatusCtrl,
} from "../controllers/orderCtrl.js";
import { approveReviewsCtrl, cancelReviewsCtrl, getUnapprovedReviewsCtrl } from "../controllers/reviewsCtrl.js";
import { getUserNameById } from "../controllers/usersCtrl.js";

const pmRouter = express.Router();

pmRouter.get("/getUsernameById/:id", getUserNameById);

pmRouter.post("/createProduct", isLoggedIn, isPM, createProductCtrl);
pmRouter.put("/updateProduct/:id", isLoggedIn, isPM, updateProductCtrl);
pmRouter.delete("/deleteProduct/:id", isLoggedIn, isPM, deleteProductCtrl);

pmRouter.post("/createGender", isLoggedIn, isPM, createGenderCtrl);
pmRouter.put("/updateGender/:id", isLoggedIn, isPM, updateGenderCtrl);
pmRouter.delete("/deleteGender/:id", isLoggedIn, isPM, deleteGenderCtrl);

pmRouter.post("/createBrand", isLoggedIn, isPM, createBrandCtrl);
pmRouter.put("/updateBrand/:id", isLoggedIn, isPM, updateBrandCtrl);
pmRouter.delete("/deleteBrand/:id", isLoggedIn, isPM, deleteBrandCtrl);

pmRouter.post("/createColor", isLoggedIn, isPM, createColorCtrl);
pmRouter.put("/updateColor/:id", isLoggedIn, isPM, updateColorCtrl);
pmRouter.delete("/deleteColor/:id", isLoggedIn, isPM, deleteColorCtrl);

pmRouter.post("/createCategory", isLoggedIn, isPM, createCategoryCtrl);
pmRouter.put("/updateCategory/:id", isLoggedIn, isPM, updateCategoryCtrl);
pmRouter.delete("/deleteCategory/:id", isLoggedIn, isPM, deleteCategoryCtrl);

pmRouter.get("/orders", isLoggedIn, isPM, getAllordersCtrl);
pmRouter.put("/updateOrder/:id", isLoggedIn, isPM, updateOrderCtrl);
pmRouter.get("/getLast30Days", isLoggedIn, isPM, getOrdersLast30DaysCtrl);
pmRouter.get("/getOrdersByDate", isLoggedIn, isPM, getOrdersByDateCtrl);
pmRouter.get("/getOrdersByStatus", isLoggedIn, isPM, getOrdersByStatusCtrl);

pmRouter.get("/unapprovedReviews", isLoggedIn, isPM, getUnapprovedReviewsCtrl);
pmRouter.put("/approveReview/:id", isLoggedIn, isPM, approveReviewsCtrl);
pmRouter.put("/cancelReview/:id", isLoggedIn, isPM, cancelReviewsCtrl);

export default pmRouter;

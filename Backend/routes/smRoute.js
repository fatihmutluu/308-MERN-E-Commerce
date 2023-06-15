import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { isSM } from "../middlewares/isAdmin.js";
import { setDiscountCtrl, setSingleDiscountCtrl, updateProductCtrl } from "../controllers/productsCtrl.js";
import {
	getAllordersCtrl,
	getOrdersByDateCtrl,
	getOrdersLast30DaysCtrl,
	getRevenueAndProfitCtrl,
} from "../controllers/orderCtrl.js";
import { approveRefundCtrl, disapproveRefundCtrl, getAllRefundRequestsCtrl } from "../controllers/refundCtrl.js";

const smRouter = express.Router();

smRouter.post("/setDiscount", isLoggedIn, isSM, setDiscountCtrl);
smRouter.post("/setSingleDiscount/:id", isLoggedIn, isSM, setSingleDiscountCtrl);
smRouter.put("/updateProduct/:id", isLoggedIn, isSM, updateProductCtrl);

smRouter.get("/orders", isLoggedIn, isSM, getAllordersCtrl);
smRouter.get("/getOrdersByDate", isLoggedIn, isSM, getOrdersByDateCtrl);
smRouter.get("/getLast30Days", isLoggedIn, isSM, getOrdersLast30DaysCtrl);

smRouter.get("/stats", isLoggedIn, isSM, getRevenueAndProfitCtrl);
smRouter.put("/approveRefund/:id", isLoggedIn, isSM, approveRefundCtrl);
smRouter.put("/disapproveRefund/:id", isLoggedIn, isSM, disapproveRefundCtrl);
smRouter.get("/getRefundRequests/", isLoggedIn, isSM, getAllRefundRequestsCtrl);

export default smRouter;

import express from "express";
import {
	cancelOrderCtrl,
	createOrderCtrl,
	downloadInvoicePDFCtrl,
	getInvoicePDFCtrl,
	getSingleOrderCtrl,
} from "../controllers/orderCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, createOrderCtrl);
orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
orderRouter.delete("/:id/cancel", isLoggedIn, cancelOrderCtrl);

orderRouter.get("/invoicePDF/:order_id", isLoggedIn, getInvoicePDFCtrl);
orderRouter.get("/downloadPDF/:order_id", isLoggedIn, downloadInvoicePDFCtrl);

export default orderRouter;

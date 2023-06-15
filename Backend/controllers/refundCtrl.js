import asyncHandler from "express-async-handler";
import Order from "../model/Order.js";
import RefundRequest from "../model/RefundRequest.js";
import Product from "../model/Product.js";
import User from "../model/User.js";
import { sendMail } from "../utils/sendMail.js";

//@desc Refund Items
//@route POST /api/v1/refund/:order_id
//@access Private
export const createRefundCtrl = asyncHandler(async (req, res) => {
	try {
		const { itemIds, refundReasons } = req.body;
		const orderId = req.params.id;

		// Find the order
		const order = await Order.findById(orderId);
		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		// Check if the user is associated with the order
		if (order.user.toString() !== req.userAuthId.toString()) {
			return res.status(403).json({ message: "User is not authorized to create a refund request for this order" });
		}

		// Check if the order was created in the last 30 days
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		if (order.createdAt < thirtyDaysAgo) {
			return res.status(400).json({
				message: "Order is not eligible for a refund as it was created more than 30 days ago",
			});
		}

		// Check if a refund request has already been made for this order
		const existingRefundRequest = await RefundRequest.findOne({ order: orderId });
		if (existingRefundRequest) {
			return res.status(400).json({ message: "Refund request already made" });
		}

		// Check if the order status is "delivered"
		if (order.status !== "delivered") {
			return res.status(400).json({
				message: "Order is not eligible for a refund as it is not delivered yet",
			});
		}

		// Retrieve the order items
		const orderItems = order.orderItems;

		// Find the selected items for the refund based on the provided itemIds
		const refundItems = orderItems.filter((item) => itemIds.includes(item._id.toString()));

		// Calculate the refund amount by summing the totalPrice of refund items
		const refundAmount = refundItems.reduce((total, item) => total + item.totalPrice, 0);

		// Create a new refund request
		const refundRequest = await RefundRequest.create({
			user: req.userAuthId,
			order: orderId,
			items: refundItems,
			orderNumber: order.orderNumber,
			refundReasons,
			refundAmount,
		});

		// Send a success response
		res.json({ message: "Refund request created successfully", refundRequest });
	} catch (error) {
		// Handle any errors
		console.error(error);
		res.status(500).json({ message: "Please Provide a Reason" });
	}
});

//@desc Approve Refund Request
//@route PUT /api/v1/pm/approveRefund/:refund_id
//@access Private/Admin
export const approveRefundCtrl = asyncHandler(async (req, res) => {
	try {
		// Find the refund request
		const refundRequest = await RefundRequest.findById(req.params.id);

		// Check if the refund request exists
		if (!refundRequest) {
			return res.status(404).json({ message: "Refund request not found" });
		}

		// Update the refund request status to "approved"
		refundRequest.approved = "approved";
		await refundRequest.save();

		// Find the order associated with the refund request
		const order = await Order.findById(refundRequest.order);
		const user = await User.findById(refundRequest.user);

		// Check if the order exists
		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		// Remove the refund items from the order
		const refundItems = refundRequest.items.map((refundItem) => refundItem._id.toString());
		order.orderItems = order.orderItems.filter((orderItem) => !refundItems.includes(orderItem._id.toString()));

		// Subtract the refund amount from the order's total price
		order.totalPrice -= refundRequest.refundAmount;

		// Delete the order if orderItems is empty
		if (order.orderItems.length === 0) {
			await Order.deleteOne({ _id: order._id });
		} else {
			await order.save();
		}

		// Update the totalSold field of the corresponding products
		for (const refundItem of refundRequest.items) {
			const product = await Product.findById(refundItem._id);

			if (product) {
				// Decrease the totalSold by the refund item's quantity
				product.totalSold -= refundItem.qty;
				await product.save();
			}
		}
		const mailOptions = {
			from: process.env.EMAIL,
			to: user.email,
			subject: "Your refund request has been approved.",
			text:
				"Your refund request has been successfully approved and the relevant amount (" +
				refundRequest.refundAmount +
				"$) has been returned to you.",
		};
		sendMail(mailOptions);

		res.json({
			message: "Refund request approved successfully",
			refundRequest,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

//@desc Disapprove Refund Request
//@route PUT /api/v1/pm/disapproveRefund/:refund_id
//@access Private/Admin
export const disapproveRefundCtrl = asyncHandler(async (req, res) => {
	try {
		// Find the refund request
		const refundRequest = await RefundRequest.findById(req.params.id);

		// Check if the refund request exists
		if (!refundRequest) {
			return res.status(404).json({ message: "Refund request not found" });
		}

		// Update the refund request status to "disapproved"
		refundRequest.approved = "disapproved";
		await refundRequest.save();

		const user = await User.findById(refundRequest.user);

		const mailOptions = {
			from: process.env.EMAIL,
			to: user.email,
			subject: "Your refund request has been disapproved.",
			text: "Your return request has been evaluated and rejected by us. Please contact us via e-mail if you think there is a wrong decision.",
		};
		sendMail(mailOptions);

		res.json({
			message: "Refund request disapproved successfully",
			refundRequest,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

//@desc Get All "not evaluated" Refund Requests
//@route GET /api/v1/pm/getRefundRequests/
//@access Private/Admin
export const getAllRefundRequestsCtrl = asyncHandler(async (req, res) => {
	try {
		const refundRequests = await RefundRequest.find({
			approved: "not evaluated",
		});
		res.json({ refundRequests });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

import asyncHandler from "express-async-handler";
import Order from "../model/Order.js";
import Product from "../model/Product.js";
import User from "../model/User.js";
import { takePayment } from "../utils/stripe.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { invoiceTemplate } from "../utils/invoice.js";
import { sendMail } from "../utils/sendMail.js";

//@desc create orders
//@route POST /api/v1/orders
//@access private
export const createOrderCtrl = asyncHandler(async (req, res) => {
	//Get the payload(customer, orderItems, shipppingAddress, totalPrice);
	const { orderItems, shippingAddress, totalPrice } = req.body;
	//Find the user
	const user = await User.findById(req.userAuthId);
	//Check if user has shipping address
	if (!user?.hasShippingAddress) {
		throw new Error("Please provide shipping address");
	}
	//Check if order is not empty
	if (orderItems?.length <= 0) {
		throw new Error("No Order Items");
	}
	//Place/create order - save into DB
	const order = await Order.create({
		user: user?._id,
		orderItems,
		shippingAddress,
		totalPrice,
	});

	//Update the product qty
	const products = await Product.find({ _id: { $in: orderItems } });

	orderItems?.map(async (order) => {
		const product = products?.find((product) => {
			return product?._id?.toString() === order?._id?.toString();
		});
		if (product) {
			product.totalSold += order.qty;
		}
		await product.save();
	});
	//push order into user
	user.orders.push(order?._id);
	await user.save();

	const sessionUrl = await takePayment(orderItems, order);

	invoiceTemplate(order, user);

	const mailOptions = {
		from: process.env.EMAIL,
		to: user.email,
		subject: "Your Order Details",
		text: "Please find attached your order details.",
		attachments: [
			{
				filename: "./pdfs/" + order._id + ".pdf",
				path: "./pdfs/" + order._id + ".pdf",
			},
		],
	};

	sendMail(mailOptions);

	res.send({ url: sessionUrl });
});

//@desc get all orders
//@route GET /api/v1/orders
//@access private
export const getAllordersCtrl = asyncHandler(async (req, res) => {
	//find all orders
	const orders = await Order.find().populate("user");
	res.json({
		success: true,
		message: "All orders",
		orders,
	});
});

//@desc get single order
//@route GET /api/v1/orders/:id
//@access private/admin
export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
	//get the id from params
	const id = req.params.id;
	const order = await Order.findById(id);
	const user = await User.findById(req.userAuthId);

	// Check if the requester is a PM or SM or if it is their own order
	if (user.isPM || user.isSM || user._id.toString() === order.user.toString()) {
		// Send response
		res.status(200).json({
			success: true,
			message: "Single order",
			order,
		});
	} else {
		// Requester does not have permission to access the order
		res.status(403).json({
			success: false,
			message: "Unauthorized access",
		});
	}
});

//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin
export const updateOrderCtrl = asyncHandler(async (req, res) => {
	//get the id from params
	const id = req.params.id;
	//update
	const updatedOrder = await Order.findByIdAndUpdate(
		id,
		{
			status: req.body.status,
		},
		{
			new: true,
		}
	);
	res.status(200).json({
		success: true,
		message: "Order updated",
		updatedOrder,
	});
});

//@desc get sales sum of orders
//@route GET /api/v1/pm/stats?startDate=xxxx-xx-xx&endDate=xxxx-xx-xx
//@access private/admin
export const getRevenueAndProfitCtrl = asyncHandler(async (req, res) => {
	const { startDate, endDate } = req.query;
	// Parse the start and end dates
	const start = new Date(startDate);
	const end = new Date(endDate);
	end.setDate(end.getDate() + 1);

	// Find orders within the specified date range
	const orders = await Order.find({ createdAt: { $gte: start, $lte: end } });

	// Create an object to hold the daily revenue, cost, and profit
	const dailyData = {};

	// Initialize the daily data with 0 values for each day
	const currentDate = new Date(start);
	while (currentDate <= end) {
		const formattedDate = currentDate.toISOString().split("T")[0];
		dailyData[formattedDate] = {
			revenue: 0,
			cost: 0,
			profit: 0,
		};
		currentDate.setDate(currentDate.getDate() + 1);
	}

	// Calculate revenue and cost
	let totalRevenue = 0;
	let totalCost = 0;

	// Calculate revenue, cost, and profit for each order and update the daily data
	for (const order of orders) {
		const orderDate = order.createdAt.toISOString().split("T")[0];
		dailyData[orderDate].revenue += order.totalPrice;
		totalRevenue += order.totalPrice;
		for (const orderItem of order.orderItems) {
			const product = await Product.findById(orderItem._id);
			if (product) {
				dailyData[orderDate].cost += product.cost;
				totalCost += product.cost;
			}
		}

		dailyData[orderDate].profit = dailyData[orderDate].revenue - dailyData[orderDate].cost;
	}

	// Prepare chart data
	const chartData = {
		labels: Object.keys(dailyData),
		datasets: [
			{
				label: "Revenue",
				data: Object.values(dailyData).map((data) => data.revenue),
				borderColor: "#36A2EB",
				backgroundColor: "transparent",
			},
			{
				label: "Cost",
				data: Object.values(dailyData).map((data) => data.cost),
				borderColor: "#FF6384",
				backgroundColor: "transparent",
			},
			{
				label: "Profit",
				data: Object.values(dailyData).map((data) => data.profit),
				borderColor: "#4BC0C0",
				backgroundColor: "transparent",
			},
		],
	};
	const totalProfit = parseFloat((totalRevenue - totalCost).toFixed(2));
	res.status(200).json({ success: true, totalRevenue, totalCost, totalProfit, chartData });
});

// @desc Get Order's Invoice as pdf
// @route GET /api/v1/orders/invoicePDF/:order_id
// @access Private
export const getInvoicePDFCtrl = asyncHandler(async (req, res) => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const pdfDirectory = path.join(__dirname, "..", "pdfs");

	const orderId = req.params.order_id;
	const pdfPath = path.join(pdfDirectory, `${orderId}.pdf`);

	// Check if the user isSM or isPM or the order belongs to the user
	const user = await User.findById(req.userAuthId);
	if (user.isSM || user.isPM || user.orders.includes(orderId)) {
		// Check if the PDF file exists
		if (fs.existsSync(pdfPath)) {
			// Set the appropriate headers to indicate a PDF file
			res.setHeader("Content-Type", "application/pdf");
			res.setHeader("Content-Disposition", `inline; filename="${orderId}.pdf"`);

			// Read the file and stream it to the response
			const fileStream = fs.createReadStream(pdfPath);
			fileStream.pipe(res);
		} else {
			// If the PDF file does not exist, send an error response
			res.status(404).send("PDF file not found");
		}
	} else {
		// If the user is not authorized, send an error response
		res.status(403).send("User is not authorized to access the PDF");
	}
});

// @desc Download Order's Invoice as pdf
// @route GET /api/v1/orders/invoicePDF/:order_id
// @access Private
export const downloadInvoicePDFCtrl = asyncHandler(async (req, res) => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const pdfDirectory = path.join(__dirname, "..", "pdfs");

	const orderId = req.params.order_id;
	const pdfPath = path.join(pdfDirectory, `${orderId}.pdf`);

	// Check if the user isSM or isPM or the order belongs to the user
	const user = await User.findById(req.userAuthId);
	if (user.isSM || user.isPM || user.orders.includes(orderId)) {
		// Check if the PDF file exists
		if (fs.existsSync(pdfPath)) {
			// Set the appropriate headers and initiate file download
			res.download(pdfPath, `${orderId}.pdf`, (err) => {
				if (err) {
					// If an error occurs during download, send an error response
					res.status(500).send("Error downloading PDF");
				}
			});
		} else {
			// If the PDF file does not exist, send an error response
			res.status(404).send("PDF file not found");
		}
	} else {
		// If the user is not authorized, send an error response
		res.status(403).send("User is not authorized to download the PDF");
	}
});

// @desc Get Order's in Last 30 Days
// @route GET /api/v1/pm/getLast30Days
// @access Private/Admin
export const getOrdersLast30DaysCtrl = asyncHandler(async (req, res) => {
	// Calculate the date 30 days ago from the current date
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	// Find orders created within the last 30 days
	const orders = await Order.find({ createdAt: { $gte: thirtyDaysAgo } });

	res.status(200).json({ success: true, orders });
});

// @desc Get Order's in Given Date Range
// @route GET /api/v1/pm/getOrdersByDate?startDate=xxxx-xx-xx&endDate=xxxx-xx-xx
// @access Private/Admin
export const getOrdersByDateCtrl = asyncHandler(async (req, res) => {
	const { startDate, endDate } = req.query;
	// Parse the start and end dates
	const start = new Date(startDate);
	const end = new Date(endDate);
	end.setDate(end.getDate() + 1);

	// Find invoices within the specified date range
	const orders = await Order.find({ createdAt: { $gte: start, $lte: end } });

	res.status(200).json({ success: true, orders });
});

// @desc Get Order's With Status
// @route GET /api/v1/pm/getOrdersByStatus?status="xxxxxxxx"
// @access Private/Admin
export const getOrdersByStatusCtrl = asyncHandler(async (req, res) => {
	const status = req.query.status;

	const orders = await Order.find({ status: status });
	res.status(200).json({ success: true, orders });
});

// @desc Cancel the Order
// @route GET /api/v1/orders/:id/cancel
// @access Public
export const cancelOrderCtrl = asyncHandler(async (req, res) => {
	try {
		const orderId = req.params.id;
		const userId = req.userAuthId;

		// Find the order
		const order = await Order.findById(orderId);

		// Check if the order exists
		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		// Check if the user is authorized to cancel the order
		if (order.user.toString() !== userId) {
			return res.status(403).json({ message: "User is not authorized to cancel this order" });
		}

		// Check if the order status is "processing"
		if (order.status !== "processing") {
			return res.status(400).json({
				message: `Order cannot be canceled since it's ${order.status}. Please try to refund.`,
			});
		}

		// Retrieve orderItems
		const orderItems = order.orderItems;

		// Update product totalSold and save
		for (const orderItem of orderItems) {
			const product = await Product.findById(orderItem._id);
			if (product) {
				product.totalSold -= orderItem.qty;
				await product.save();
			}
		}

		// Remove the order from user's schedule
		const user = await User.findById(order.user);
		if (user) {
			user.orders.pull(orderId);
			await user.save();
		}

		// Delete the order
		await Order.findByIdAndDelete(orderId);

		// Send a success response
		res.json({ message: "Order canceled successfully" });
	} catch (error) {
		// Handle any errors
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

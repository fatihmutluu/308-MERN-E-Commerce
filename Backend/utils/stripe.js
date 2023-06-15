import Stripe from "stripe";
import asyncHandler from "express-async-handler";
import Order from "../model/Order.js";
import * as dotenv from "dotenv";
dotenv.config();
//Stripe webhook
//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_SECRET;

export const stripeWebhook = asyncHandler(async (request, response) => {
	const sig = request.headers["stripe-signature"];

	let event;

	try {
		event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
		console.log("event");
	} catch (err) {
		console.log("err", err.message);
		response.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}
	if (event.type === "checkout.session.completed") {
		//update the order
		const session = event.data.object;
		const { orderId } = session.metadata;
		const paymentStatus = session.payment_status;
		const paymentMethod = session.payment_method_types[0];
		const totalAmount = session.amount_total;
		const currency = session.currency;
		//find the order
		const order = await Order.findByIdAndUpdate(
			JSON.parse(orderId),
			{
				totalPrice: totalAmount / 100,
				currency,
				paymentMethod,
				paymentStatus,
			},
			{
				new: true,
			}
		);
		console.log(order);
	} else {
		return;
	}

	response.send();
});

export const takePayment = asyncHandler(async (orderItems, order) => {
	const convertedOrders = orderItems.map((item) => {
		return {
			price_data: {
				currency: "usd",
				product_data: {
					name: item?.name,
					description: item?.description,
				},
				unit_amount: item?.price * 100,
			},
			quantity: item?.qty,
		};
	});
	const session = await stripe.checkout.sessions.create({
		line_items: convertedOrders,
		metadata: {
			orderId: JSON.stringify(order?._id),
		},
		mode: "payment",
		// EDIT || ARKADASLAR BUNLARI FRONT END LINKINE GORE DUZENLEYIN
		success_url: "http://localhost:3000/customer-order",
		cancel_url: "http://localhost:3000/success",
	});

	return session.url;
});

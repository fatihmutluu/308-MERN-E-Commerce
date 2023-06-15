import mongoose from "mongoose";
const Schema = mongoose.Schema;

//Generate random numbers for order
function generateOrderNumber() {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let orderNumber = "";
	for (let i = 0; i < 8; i++) {
		orderNumber += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}
	return orderNumber;
}

const OrderSchema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		orderItems: [
			{
				type: Object,
				required: true,
			},
		],
		shippingAddress: {
			type: Object,
			required: true,
		},
		orderNumber: {
			type: String,
			default: generateOrderNumber,
		},
		//for stripe payment
		paymentStatus: {
			type: String,
			default: "Paid",
		},
		paymentMethod: {
			type: String,
			default: "Card",
		},
		totalPrice: {
			type: Number,
			default: 0.0,
		},
		currency: {
			type: String,
			default: "usd",
		},
		//For admin
		status: {
			type: String,
			default: "processing",
			enum: ["processing", "in-transit", "delivered"],
		},
		deliveredAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

//compile to form model
const Order = mongoose.model("Order", OrderSchema);

export default Order;

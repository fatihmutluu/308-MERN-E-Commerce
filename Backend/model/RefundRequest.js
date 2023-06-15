import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RefundSchema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		order: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
			required: true,
		},
		items: [
			{
				type: Object,
				required: true,
			},
		],
		orderNumber: {
			type: String,
			required: true,
		},
		approved: {
			type: String,
			default: "not evaluated",
			enum: ["not evaluated", "approved", "disapproved"],
		},
		refundReasons: {
			type: String,
			required: true,
		},
		refundAmount: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const RefundRequest = mongoose.model("RefundRequest", RefundSchema);

export default RefundRequest;

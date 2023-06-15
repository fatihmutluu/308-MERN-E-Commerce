import mongoose from "mongoose";
const Schema = mongoose.Schema;

function TaxID() {
	const characters = "0123456789";
	let orderNumber = "";
	for (let i = 0; i < 11; i++) {
		orderNumber += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return orderNumber;
}

const UserSchema = new Schema(
	{
		fullname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		orders: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Order",
			},
		],
		isSM: {
			type: Boolean,
			default: false,
		},
		TaxID: {
			type: String,
			default: TaxID,
		},
		isPM: {
			type: Boolean,
			default: false,
		},
		hasShippingAddress: {
			type: Boolean,
			default: false,
		},
		shippingAddress: {
			firstName: {
				type: String,
			},
			lastName: {
				type: String,
			},
			address: {
				type: String,
			},
			city: {
				type: String,
			},
			postalCode: {
				type: String,
			},
			province: {
				type: String,
			},
			country: {
				type: String,
			},
			phone: {
				type: String,
			},
		},
		wishlist: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		],
	},
	{
		timestamps: true,
	}
);

// schema to model
const User = mongoose.model("User", UserSchema);

export default User;

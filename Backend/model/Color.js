import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ColorSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	products: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
		},
	],
});

const Color = mongoose.model("Color", ColorSchema);

export default Color;

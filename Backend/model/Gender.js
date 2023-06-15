import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GenderSchema = new Schema({
	name: {
		type: String,
		enum: ["men", "women", "unisex"],
		required: true,
	},
	products: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
		},
	],
});

const Gender = mongoose.model("Gender", GenderSchema);

export default Gender;

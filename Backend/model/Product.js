//product schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			ref: "Category",
			required: true,
		},
		gender: {
			type: String,
			required: true,
		},
		sizes: {
			type: [Number],
			required: true,
			min: 35,
			max: 47,
		},
		color: {
			type: String,
			required: true,
		},

		releaseYear: {
			type: Number,
			required: false,
		},

		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},

		images: {
			type: String,
			required: true,
		},

		reviews: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Review",
			},
		],
		discountRate: {
			type: Number,
			required: false,
			default: 0,
			min: 0,
			max: 100,
		},
		price: {
			type: Number,
			required: true,
		},
		cost: {
			type: Number,
			required: true,
		},

		hasDiscount: {
			type: Boolean,
			required: false,
			default: false,
		},
		totalQty: {
			type: Number,
			required: true,
		},
		totalSold: {
			type: Number,
			required: false,
			default: 0,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
	}
);
//Virtuals
//qty left
ProductSchema.virtual("qtyLeft").get(function () {
	const product = this;
	return product.totalQty - product.totalSold;
});
//Total rating
ProductSchema.virtual("totalReviews").get(function () {
	const product = this;
	return product?.reviews?.length;
});
//average Rating
ProductSchema.virtual("averageRating").get(function () {
	let ratingsTotal = 0;
	const product = this;
	product?.reviews?.forEach((review) => {
		ratingsTotal += review?.rating;
	});
	//calc average rating
	const averageRating = Number(ratingsTotal / product?.reviews?.length).toFixed(
		1
	);
	return averageRating;
});
const Product = mongoose.model("Product", ProductSchema);

export default Product;

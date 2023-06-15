import Order from "../model/Order.js";
import Product from "../model/Product.js";
import Review from "../model/Review.js";
import asyncHandler from "express-async-handler";
import User from "../model/User.js";

// @desc   Create new review
// @route  POST /api/v1/reviews
// @access Public
export const createReviewCtrl = asyncHandler(async (req, res) => {
	const { product, message, rating } = req.body;
	//find product
	const { productID } = req.params;
	const productFound = await Product.findById(productID).populate("reviews");
	if (!productFound) {
		throw new Error("product not found");
	}

	// Check if the user has purchased the product
	const user = await User.findById(req.userAuthId).populate("orders");
	if (!user) {
		throw new Error("User not found");
	}

	const hasPurchased = user.orders.some((order) => {
		return order.orderItems.some((orderItem) => {
			return orderItem._id.toString() === productFound._id.toString();
		});
	});
	if (!hasPurchased) {
		throw new Error("Product not purchased");
	}

	//check if user reviewed earlier
	const hasReviewed = productFound?.reviews?.find((review) => {
		return review?.user?.toString() === req?.userAuthId?.toString();
	});
	if (hasReviewed) {
		throw new Error("already reviewed");
	}

	//create review
	const review = await Review.create({
		message,
		rating,
		product: productFound?._id,
		user: req.userAuthId,
	});

	productFound.reviews.push(review?._id);
	await productFound.save();
	res.status(201).json({
		success: true,
		message: "Review created successfully",
	});
});

// @desc   Get All Unapproved reviews
// @route  GET /api/v1/pm/unapprovedReviews/
// @access Private/Pm
export const getUnapprovedReviewsCtrl = asyncHandler(async (req, res) => {
	try {
		const unapprovedReviews = await Review.find({ reviewApproved: false });

		// return unapproved reviews
		res.send(unapprovedReviews);
	} catch (err) {
		// handle error
		console.error(err);
		throw new Error("Failed to retrieve unapproved reviews");
	}
});

// @desc   Approved review by id
// @route  PUT /api/v1/pm/approveReview/:id
// @access Private/Pm
export const approveReviewsCtrl = asyncHandler(async (req, res) => {
	const id = req.params.id;
	Review.findById(id)
		.then((review) => {
			review.reviewApproved = true;
			review.save();
			res.status(200).json({
				success: true,
				message: "Review approved successfully",
			});
		})
		.catch((err) => {
			// handle error
			console.error(err);
			res.status(500).send("Internal Server Error");
		});
});

// @desc   Disapproved review by id
// @route  PUT /api/v1/pm/cancelReview/:id
// @access Private/Pm
export const cancelReviewsCtrl = asyncHandler(async (req, res) => {
	const id = req.params.id;
	Review.findById(id)
		.then((review) => {
			review.reviewApproved = true;
			review.message = " ";
			review.save();
			res.status(200).json({
				success: true,
				message: "Review canceled successfully",
			});
		})
		.catch((err) => {
			// handle error
			console.error(err);
			res.status(500).send("Internal Server Error");
		});
});

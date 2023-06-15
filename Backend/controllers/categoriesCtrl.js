import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";

// @desc   Create Category
// @route  POST /api/v1/categories
// @access Private/Admin
export const createCategoryCtrl = asyncHandler(async (req, res) => {
	const { name, image } = req.body;
	const categoryFound = await Category.findOne({ name });

	if (categoryFound) {
		throw new Error("Category already exist");
	}
	const category = await Category.create({
		name: name.toLowerCase(),
		image: image,
		user: req.userAuthId,
	});
	res.json({
		status: "success",
		message: "category create success",
		category,
	});
});

// @desc   Get All Categories
// @route  GET /api/v1/categories
// @access Public
export const getAllCategoryCtrl = asyncHandler(async (req, res) => {
	const categories = await Category.find();

	res.json({
		status: "success",
		message: "categories fetched success",
		categories,
	});
});

// @desc   Get single Categories
// @route  GET /api/v1/categories/:id
// @access Public
export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
	const category = await Category.findById(req.params.id);

	res.json({
		status: "success",
		message: "category fetched by id success",
		category,
	});
});

// @desc   Update category
// @route  PUT /api/v1/products/:id
// @access Private/Admin
export const updateCategoryCtrl = asyncHandler(async (req, res) => {
	const { name } = req.body;

	const category = await Category.findByIdAndUpdate(
		req.params.id,
		{ name },
		{ new: true }
	);

	res.json({
		status: "success",
		message: "category updated successfully",
		category,
	});
});

// @desc   Delete products
// @route  DELETE /api/v1/products/:id/delete
// @access Private/Admin
export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
	const id__ = req.params.id;
	const category = await Category.findByIdAndDelete(id__);

	res.json({
		status: "success",
		message: "category deleted success",
	});
});

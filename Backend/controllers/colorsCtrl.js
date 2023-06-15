import asyncHandler from "express-async-handler";
import Color from "../model/Color.js";

// @desc   Create Color
// @route  POST /api/v1/colors
// @access Private/Admin
export const createColorCtrl = asyncHandler(async (req, res) => {
	const { name } = req.body;
	const colorFound = await Color.findOne({ name });

	if (colorFound) {
		throw new Error("Color already exist");
	}
	const color = await Color.create({
		name: name.toLowerCase(),
		user: req.userAuthId,
	});
	res.json({
		status: "success",
		message: "color create success",
		color,
	});
});

// @desc   get All Colors
// @route  GET /api/v1/colors
// @access Public
export const getAllColorCtrl = asyncHandler(async (req, res) => {
	const colors = await Color.find();

	res.json({
		status: "success",
		message: "colors fetched success",
		colors,
	});
});

// @desc   get sibgle Colors
// @route  GET /api/v1/colors/:id
// @access Public
export const getSingleColorCtrl = asyncHandler(async (req, res) => {
	const color = await Color.findById(req.params.id);

	res.json({
		status: "success",
		message: "color fetched by id success",
		color,
	});
});

// @desc   Update color
// @route  PUT /api/v1/products/:id
// @access Private/Admin
export const updateColorCtrl = asyncHandler(async (req, res) => {
	const { name } = req.body;

	const color = await Color.findByIdAndUpdate(
		req.params.id,
		{ name },
		{ new: true }
	);

	res.json({
		status: "success",
		message: "color updated successfully",
		color,
	});
});
// @desc   Delete products
// @route  DELETE /api/v1/products/:id/delete
// @access Private/Admin
export const deleteColorCtrl = asyncHandler(async (req, res) => {
	const id__ = req.params.id;
	const color = await Color.findByIdAndDelete(id__);

	res.json({
		status: "success",
		message: "color deleted success",
	});
});

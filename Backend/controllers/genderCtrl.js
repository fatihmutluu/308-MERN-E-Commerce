import asyncHandler from "express-async-handler";
import Gender from "../model/Gender.js";

// @desc   Create Gender
// @route  POST /api/v1/genders
// @access Private/Admin
export const createGenderCtrl = asyncHandler(async (req, res) => {
	const { name } = req.body;
	const genderFound = await Gender.findOne({ name });

	if (genderFound) {
		throw new Error("Gender already exist");
	}
	const gender = await Gender.create({
		name: name.toLowerCase(),
		user: req.userAuthId,
	});
	res.json({
		status: "success",
		message: "gender create success",
		gender,
	});
});

// @desc   get All Genders
// @route  GET /api/v1/genders
// @access Public
export const getAllGenderCtrl = asyncHandler(async (req, res) => {
	const genders = await Gender.find();

	res.json({
		status: "success",
		message: "genders fetched success",
		genders,
	});
});

// @desc   get sibgle Genders
// @route  GET /api/v1/genders/:id
// @access Public
export const getSingleGenderCtrl = asyncHandler(async (req, res) => {
	const gender = await Gender.findById(req.params.id);

	res.json({
		status: "success",
		message: "gender fetched by id success",
		gender,
	});
});

// @desc   Update gender
// @route  PUT /api/v1/products/:id
// @access Private/Admin
export const updateGenderCtrl = asyncHandler(async (req, res) => {
	const { name } = req.body;

	const gender = await Gender.findByIdAndUpdate(
		req.params.id,
		{ name },
		{ new: true }
	);

	res.json({
		status: "success",
		message: "gender updated successfully",
		gender,
	});
});

// @desc   Delete products
// @route  DELETE /api/v1/products/:id/delete
// @access Private/Admin
export const deleteGenderCtrl = asyncHandler(async (req, res) => {
	const id__ = req.params.id;
	const gender = await Gender.findByIdAndDelete(id__);

	res.json({
		status: "success",
		message: "gender deleted success",
	});
});

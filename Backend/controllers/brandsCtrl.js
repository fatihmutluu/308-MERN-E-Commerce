import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";

// @desc   Create Brand
// @route  POST /api/v1/brands
// @access Private/Admin
export const createBrandCtrl = asyncHandler(async (req, res) => {
	const { name } = req.body;
	const brandFound = await Brand.findOne({ name });

	if (brandFound) {
		throw new Error("Brand already exist");
	}
	const brand = await Brand.create({
		name: name.toLowerCase(),
		user: req.userAuthId,
	});
	res.json({
		status: "success",
		message: "brand create success",
		brand,
	});
});

// @desc   get All Brands
// @route  GET /api/v1/brands
// @access Public
export const getAllBrandCtrl = asyncHandler(async (req, res) => {
	const brands = await Brand.find();

	res.json({
		status: "success",
		message: "brands fetched success",
		brands,
	});
});

// @desc   get sibgle Brands
// @route  GET /api/v1/brands/:id
// @access Public
export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
	const brand = await Brand.findById(req.params.id);

	res.json({
		status: "success",
		message: "brand fetched by id success",
		brand,
	});
});

// @desc   Update brand
// @route  PUT /api/v1/products/:id
// @access Private/Admin
export const updateBrandCtrl = asyncHandler(async (req, res) => {
	const { name } = req.body;

	const brand = await Brand.findByIdAndUpdate(req.params.id, { name }, { new: true });

	res.json({
		status: "success",
		message: "brand updated successfully",
		brand,
	});
});

// @desc   Delete products
// @route  DELETE /api/v1/products/:id/delete
// @access Private/Admin
export const deleteBrandCtrl = asyncHandler(async (req, res) => {
	const id__ = req.params.id;
	const brand = await Brand.findByIdAndDelete(id__);

	res.json({
		status: "success",
		message: "brand deleted success",
	});
});

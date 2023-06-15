import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";
import Color from "../model/Color.js";
import Gender from "../model/Gender.js";
import User from "../model/User.js";
import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { htmlTemplate } from "../utils/discountMailTemplate.js";
import { sendMail } from "../utils/sendMail.js";

// @desc   Create new product
// @route  POST /api/v1/products
// @access Private/Admin
export const createProductCtrl = asyncHandler(async (req, res) => {
	const { name, description, category, sizes, color, cost, totalQty, brand, gender, images } = req.body;

	//does product exist?
	const productExists = await Product.findOne({ name });
	if (productExists) {
		throw new Error("Product Already Exists");
	}

	//find category
	const categoryFound = await Category.findOne({
		name: category,
	});

	if (!categoryFound) {
		throw new Error("Category not found, please create category first or check category name");
	}

	//find brand
	const brandFound = await Brand.findOne({
		name: brand?.toLowerCase(),
	});

	if (!brandFound) {
		throw new Error("Brand not found, please create brand first or check brand name");
	}

	const colorFound = await Color.findOne({
		name: color?.toLowerCase(),
	});

	if (!colorFound) {
		throw new Error("Color not found, please create color first or check color name");
	}

	const genderFound = await Gender.findOne({
		name: gender?.toLowerCase(),
	});

	if (!genderFound) {
		throw new Error("Gende not found, please create gender first or check gender name");
	}

	//create new product
	const product = await Product.create({
		name,
		description,
		category,
		sizes,
		color,
		price: cost * 1.25,
		user: req.userAuthId,
		cost,
		totalQty,
		brand,
		gender,
		images,
	});

	//push product to category
	categoryFound.products.push(product._id);
	await categoryFound.save();

	//push product to brand
	brandFound.products.push(product._id);
	await brandFound.save();

	colorFound.products.push(product._id);
	await colorFound.save();

	genderFound.products.push(product._id);
	await genderFound.save();

	//response
	res.status(201).json({
		status: "success",
		message: "Product created successfully",
		product,
	});
});

// @desc   Get all products
// @route  GET /api/v1/products
// @access Public
export const getProductsCtrl = asyncHandler(async (req, res) => {
	//query
	let productQuery = Product.find();

	//search by name
	if (req.query.name) {
		productQuery = productQuery.find({
			name: { $regex: req.query.name, $options: "i" },
		});
	}

	//search by description
	if (req.query.description) {
		productQuery = productQuery.find({
			description: { $regex: req.query.description, $options: "i" },
		});
	}

	// search by both description and name
	if (req.query.search) {
		const regex = new RegExp(req.query.search, "i");
		productQuery = productQuery.find({
			$or: [{ description: regex }, { name: regex }],
		});
	}

	//search by brand
	if (req.query.brand) {
		productQuery = productQuery.find({
			brand: { $regex: req.query.brand, $options: "i" },
		});
	}

	//search by category
	if (req.query.category) {
		productQuery = productQuery.find({
			category: { $regex: req.query.category, $options: "i" },
		});
	}
	//search by color
	if (req.query.color) {
		productQuery = productQuery.find({
			color: { $regex: req.query.color, $options: "i" },
		});
	}
	//search by size
	if (req.query.size) {
		productQuery = productQuery.find({ sizes: req.query.size });
	}
	//search by gender
	if (req.query.gender) {
		productQuery = productQuery.find({
			gender: { $regex: "\\b" + req.query.gender + "\\b", $options: "i" },
		});
	}
	//search by price range
	if (req.query.price) {
		const priceRange = req.query.price.split("-");
		const lowBound = priceRange[0];
		const upBound = priceRange[1];
		productQuery = productQuery.find({
			price: { $gte: lowBound, $lte: upBound },
		});
	}
	if (req.query.sort) {
		const sortBy = req.query.sort;
		if (sortBy === "priceasc") {
			productQuery = productQuery.find().sort({ price: 1 });
		} else if (sortBy === "pricedes") {
			productQuery = productQuery.find().sort({ price: -1 });
		} else if (sortBy === "popularity") {
			productQuery = productQuery.find().sort({ totalSold: -1 });
		}
	}

	//pagination
	const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
	const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 1;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Product.countDocuments();

	productQuery = productQuery.skip(startIndex).limit(limit);

	const pagination = {};
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	const products = await productQuery.populate("reviews");
	res.json({
		status: "success",
		total,
		results: products.length,
		pagination,
		message: "products fetched succesfully",
		products,
	});
});

// @desc   Get single products
// @route  GET /api/v1/products/:id
// @access Public
export const getProductCtrl = asyncHandler(async (req, res) => {
	const id__ = req.params.id;
	const product = await Product.findById(id__).populate("reviews");
	if (!product) {
		throw new Error("product not found");
	}
	res.json({
		status: "success",
		message: "single product fetched success",
		product,
	});
});

// @desc   Update products
// @route  PUT /api/v1/products/:id
// @access Private/Admin
export const updateProductCtrl = asyncHandler(async (req, res) => {
	const { name, description, category, sizes, colors, user, price, totalQty, brand } = req.body;

	const product = await Product.findByIdAndUpdate(
		req.params.id,
		{
			name,
			description,
			category,
			sizes,
			colors,
			user,
			price,
			totalQty,
			brand,
		},
		{
			new: true,
		}
	);

	res.json({
		status: "success",
		message: "product updated success",
		product,
	});
});

// @desc   Delete products
// @route  DELETE /api/v1/products/:id/delete
// @access Private/Admin
export const deleteProductCtrl = asyncHandler(async (req, res) => {
	const id__ = req.params.id;
	const product = await Product.findByIdAndDelete(id__);

	res.json({
		status: "success",
		message: "product deleted success",
	});
});

// @desc   Add to wishlist
// @route  POST /api/v1/products/wishlist
// @access Private/
export const addToWishlist = asyncHandler(async (req, res) => {
	const prodId = req.body.id;
	try {
		const user = await User.findById(req.userAuthId);
		let alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
		if (alreadyAdded) {
			res.json({
				msg: "product is already in your wishlist",
			});
		} else {
			let prod = await Product.findById(prodId);
			user.wishlist.push(prod);
			await user.save();
			res.json({
				msg: "product added to your wishlist",
			});
		}
	} catch (error) {
		throw new Error(error);
	}
});

// @desc   Delete from wishlist
// @route  DELETE /api/v1/products/wishlist
// @access Private/
export const removeFromWishlist = asyncHandler(async (req, res) => {
	const prodId = req.body.id;
	try {
		const user = await User.findById(req.userAuthId);
		let inWishlist = user.wishlist.find((id) => id.toString() === prodId);
		if (inWishlist) {
			let prod = await Product.findById(prodId);
			user.wishlist.pull(prod);
			await user.save();
			res.json({
				msg: "product deleted from your wishlist",
			});
		} else {
			res.json({
				msg: "product is not in your wishlist",
			});
		}
	} catch (error) {
		throw new Error(error);
	}
});

// @desc   Set Discount
// @route  POST /api/v1/pm/setDiscount
// @access Private/Admin
export const setDiscountCtrl = asyncHandler(async (req, res) => {
	const { items, rate } = req.body;
	const products = await Product.find({ _id: { $in: items } });
	const users = await User.find({ wishlist: { $in: items } });

	try {
		for (const product of products) {
			product.discountRate = rate;
			product.price = parseFloat(((product.cost * 1.25 * (100 - rate)) / 100).toFixed(2));
			product.hasDiscount = rate > 0;
			await product.save();
		}
	} catch (error) {
		throw new Error(error);
	}

	if (rate > 0) {
		try {
			for (const user of users) {
				const matchingItems = items.filter((item) => user.wishlist.includes(item));

				if (matchingItems.length > 0) {
					const products = await Product.find({ _id: { $in: matchingItems } });

					const template = await htmlTemplate(user, products, rate);

					const mailOptions = {
						from: process.env.EMAIL,
						to: user.email,
						subject: "Items in Your Wishlist are on SALE",
						html: template,
					};
					sendMail(mailOptions);
				}
			}
		} catch (error) {
			console.log(`Error sending email: ${error}`);
		}
	}
	res.json({
		msg: "product discount saved successfully",
	});
});

export const setSingleDiscountCtrl = asyncHandler(async (req, res) => {
	const { rate } = req.body;
	const product = await Product.findById(req.params.id);
	const users = await User.find({ wishlist: { $in: req.params.id } });

	try {
		product.discountRate = rate;
		product.price = parseFloat(((product.cost * 1.25 * (100 - rate)) / 100).toFixed(2));
		product.hasDiscount = rate > 0;
		await product.save();
	} catch (error) {
		throw new Error(error);
	}

	if (rate > 0) {
		try {
			for (const user of users) {
				const template = await htmlTemplate(user, product, rate);

				const mailOptions = {
					from: process.env.EMAIL,
					to: user.email,
					subject: "Items in Your Wishlist are on SALE",
					html: template,
				};
				sendMail(mailOptions);
			}
		} catch (error) {
			console.log(`Error sending email: ${error}`);
		}
	}
	res.json({
		msg: "product discount saved successfully",
	});
});

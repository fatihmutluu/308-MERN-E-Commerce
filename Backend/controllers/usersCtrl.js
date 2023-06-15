import User from "../model/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import Product from "../model/Product.js";

// @desc Register user
// @route POST /api/v1/users/register
// @access Private/Admin
export const registerUserCtrl = async (req, res) => {
	const { fullname, email, password } = req.body;

	const capitalizeSentence = fullname
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");

	const userExist = await User.findOne({ email });

	if (userExist) {
		return res.json({
			msg: "User already exist",
		});
	}
	//hash the password
	const salt = await bcrypt.genSalt(10);
	const hashedPass = await bcrypt.hash(password, salt);

	const user = await User.create({
		fullname: capitalizeSentence,
		email,
		password: hashedPass,
	});

	res.status(201).json({
		status: "success",
		message: "User registered Succesfully",
		data: user,
	});
};

// @desc Login user
// @route POST /api/v1/users/login
// @access Public
export const loginUserCtrl = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const userFound = await User.findOne({ email });

	if (userFound && (await bcrypt.compare(password, userFound && userFound.password))) {
		res.json({
			status: "success",
			message: "login successful",
			userFound,
			token: generateToken(userFound?._id),
		});
	} else {
		throw new Error("Invalid login credentials");
	}
});

// @desc Get user Profile
// @route GET /api/v1/users/profile
// @access Private
export const getUserProfileCtrl = asyncHandler(async (req, res) => {
	const user = await User.findById(req.userAuthId).populate("orders");
	res.json({
		status: "success",
		user,
	});
});

// @desc Update user Shipping Address
// @route PUT /api/v1/users/update/shipping
// @access Private
export const updateShippingAddressCtrl = asyncHandler(async (req, res) => {
	const { firstName, lastName, address, city, postalCode, province, country, phone } = req.body;
	const shippingAddress = {
		firstName: firstName,
		lastName: lastName,
		address: address,
		city: city,
		postalCode: postalCode,
		province: province,
		country: country,
		phone: phone,
	};

	User.findByIdAndUpdate(
		req.userAuthId,
		{ $set: { shippingAddress: shippingAddress, hasShippingAddress: true } },
		{ new: true }
	)
		.then((updatedUser) => {
			res.json({
				status: "success",
				message: "User shipping address updated successfully",
				updatedUser,
			});
		})
		.catch((error) => {
			res.json(error);
		});
});

// @desc Get user Wishlist
// @route GET /api/v1/users/wishlist
// @access Private
export const getWishlist = asyncHandler(async (req, res) => {
	const user = await User.findById(req.userAuthId);
	try {
		const items = user.wishlist;

		const products = await Product.find({ _id: { $in: items } })
			.select("_id name description brand category gender images price")
			.lean(); // Use lean() to improve performance when you don't need Mongoose Documents.

		// send response with found products
		res.status(200).send(products);
	} catch (err) {
		// handle error
		console.error(err);
		res.status(500).send("Internal Server Error");
	}
});

// @desc Get username from ID
// @route GET /api/v1/users/getUsernameById/:id
// @access Private/Admin
export const getUserNameById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	res.send(user.fullname);
});

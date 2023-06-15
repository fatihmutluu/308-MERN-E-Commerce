import User from "../model/User.js";

export const isPM = async (req, res, next) => {
	const user = await User.findById(req.userAuthId);
	if (user.isPM) {
		next();
	} else {
		next(new Error("product manager only"));
	}
};

export const isSM = async (req, res, next) => {
	const user = await User.findById(req.userAuthId);
	if (user.isSM) {
		next();
	} else {
		next(new Error("sales manager only"));
	}
};

import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

export const sendMail = async (mailOptions) => {
	// Create a transporter for sending emails
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASS,
		},
	});

	// Send the email
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
};

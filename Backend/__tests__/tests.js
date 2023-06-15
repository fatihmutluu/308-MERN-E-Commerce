import mongoose from "mongoose";
import request from "supertest";
import app from "../app/app";
import http from "http";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken";
import { verifyToken } from "../utils/verifyToken";
import nodemailer from "nodemailer";
import { sendMail } from "../utils/sendMail";
import { globalErrHandler, notFound } from "../utils/globalErrHandler";
import { isPM, isSM } from "../middlewares/isAdmin";
import User from "../model/User";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { getTokenFromHeader } from "../utils/getTokenFromHeader";
import Stripe from "stripe";
import { stripeWebhook, takePayment } from "../utils/stripe";
import Order from "../model/Order";

jest.mock("mongoose");

//!3
describe("Database Tests", () => {
	afterEach(() => {
		// Clear mocks and restore the original implementations
		jest.clearAllMocks();
	});

	it("should connect to the MongoDB database", async () => {
		const mockConnection = {
			connection: {
				host: "localhost",
			},
		};
		mongoose.connect.mockResolvedValue(mockConnection);

		const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

		await dbConnect();

		expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URL);
		expect(consoleLogMock).toHaveBeenCalledWith(`Mongodb connected ${mockConnection.connection.host}`);

		consoleLogMock.mockRestore();
	});

	it("should handle a failed MongoDB connection", async () => {
		const error = new Error("Connection failed");
		mongoose.connect.mockRejectedValue(error);

		const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
		const processExitMock = jest.spyOn(process, "exit").mockImplementation();

		try {
			await dbConnect();
		} catch (error) {
			expect(error).toEqual(new Error(`Error: ${error.message}`));
		}

		expect(consoleLogMock).toHaveBeenCalledWith(`Error: ${error.message}`);
		expect(processExitMock).toHaveBeenCalledWith(1);

		consoleLogMock.mockRestore();
		processExitMock.mockRestore();
	});

	it("should set strictQuery to false", async () => {
		const mockConnection = {
			connection: {
				host: "localhost",
			},
		};
		mongoose.connect.mockResolvedValue(mockConnection);

		const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

		await dbConnect();

		expect(mongoose.set).toHaveBeenCalledWith("strictQuery", false);

		consoleLogMock.mockRestore();
	});
});

//!5
describe("App", () => {
	beforeAll(async () => {
		await mongoose.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	it("should pass a sample test", () => {
		expect(true).toBe(true);
	});

	it("should return index.html for the home route", async () => {
		const response = await request(app).get("/");
		expect(response.status).toBe(200);
		expect(response.type).toBe("text/html");
		expect(response.text).toContain("index.html");
	});

	it("should use the specified routes", async () => {
		const routes = [
			"/api/v1/users",
			"/api/v1/categories",
			"/api/v1/brands",
			"/api/v1/colors",
			"/api/v1/genders",
			"/api/v1/reviews",
			"/api/v1/orders",
			"/api/v1/refund",
			"/api/v1/pm",
			"/api/v1/sm",
		];

		for (const route of routes) {
			const response = await request(app).get(route);
			expect(response.status).toBe(200);
		}
	});

	it("should handle not found routes with the global error handler", async () => {
		const response = await request(app).get("/invalid-route");
		expect(response.status).toBe(404);
		expect(response.body.message).toBe("Not Found");
	});

	it("should handle server errors with the global error handler", async () => {
		// Mock a server error
		jest.spyOn(console, "error").mockImplementation();
		jest.spyOn(console, "log").mockImplementation();

		// Mock the error by throwing an exception
		jest.spyOn(app, "use").mockImplementation(() => {
			throw new Error("Internal Server Error");
		});

		const response = await request(app).get("/api/v1/users");
		expect(response.status).toBe(500);
		expect(response.body.message).toBe("Internal Server Error");

		// Restore the mocked implementation
		jest.restoreAllMocks();
	});
});

//!1
describe("Server", () => {
	let server;

	beforeAll(() => {
		server = http.createServer(app);
		server.listen(4040); // You can specify a different port for testing if needed
	});

	afterAll((done) => {
		server.close(done);
	});

	it("should start the server and listen on the specified port", async () => {
		// For example, sending a request to a route and checking the response
		const response = await request(server).get("/");
		expect(response.status).toBe(200);
		expect(response.text).toContain("index.html");
	});
});

//!1
describe("generateToken", () => {
	it("should generate a valid JWT token", () => {
		const userId = "123456789"; // The user ID you want to generate a token for
		const token = generateToken(userId);

		// Verify the token using the same JWT key and check if it contains the expected user ID
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		expect(decoded.id).toBe(userId);
	});
});

//!2
describe("verifyToken", () => {
	it("should return decoded data for a valid token", () => {
		const userId = "6467c0a32bb0ff8cf2bf991d"; // The user ID you want to generate a token for
		const token = jwt.sign({ id: userId }, process.env.JWT_KEY, { expiresIn: "3d" });

		const decoded = verifyToken(token);
		expect(decoded).toEqual({ id: userId });
	});

	it("should return false for an invalid token", () => {
		const invalidToken = "invalid_token";

		const decoded = verifyToken(invalidToken);
		expect(decoded).toBe(false);
	});

	// Add more test cases if needed
});

//!2
describe("sendMail", () => {
	it("should send an email successfully", async () => {
		const mailOptions = {
			from: "sender@example.com",
			to: "recipient@example.com",
			subject: "Test Email",
			text: "This is a test email.",
		};

		const transporterMock = {
			sendMail: jest.fn((options, callback) => {
				callback(null, { response: "OK" });
			}),
		};

		const createTransportMock = jest.spyOn(nodemailer, "createTransport");
		createTransportMock.mockReturnValue(transporterMock);

		await sendMail(mailOptions);

		expect(createTransportMock).toHaveBeenCalledWith({
			service: "gmail",
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASS,
			},
		});
		expect(transporterMock.sendMail).toHaveBeenCalledWith(mailOptions);
		expect(console.log).toHaveBeenCalledWith("Email sent: OK");

		createTransportMock.mockRestore();
	});

	it("should handle email sending error", async () => {
		const mailOptions = {
			from: "sender@example.com",
			to: "recipient@example.com",
			subject: "Test Email",
			text: "This is a test email.",
		};

		const transporterMock = {
			sendMail: jest.fn((options, callback) => {
				callback(new Error("Email sending failed"), null);
			}),
		};

		const createTransportMock = jest.spyOn(nodemailer, "createTransport");
		createTransportMock.mockReturnValue(transporterMock);

		await sendMail(mailOptions);

		expect(createTransportMock).toHaveBeenCalledWith({
			service: "gmail",
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASS,
			},
		});
		expect(transporterMock.sendMail).toHaveBeenCalledWith(mailOptions);
		expect(console.log).toHaveBeenCalledWith("Email sending failed");

		createTransportMock.mockRestore();
	});
});

//!2
describe("Error Middleware", () => {
	describe("globalErrHandler", () => {
		it("should handle an error and send a JSON response", () => {
			const err = new Error("Test error");
			const req = {};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			const next = jest.fn();

			globalErrHandler(err, req, res, next);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				stack: err.stack,
				message: err.message,
			});
		});
	});

	describe("notFound", () => {
		it("should create a new Error with the route URL and pass it to the next middleware", () => {
			const req = {
				originalUrl: "/invalid-route",
			};
			const res = {};
			const next = jest.fn();

			notFound(req, res, next);

			expect(next).toHaveBeenCalledWith(expect.any(Error));
			expect(next.mock.calls[0][0].message).toBe("Route /invalid-route not found");
		});
	});
});

//!4
jest.mock("../model/User");
describe("isAdmin Middleware", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("isPM Middleware", () => {
		it("should call next() if user is a product manager", async () => {
			const req = {
				userAuthId: "user1",
			};
			const res = {};
			const next = jest.fn();

			User.findById.mockResolvedValue({
				isPM: true,
			});

			await isPM(req, res, next);

			expect(User.findById).toHaveBeenCalledWith("user1");
			expect(next).toHaveBeenCalled();
			expect(next).not.toHaveBeenCalledWith(new Error("product manager only"));
		});

		it("should call next() with an error message if user is not a product manager", async () => {
			const req = {
				userAuthId: "user1",
			};
			const res = {};
			const next = jest.fn();

			User.findById.mockResolvedValue({
				isPM: false,
			});

			await isPM(req, res, next);

			expect(User.findById).toHaveBeenCalledWith("user1");
			expect(next).toHaveBeenCalledWith(new Error("product manager only"));
			expect(next).not.toHaveBeenCalledTimes(2);
		});
	});

	describe("isSM Middleware", () => {
		it("should call next() if user is a sales manager", async () => {
			const req = {
				userAuthId: "user1",
			};
			const res = {};
			const next = jest.fn();

			User.findById.mockResolvedValue({
				isSM: true,
			});

			await isSM(req, res, next);

			expect(User.findById).toHaveBeenCalledWith("user1");
			expect(next).toHaveBeenCalled();
			expect(next).not.toHaveBeenCalledWith(new Error("sales manager only"));
		});

		it("should call next() with an error message if user is not a sales manager", async () => {
			const req = {
				userAuthId: "user1",
			};
			const res = {};
			const next = jest.fn();

			User.findById.mockResolvedValue({
				isSM: false,
			});

			await isSM(req, res, next);

			expect(User.findById).toHaveBeenCalledWith("user1");
			expect(next).toHaveBeenCalledWith(new Error("sales manager only"));
			expect(next).not.toHaveBeenCalledTimes(2);
		});
	});
});

//!2
jest.mock("../utils/getTokenFromHeader");
jest.mock("../utils/verifyToken");
describe("isLoggedIn Middleware", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should call next() if token is valid and set userAuthId in req object", () => {
		const req = {};
		const res = {};
		const next = jest.fn();

		getTokenFromHeader.mockReturnValue("valid_token");
		verifyToken.mockReturnValue({
			id: "user1",
		});

		isLoggedIn(req, res, next);

		expect(getTokenFromHeader).toHaveBeenCalledWith(req);
		expect(verifyToken).toHaveBeenCalledWith("valid_token");
		expect(req.userAuthId).toEqual("user1");
		expect(next).toHaveBeenCalled();
	});

	it("should throw an error if token is invalid/expired", () => {
		const req = {};
		const res = {};
		const next = jest.fn();

		getTokenFromHeader.mockReturnValue("invalid_token");
		verifyToken.mockReturnValue(null);

		expect(() => isLoggedIn(req, res, next)).toThrowError("Invalid/Expired token, please login again");

		expect(getTokenFromHeader).toHaveBeenCalledWith(req);
		expect(verifyToken).toHaveBeenCalledWith("invalid_token");
		expect(req.userAuthId).toBeUndefined();
		expect(next).not.toHaveBeenCalled();
	});
});

//!3
jest.mock("stripe");
jest.mock("../model/Order");
describe("stripeWebhook", () => {
	let mockRequest;
	let mockResponse;
	let mockConstructEvent;
	let mockSend;

	beforeEach(() => {
		mockRequest = {
			headers: {
				"stripe-signature": "mock-signature",
			},
			body: "mock-body",
		};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		mockConstructEvent = jest.fn();
		mockSend = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should handle checkout.session.completed event and update the order", async () => {
		const mockEvent = {
			type: "checkout.session.completed",
			data: {
				object: {
					metadata: {
						orderId: "mock-order-id",
					},
					payment_status: "succeeded",
					payment_method_types: ["card"],
					amount_total: 1000,
					currency: "usd",
				},
			},
		};
		const mockFindByIdAndUpdate = jest.fn().mockResolvedValue({
			_id: "mock-order-id",
			totalPrice: 10,
			currency: "usd",
			paymentMethod: "card",
			paymentStatus: "succeeded",
		});
		Stripe.mockImplementation(() => ({
			webhooks: {
				constructEvent: mockConstructEvent,
			},
		}));
		Order.findByIdAndUpdate = mockFindByIdAndUpdate;

		mockConstructEvent.mockReturnValue(mockEvent);

		await stripeWebhook(mockRequest, mockResponse);

		expect(Stripe).toHaveBeenCalledWith(process.env.STRIPE_KEY);
		expect(mockConstructEvent).toHaveBeenCalledWith("mock-body", "mock-signature", process.env.STRIPE_SECRET);
		expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
			"mock-order-id",
			{
				totalPrice: 10,
				currency: "usd",
				paymentMethod: "card",
				paymentStatus: "succeeded",
			},
			{ new: true }
		);
		expect(mockResponse.send).toHaveBeenCalled();
	});

	it("should send 400 error response if constructEvent throws an error", async () => {
		const mockError = new Error("mock-error");
		Stripe.mockImplementation(() => ({
			webhooks: {
				constructEvent: mockConstructEvent,
			},
		}));

		mockConstructEvent.mockImplementation(() => {
			throw mockError;
		});

		await stripeWebhook(mockRequest, mockResponse);

		expect(Stripe).toHaveBeenCalledWith(process.env.STRIPE_KEY);
		expect(mockConstructEvent).toHaveBeenCalledWith("mock-body", "mock-signature", process.env.STRIPE_SECRET);
		expect(mockResponse.status).toHaveBeenCalledWith(400);
		expect(mockResponse.send).toHaveBeenCalledWith(`Webhook Error: ${mockError.message}`);
	});

	it("should not update the order if event type is not checkout.session.completed", async () => {
		const mockEvent = {
			type: "payment_intent.succeeded",
		};
		Stripe.mockImplementation(() => ({
			webhooks: {
				constructEvent: mockConstructEvent,
			},
		}));

		mockConstructEvent.mockReturnValue(mockEvent);

		await stripeWebhook(mockRequest, mockResponse);

		expect(Stripe).toHaveBeenCalledWith(process.env.STRIPE_KEY);
		expect(mockConstructEvent).toHaveBeenCalledWith("mock-body", "mock-signature", process.env.STRIPE_SECRET);
		expect(mockResponse.send).toHaveBeenCalled();
	});
});

//!1
describe("takePayment", () => {
	let mockCreateSession;

	beforeEach(() => {
		mockCreateSession = jest.fn().mockResolvedValue({
			url: "mock-session-url",
		});
		Stripe.mockImplementation(() => ({
			checkout: {
				sessions: {
					create: mockCreateSession,
				},
			},
		}));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should create a payment session and return the session URL", async () => {
		const mockOrderItems = [
			{
				name: "Mock Product 1",
				description: "Mock Product 1 Description",
				price: 10,
				qty: 2,
			},
			{
				name: "Mock Product 2",
				description: "Mock Product 2 Description",
				price: 20,
				qty: 1,
			},
		];
		const mockOrder = {
			_id: "mock-order-id",
		};
		const expectedConvertedOrders = [
			{
				price_data: {
					currency: "usd",
					product_data: {
						name: "Mock Product 1",
						description: "Mock Product 1 Description",
					},
					unit_amount: 1000,
				},
				quantity: 2,
			},
			{
				price_data: {
					currency: "usd",
					product_data: {
						name: "Mock Product 2",
						description: "Mock Product 2 Description",
					},
					unit_amount: 2000,
				},
				quantity: 1,
			},
		];

		const sessionUrl = await takePayment(mockOrderItems, mockOrder);

		expect(Stripe).toHaveBeenCalledWith(process.env.STRIPE_KEY);
		expect(mockCreateSession).toHaveBeenCalledWith({
			line_items: expectedConvertedOrders,
			metadata: {
				orderId: JSON.stringify("mock-order-id"),
			},
			mode: "payment",
			success_url: "http://localhost:3000/customer-order",
			cancel_url: "http://localhost:3000/success",
		});
		expect(sessionUrl).toEqual("mock-session-url");
	});
});

//!26 total

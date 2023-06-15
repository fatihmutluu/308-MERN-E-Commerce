import fs from "fs";
import PDFDocument from "pdfkit";

export const invoiceTemplate = (order, user) => {
	const items = order.orderItems.map((item) => ({
		item: item.name,
		description: "Description of the item",
		quantity: item.qty,
		amount: item.qty * item.price * 100,
		image: item.image,
	}));

	const invoice = {
		shipping: {
			name: user.shippingAddress.firstName + " " + user.shippingAddress.lastName,
			address: user.shippingAddress.address,
			city: user.shippingAddress.city,
			state: user.shippingAddress.province,
			country: user.shippingAddress.country,
			postal_code: user.shippingAddress.postalCode,
		},
		items: items,
		subtotal: order.totalPrice * 100,
		invoice_nr: order.orderNumber,
	};

	createInvoice(invoice, order);
};

const createInvoice = (invoice, order) => {
	let doc = new PDFDocument({ size: "A4", margin: 50 });

	generateHeader(doc);
	generateCustomerInformation(doc, invoice);
	generateInvoiceTable(doc, invoice);
	generateFooter(doc);

	doc.end();
	doc.pipe(fs.createWriteStream("./pdfs/" + order._id + ".pdf"));
};

function generateHeader(doc) {
	doc
		.image("logo.jpg", 45, 30, { width: 100 }, { align: "left" })
		.fillColor("#444444")
		.fontSize(20)
		.text("SU/Shoes Inc.", 140, 70)
		.fontSize(10)
		.text("Sabanci University", 200, 65, { align: "right" })
		.text("Orta Mahalle, 34956", 200, 80, { align: "right" })
		.text("Tuzla, Istanbul, Türkiye", 200, 95, { align: "right" })
		.moveDown();
}

function generateCustomerInformation(doc, invoice) {
	doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

	generateHr(doc, 185);

	const customerInformationTop = 200;

	doc
		.fontSize(10)
		.text("Invoice Number:", 50, customerInformationTop)
		.font("fonts/Arimo-Regular.ttf")
		.text(invoice.invoice_nr, 150, customerInformationTop)
		.font("fonts/Arimo-Regular.ttf")
		.text("Invoice Date:", 50, customerInformationTop + 15)
		.text(formatDate(new Date()), 150, customerInformationTop + 15)

		.font("fonts/Arimo-Bold.ttf")
		.text(invoice.shipping.name, 300, customerInformationTop)
		.font("fonts/Arimo-Regular.ttf")
		.text(invoice.shipping.address, 300, customerInformationTop + 15)
		.text(
			invoice.shipping.city + ", " + invoice.shipping.state + ", " + invoice.shipping.country,
			300,
			customerInformationTop + 30
		)
		.moveDown();

	generateHr(doc, 252);
}

async function generateInvoiceTable(doc, invoice) {
	let i;
	const invoiceTableTop = 330;

	doc.font("fonts/Arimo-Bold.ttf");
	generateTableRow(doc, invoiceTableTop, "Item", "Unit Cost", "Quantity", "Line Total");
	generateHr(doc, invoiceTableTop + 20);
	doc.font("fonts/Arimo-Regular.ttf");
	for (i = 0; i < invoice.items.length; i++) {
		const item = invoice.items[i];
		const position = invoiceTableTop + (i + 1) * 30;
		generateTableRow(
			doc,
			position,
			item.item,
			formatCurrency(item.amount / item.quantity),
			item.quantity,
			formatCurrency(item.amount)
		);
		generateHr(doc, position + 20);
	}

	const subtotalPosition = invoiceTableTop + (i + 1) * 30;
	generateTableRow(
		doc,
		subtotalPosition,
		"",

		"Subtotal",
		"",
		formatCurrency(invoice.subtotal)
	);

	doc.font("fonts/Arimo-Bold.ttf");
}

function generateFooter(doc) {
	doc.fontSize(10).text("Thank you for choosing us.", 50, 780, {
		align: "center",
		width: 500,
	});
}

function generateTableRow(doc, y, item, unitCost, quantity, lineTotal) {
	doc
		.fontSize(10)
		.text(item, 50, y)
		.text(unitCost, 280, y, { width: 90, align: "right" })
		.text(quantity, 370, y, { width: 90, align: "right" })
		.text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
	doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
	return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	return day + "-" + month + "-" + year;
}

// Create the HTML template
export const htmlTemplate = (user, products, rate) => {
	let discountedItems = [];

	if (Array.isArray(products)) {
		discountedItems = products.map((item) => ({
			name: item.name,
			oldPrice: item.cost * 1.25,
			rate,
			newPrice: item.price,
			image: item.images,
			link: "http://localhost:3000/products/" + item._id,
		}));
	} else {
		// Single product object case
		discountedItems = [
			{
				name: products.name,
				oldPrice: products.cost * 1.25,
				rate,
				newPrice: products.price,
				image: products.images,
				link: "http://localhost:3000/products/" + products._id,
			},
		];
	}

	let template = `
    <div style="text-align: center;">
        <div style="display: flex; align-items: center; justify-content: flex-start; margin-upper: 200px;">
            <a href="http://localhost:3000/products-filters" target="_blank">
                <img src="https://i.hizliresim.com/ov9557i.png" alt="Your Logo" style="width: 200px; height: 200px;">
            </a>
            <div style="text-align: center; margin-left: 239px;">
                <h1 style="font-size: 150%;">Dear ${user.fullname}(${user.email})</h1>
                <h1 style="font-size: 200%;">Items in Your Wishlist on Sale</h1>
                <h1 style="font-size: 200%;"><strong>Discount Rate: </strong>${rate}%</h1>
            </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; border-spacing: 0;">
            <thead>
                <tr>
                    <th style="border: 1px solid black; padding: 10px; font-size: 17px;">Image</th>
                    <th style="border: 1px solid black; padding: 10px; font-size: 17px;">Item</th>
                    <th style="border: 1px solid black; padding: 10px; font-size: 17px;">Old Price</th>
                    <th style="border: 1px solid black; padding: 10px; font-size: 17px;">New Price</th>
                </tr>
            </thead>
            <tbody>
                ${getDiscountedItems()}
            </tbody>
        </table>
        <p style="font-size: 24px; background-color: #ffcc00;">Hurry, stocks are running out. Click on the images to go to the site immediately.</p>
    </div>
    `;

	function getDiscountedItems() {
		let itemsHtml = "";
		discountedItems.forEach((item) => {
			itemsHtml += `
        <tr>
            <td style="border: 1px solid black; padding: 10px; width: 150px; vertical-align: top;">
                <a href="${item.link}" target="_blank">
                    <img src="${item.image}" alt="Product Image" style="max-width: 150px; max-height: 150px;">
                </a>
            </td>
            <td style="border: 1px solid black; padding: 10px; font-size: 20px; vertical-align: middle;">
                <a href="${item.link}" target="_blank">
                    ${item.name}
                </a>
            </td>
            <td style="border: 1px solid black; padding: 10px; font-size: 20px; color: red;">
                <span style="text-decoration: line-through;">$${item.oldPrice}</span>
            </td>
            <td style="border: 1px solid black; padding: 10px; font-size: 20px; color: green;">
                $${item.newPrice}
            </td>
        </tr>
        `;
		});
		return itemsHtml;
	}
	return template;
};

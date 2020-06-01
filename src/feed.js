const { Feed } = require("feed");
const vehicleSearch = require("./vehicle-search");
const contentRenderer = require("./content-renderer");
const utils = require("./utils");

const meta = {
	title: "Mercedes Benz Fahrzeugsuche",
	description: "Mercedes-Benz neu & gebraucht kaufen - Fahrzeugsuche Online",
	id:
		"https://www.mercedes-benz.de/passengercars/mercedes-benz-cars/vehicle-search.html",
	link:
		"https://www.mercedes-benz.de/passengercars/mercedes-benz-cars/vehicle-search.html",
	language: "de",
	image:
		"https://www.mercedes-benz.de/passengercars/mercedes-benz-cars/_jcr_content/image.MQ6.2.2x.20190725160009.jpeg",
	favicon:
		"https://assets.oneweb.mercedes-benz.com/global/1.12.0/favicon/favicon.ico",
	copyright:
		"Not affiliated with Mercedes Benz. All content © 2020 Mercedes-Benz AG",
	generator: "starfeed",
};

exports.overview = async function () {
	const results = await vehicleSearch.overview();
	const feed = new Feed(meta);

	for (vehicle of results.fomVehicles) {
		// require("fs").writeFileSync(
		// 	require("path").join(__dirname, `../dat/${vehicle.id}.json`),
		// 	JSON.stringify(vehicle, null, 4)
		// );
		// console.log(vehicle);

		const link = `https://www.mercedes-benz.de/passengercars/mercedes-benz-cars/vehicle-search.html#/u/used-vehicles/d/id/${vehicle.id}`;

		let primaryImage =
			"https://assets.oneweb.mercedes-benz.com/plugin/vs/vs-2.43.0/placeholders/compact_900.jpg";

		if (vehicle.media && vehicle.media.images) {
			primaryImage = vehicle.media.images.USED.sort(
				utils.propSort((img) => img.format)
			).find(() => true);
			// console.log(vehicle.media.images.USED);
		}

		const content = await contentRenderer.render(vehicle);
		// console.log(content);

		const title = `${vehicle.priceInfo.offerPrice.gross} - ${vehicle.condition.mileage} - ${vehicle.vehicleConfiguration.salesDescription}`;

		feed.addItem({
			id: vehicle.id,
			link,
			title,
			content,
			description: vehicle.priceInfo.offerPrice.gross,
			author: [
				{
					name: [
						vehicle.dealer.formatted.nameline1,
						vehicle.dealer.formatted.nameline2,
					]
						.join(" ")
						.trim(),
					email: vehicle.dealer.formatted.email,
					link: vehicle.dealer.formatted.links.website,
				},
			],
			date: new Date(vehicle.updatedDate),
			image: primaryImage.url,
		});
	}

	return feed;
};

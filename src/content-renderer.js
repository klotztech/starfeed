const fs = require("fs");
const path = require("path");
const Mustache = require("mustache");
const utils = require("./utils");
const template = fs.readFileSync(
	path.join(__dirname, "../templates/content.html"),
	"utf8"
);

exports.render = async function (vehicle) {
	const viewData = {
		...vehicle,
		goodStuff: vehicle.vehicleConfiguration.equipments
			.filter((equip) => equip.name && equip.name.includes("AMG"))
			.sort(
				utils.propSort((e) =>
					e.name.toLowerCase().includes("performance") ? -1 : 0
				)
			),
		photos:
			vehicle.media &&
			vehicle.media.images &&
			vehicle.media.images.USED.filter((i) => i.format === "medium"),
	};

	return Mustache.render(template, viewData);
};

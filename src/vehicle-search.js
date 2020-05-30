const axios = require("axios");
const HttpStatus = require("http-status-codes");

const api = axios.create({
	baseURL: "https://cdn.sip.mercedes-benz.com/api/vs/v3/UCui/DE",
	timeout: 1000,
	headers: {
		accept: "application/vnd.basesip.fom+json",
		"accept-language": "en-US,en;q=0.9,de;q=0.8",
		// "content-type": "application/json;charset=UTF-8",
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "cross-site",
		referrer: "https://www.mercedes-benz.de/bin/daimler/public/blank.html",
	},
});

exports.overview = async function () {
	const res = await api.post("overview", {
		vehicleSearchRequest: {
			searchInfo: {
				paging: { pageIndex: 0, quantity: 12 },
				searchterm: { findCompleteTermOnly: true },
				sort: [{ field: "offerPriceGross", order: "ASC" }],
			},
			facets: ["salesClass", "bodyGroup", "isAmg", "mileage"],
			criteria: {
				salesClass: [{ codes: ["A"] }],
				bodyGroup: [{ codes: ["10"] }],
				isAmg: true,
				mileage: { min: 2190, max: 95850 },
			},
			context: {
				processId: "UCui",
				locale: "de_DE",
				outletIds: [],
				uiId: "main",
			},
		},
	});

	if (res.status !== HttpStatus.OK) throw new Error("Vehicle search failed");
	if (!res.data.results || !(res.data.results instanceof Array))
		throw new Error("Vehicle search returned invalid data");
	return res.data.results[0];
};

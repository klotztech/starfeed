const express = require("express");
const morgan = require("morgan");
const feed = require("./feed");

var app = express();

app.use(morgan("tiny"));

app.get("/", function (req, res) {
	res.send("hello world");
});

app.get("/atom.xml", async function (req, res) {
	const results = await feed.overview();
	res.end(results.atom1());
});

app.get("/rss.xml", async function (req, res) {
	const results = await feed.overview();
	res.end(results.rss2());
});

app.listen(3000, function () {
	console.log("App listening on port 3000!");
});

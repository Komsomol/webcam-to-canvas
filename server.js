const express = require('express');
const app = express();
const port = process.env.PORT || 8081;

const path = require("path");
var bodyParser = require('body-parser');

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

async function photo() {
	var pic = await takephoto();
	// console.log(`result is => ${pic}`, pic);
	return pic;
}

app.get('/', (req, res) => {

	res.render('index', {
		message:'Click get new photo'
	});

});

app.get('/photo', async (req, res) => {
	console.log(`Incoming`);
	var photoUpload = await photo();

	res.render('index', {
		message:'Photo',
		image: photoUpload
	});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
}); 
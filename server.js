const express = require('express');
const app = express();
const port = process.env.PORT || 8081;
var compression = require('compression')
const path = require("path");
var bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "views")));

// compress all responses
app.use(compression());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// parse application/json
app.use(bodyParser.json( {limit: '50mb', extended: true}));

app.get('/', (req, res) => {
	res.render('index');
});

app.post('/upload', upload.single('photo'), (req, res) => {
	console.log(`Incoming`, req.headers['content-type']);
	console.log(JSON.stringify(req.body,null,2));
	res.json(
		{ 
			status : 'ok',
		}
	);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
}); 
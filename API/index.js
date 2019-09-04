const express = require('express');
const bodyParser = require('body-parser');

const morgan = require('morgan');
const cors = require('cors');
const utf8 = require('utf8');
const app = express();

const { mongoose } = require('./database');

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/phishing', require('./routes/phishing.routes'));

// Starting the server
app.listen(app.get('port'), () => {
	console.log("Server on port " + app.get('port'));
});
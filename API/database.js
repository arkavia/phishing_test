const mongoose = require('mongoose');

// DATABASE
const URI = 'mongodb://YOUR_USER:YOUR_PASSWORD@YOUR_IP_ADDRESS:27017/YOUR_DATABASE_NAME';
mongoose.connect(URI, { useNewUrlParser: true })
	.then(db => console.log('Connected'))
	.catch(err => console.error(err));

module.exports = mongoose;
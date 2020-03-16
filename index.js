const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./config');
const albums = require('./app/albums');
const artists = require('./app/artists');
const tracks = require('./app/tracks');
const users = require('./app/users');
const trackHistory = require('./app/trackHistories');

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const run = async () => {
	await mongoose.connect(config.database, config.databaseOptions);

	app.use('/albums', albums);
	app.use('/artists', artists);
	app.use('/tracks', tracks);
	app.use('/users', users);
	app.use('/track_history', trackHistory);

	app.listen(port, () => {
		console.log(`HTTP Server started on ${port} port!`);
	});
};

run().catch(e => {
	console.error(e);
});
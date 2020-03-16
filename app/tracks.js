const express = require('express');
const mongoose = require('mongoose');


const Track = require('../models/Track');
const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();


router.get('/', async(req, res) => {
	if(req.query.album){
		try{
			const albumTracks = await Track.find({album: ObjectId(req.query.album)});
			res.send(albumTracks);
		} catch(e) {
			res.status(400).send(e);
		}
	} else {
		const tracks = await Track.find();
		res.send(tracks);
	}
});

router.post('/', async(req, res) => {
	const trackData = req.body;

	const track = new Track(trackData);

	try{
		await track.save();
		res.send({trackId: track._id});
	} catch (e) {
		res.status(404).send(e);
	}
});

module.exports = router;
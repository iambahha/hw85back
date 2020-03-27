const express = require('express');
const auth = require('../middleware/auth');

const TrackHistory = require('../models/TrackHistory');
const User = require('../models/User');

const router = express.Router();

router.post('/', auth, async (req, res) => {

  const trackHistory = new TrackHistory({
    user: req.user._id,
    track: req.body.track,
    datetime: new Date().toISOString()
  });

  try {
    await trackHistory.save();
    return res.send(trackHistory);
  } catch (error) {
    return res.status(400).send(error)
  }
  
});

router.get('/', auth, (req, res) => {
  TrackHistory.find({user: req.user._id}).populate({path: 'track', populate: {path: 'album', populate: {path: 'artist'}}}).sort({datetime: -1})
    .then(tracks => res.send(tracks))
    .catch(() => res.sendStatus(500));
});

module.exports = router;
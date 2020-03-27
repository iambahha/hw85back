const express = require('express');

const Track = require('../models/Track');
const auth = require('../middleware/auth');
const addAuth = require('../middleware/addAuth');
const permit = require('../middleware/permit');

const router = express.Router();

// router.get('/', (req, res) => {
//   if (req.query.album) {
//     Track.find({album: req.query.album}).sort({track_number: 1})
//       .then(tracks => res.send(tracks))
//       .catch(() => res.sendStatus(500));
//   } else {
//     Track.find().sort({album: 1, track_number: 1})
//       .then(tracks => res.send(tracks))
//       .catch(() => res.sendStatus(500));
//   }
// });

router.get('/', addAuth, async (req, res) => {
  try {
    let criteria = {published: true, removed: false,};
    if(!req.user){
      criteria = {
        album: req.query.album,
        removed: false,
        $or: [
          {published: true},
        ]
      };
      const track = await Track.find(criteria).populate('album').sort({track_number: 1});
      return res.send(track)
    }
    if((req.user && req.user.role === 'user')){
      criteria = {
        album: req.query.album,
        removed: false,
        $or: [
          {published: true},
          {user: req.user._id}
        ]
      };
      const track = await Track.find(criteria).populate('album').sort({track_number: 1});
      return res.send(track)
    }
    if (req.user && req.user.role === 'admin') criteria = {album: req.query.album};
    const track = await Track.find(criteria).populate('album').sort({track_number: 1});
    res.send(track);
  }catch(e){
    res.sendStatus(400)
  }
});

router.post('/', [auth, permit('user', 'admin')], async (req, res) => {
  console.log(req.body);
  const track_number = await Track.find({album: req.body.album});
  const track = new Track({...req.body, user: req.user._id, track_number: track_number.length + 1});
  track.save()
    .then(result => res.send(result))
    .catch(error => res.status(400).send(error));
});

router.post('/:id/toggle_published', [auth, permit('admin')], async (req, res) => {
  const track = await Track.findById(req.params.id);

  if (!track) {
    return res.sendStatus(404);
  }

  track.published = !track.published;

  await track.save();

  res.send(track);
});

router.post('/:id/toggle_removed', [auth, permit('admin')], async (req, res) => {
  const track = await Track.findById(req.params.id);

  if (!track) {
    return res.sendStatus(404);
  }

  track.removed = !track.removed;

  await track.save();

  res.send(track);
});

router.delete('/:id', [auth, permit('admin')], async (req, res) => {
  const success = {message:'Removed'};
  try {
    console.log(req.params.id);
    const track = await Track.findById(req.params.id);

    await track.remove();
    res.sendStatus(200)

  }catch(e)
  {
    res.sendStatus(400)
  }

  return res.send(success)
});

module.exports = router;
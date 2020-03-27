const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require('nanoid');
const config = require('../config');

const auth = require('../middleware/auth');
const addAuth = require('../middleware/addAuth');
const permit = require('../middleware/permit');
const Artist = require('../models/Artist');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', addAuth, async (req, res) => {
  try {
    let criteria = {published: true, removed: false};

    if (!req.user){
      criteria = {
        removed: false,
        $or:[
          {published: true}
        ]
      }
    }
    if (req.user && req.user.role === 'user'){
      criteria = {
        removed: false,
        $or:[
          {published: true},
          {user:req.user._id}
        ]
      }
    } else if (req.user && req.user.role === 'admin'){
      criteria = {}
    }

    const artists = await Artist.find(criteria).sort('name');

    return res.send(artists)
  }catch (e) {
    return res.status(500).send(e)
  }
});

router.post('/', [auth, permit('user', 'admin')], upload.single('photo'), (req, res) => {
  const artistData = req.body;

    if (req.file) {
    artistData.photo = req.file.filename;
  }

  const artist = new Artist(artistData);

  artist.save()
    .then(result => res.send(result))
    .catch(error => res.status(400).send(error));
});

router.post('/:id/toggle_published', [auth, permit('admin')], async (req, res) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    return res.sendStatus(404);
  }

  artist.published = !artist.published;

  await artist.save();

  res.send(artist);
});

router.post('/:id/toggle_removed', [auth, permit('admin')], async (req, res) => {
  const artist = await Artist.findById(req.params.id).populate('album');

  if (!artist) {
    return res.sendStatus(404);
  }

  artist.removed = !artist.removed;

  await artist.save();

  res.send(artist);
});

router.delete('/:id', [auth, permit('admin')], async (req, res) => {
  const success = {message:'Removed'};
  try {
    const artist = await Artist.findById(req.params.id);

      await artist.remove();
      res.sendStatus(200)

  }catch(e)
  {
    res.sendStatus(400)
  }

  return res.send(success)
});


module.exports = router;
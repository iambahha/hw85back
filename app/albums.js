const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require('nanoid');
const config = require('../config');

const Album = require('../models/Album');
const auth = require('../middleware/auth');
const permit = require('../middleware/permit');
const addAuth = require('../middleware/addAuth');

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

router.get('/', (req, res) => {
  if (req.query.artist) {
    Album.find({artist: req.query.artist}).sort({date: 1})
      .then(albums => res.send(albums))
      .catch(() => res.sendStatus(500));
  } else {
    Album.find().sort({date: 1})
      .then(albums => res.send(albums))
      .catch(() => res.sendStatus(500));
  }
});

router.get('/:id', addAuth, async (req, res) => {
  try {
    let criteria = {published: true, removed: false};
      if(!req.user){
        criteria = {
        artist: req.params.id,
          removed: false,
          $or: [
            {published: true}
          ]
        };
        const album = await Album.find(criteria).populate('artist').sort('title');
        return res.send(album)
      }
      if((req.user && req.user.role === 'user')){
        criteria = {
        artist: req.params.id,
          removed: false,
          $or: [
            {published: true},
            {user: req.user._id}
          ]
        };
        const album = await Album.find(criteria).populate('artist').sort('title');
        return res.send(album)
      }
      if (req.user && req.user.role === 'admin') criteria = {artist: req.params.id};
      const album = await Album.find(criteria).populate('artist').sort('title');
      res.send(album);
    }catch(e){
    res.sendStatus(400)
  }
});

router.post('/', [auth, permit('user', 'admin')], upload.single('image'), (req, res) => {
  const albumData = req.body;

  if (req.file) {
    albumData.image = req.file.filename;
  }

  const album = new Album(albumData);

  album.save()
    .then(result => res.send(result))
    .catch(error => res.status(400).send(error));
});

router.post('/:id/toggle_published', [auth, permit('admin')], async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.sendStatus(404);
  }

  album.published = !album.published;

  await album.save();

  res.send(album);
});

router.post('/:id/toggle_removed', [auth, permit('admin')], async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return res.sendStatus(404);
  }

  album.removed = !album.removed;

  await album.save();

  res.send(album);
});

router.delete('/:id', [auth, permit('admin')], async (req, res) => {
  const success = {message:'Removed'};
  try {
    const album = await Album.findById(req.params.id);

    await album.remove();
    res.sendStatus(200)

  }catch(e)
  {
    res.sendStatus(400)
  }

  return res.send(success)
});


module.exports = router;
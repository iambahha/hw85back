const express = require('express');

const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const config = require('../config');
const axios = require('axios');
const nanoid = require('nanoid');

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

router.post('/', upload.single('avatarImage'), async (req, res) => {
  const userCreditations = req.body;
  console.log(req.body);

  if (req.file){
    userCreditations.avatarImage = req.file.filename
  }

  const user = new User(userCreditations);

  user.generateToken();

  try {
    await user.save();
    return res.send({message: 'User registered', user});
  } catch (error) {
    return res.status(400).send(error)
  }
});

router.post('/sessions', async (req, res) => {
  const user = await User.findOne({username: req.body.username});

  if (!user) {
    return res.status(400).send({error: 'User does not exist'});
  }

  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    return res.status(400).send({error: 'Password incorrect'});
  }

  user.generateToken();

  await user.save();

  res.send({message: 'Login successful', user});
});

router.delete('/sessions', async (req, res) => {
  const token = req.get('Authorization');
  const success = {message: 'Logged out'};

  if(!token) {
    return res.send(success);
  }
  const user = await User.findOne({token});

  if(!user) {
    return res.send(success);
  }

  user.generateToken();
  await user.save();

  return res.send(success);
});

router.put('/', async (req, res) => {
  user.password = req.body.password;

  await user.save();

  res.sendStatus(200);
});

router.get('/', (req, res) => {
  User.find()
    .then(users=> res.send(users))
    .catch(()=>res.sendStatus(500))
});

router.post('/facebook', async (req, res) => {
  try {
    const inputToken = req.body.accessToken;
    const accessToken = config.facebook.appId + '|' + config.facebook.appSecret;

    const url = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${accessToken}`;

    const response = await axios.get(url);

    if (response.data.data.error) {
      return res.status(401).send({message: 'Facebook token incorrect'});
    }

    if (req.body.id !== response.data.data.user_id) {
      return res.status(403).send({message: 'User ID incorrect'});
    }

    let user = await User.findOne({facebookId: req.body.id});

    if (!user) {
      const [firstName, lastName] = req.body.name.split(' ');

      user = new User({
        username: req.body.id,
        password: nanoid(),
        facebookId: req.body.id,
        firstName,
        lastName,
      });
    }

    user.generateToken();
    await user.save();

    return res.send(user);
  } catch (e) {
    return res.sendStatus(401);
  }
});

module.exports = router;

const mongoose = require('mongoose');
const config = require('./config');
const nanoid = require('nanoid');

const Artist = require('./models/Artist');
const Album = require('./models/Album');
const Track = require('./models/Track');
const User = require('./models/User');

const run = async () => {
  await mongoose.connect(config.dbUrl, config.mongoOptions);

  const connection = mongoose.connection;

  const collections = await connection.db.collections();

  for (let collection of collections) {
    await collection.drop();
  }

  const user = await User.create(
    {
      username: 'user',
      password: '123',
      role: 'user',
      token: nanoid(),
      displayName: 'Anonymous'
    },
    {
      username: 'admin',
      password: '123',
      role: 'admin',
      token: nanoid(),
      displayName: 'Admin'
    },
  );

  const artists = await Artist.create(
    {
      user: user[1]._id,
      name: 'Eminem',
      photo: 'emin.jpeg',
      description: 'российская хоррор-панк-группа из Санкт-Петербурга.' +
        ' Группа была образована в Ленинграде в 1988 году.' +
        ' После смерти её лидера и одного из основателей Михаила Горшенёва 19 июля 2013 года выступает только в рок-опере TODD.' +
        ' Выделяется своим необычным для классического панк-рока стилем.'
    },
    {
      user: user[1]._id,
      name: 'ACDC',
      photo: 'ACDC.jpg',
      description: 'австралийская рок-группа, сформированная в Сиднее в ноябре 1973 года выходцами из Шотландии, ' +
        'братьями Малькольмом и Ангусом Янгами.'
    },
    {
      user: user[0]._id,
      name: 'Rammstein',
      photo: 'rammstein.jpg',
      description: ' немецкая рок-группа, образованная в январе 1994 года в Берлине. ' +
        'Музыкальный стиль группы относится к жанру индастриал-метала.' +
        ' Основные черты творчества группы: специфический ритм, в котором выдержана большая часть композиций, ' +
        'и эпатирующие тексты песен.'
    },
  );

  const albums = await Album.create(
    {
      user: user[1]._id,
      title: 'Как в старой сказке',
      artist: artists[0]._id,
      date: 2001,
      image: 'skazka.jpg'
    },
    {
      user: user[1]._id,
      title: 'Highway to Hell',
      artist: artists[1]._id,
      date: 1979,
      image: 'acdc.png'
    },
    {
      user: user[0]._id,
      title: 'Mutter',
      artist: artists[2]._id,
      date: 2001,
      image: 'mutter.jpeg'
    },
    {
      user: user[1]._id,
      title: 'Король и шут',
      artist: artists[0]._id,
      date: 1996,
      image: 'korol.jpg'
    },
    {
      user: user[1]._id,
      title: 'The Razor’s Edge',
      artist: artists[1]._id,
      date: 1990,
      image: 'razors_edge.jpg'
    },
    {
      user: user[0]._id,
      title: 'Reise Reise',
      artist: artists[2]._id,
      date: 2004,
      image: 'reise.png'
    },
  );

  await Track.create(
    {
      user: user[1]._id,
      track_number: 1,
      title: 'Проклятый старый дом',
      album: albums[0]._id,
      time: '4:17',
    },
    {
      user: user[1]._id,
      track_number: 2,
      title: 'Тайна хозяйки старинных часов',
      album: albums[0]._id,
      time: '3:31',
    },
    {
      user: user[1]._id,
      track_number: 3,
      title: 'Возвращение колдуна',
      album: albums[0]._id,
      time: '3:15',
    },
    {
      user: user[1]._id,
      track_number: 4,
      title: 'Кузьма и барин',
      album: albums[0]._id,
      time: '3:08',
    },
    {
      user: user[1]._id,
      track_number: 5,
      title: 'Пират',
      album: albums[0]._id,
      time: '3:55',
    },
    {
      user: user[1]._id,
      track_number: 1,
      title: 'Highway to Hell',
      album: albums[1]._id,
      time: '3:28',
    },
    {
      user: user[1]._id,
      track_number: 2,
      title: ' If You Want Blood ',
      album: albums[1]._id,
      time: '4:37',
    },
    {
      user: user[1]._id,
      track_number: 3,
      title: 'Touch Too Much',
      album: albums[1]._id,
      time: '4:26',
    },
    {
      user: user[1]._id,
      track_number: 4,
      title: 'Girls Got Rhythm',
      album: albums[1]._id,
      time: '3:24',
    },
    {
      user: user[1]._id,
      track_number: 5,
      title: 'Walk All Over You',
      album: albums[1]._id,
      time: '5:09',
    },
    {
      user: user[0]._id,
      track_number: 1,
      title: 'Mutter',
      album: albums[2]._id,
      time: '4:32',
    },
    {
      user: user[0]._id,
      track_number: 2,
      title: 'Ich Will',
      album: albums[2]._id,
      time: '3:38',
    },
    {
      user: user[0]._id,
      track_number: 3,
      title: 'Feuer Frei',
      album: albums[2]._id,
      time: '3:11',
    },
    {
      user: user[0]._id,
      track_number: 4,
      title: 'Mein Herz Brennt',
      album: albums[2]._id,
      time: '4:40',
    },
    {
      user: user[0]._id,
      track_number: 5,
      title: 'Links 2-3-4',
      album: albums[2]._id,
      time: '3:38',
    },
    {
      user: user[1]._id,
      track_number: 1,
      title: 'Король и шут',
      album: albums[3]._id,
      time: '2:38',
    },
    {
      user: user[1]._id,
      track_number: 2,
      title: 'Два друга и разбойники',
      album: albums[3]._id,
      time: '2:12',
    },
    {
      user: user[1]._id,
      track_number: 3,
      title: 'Сапоги мертвеца',
      album: albums[3]._id,
      time: '2:27',
    },
    {
      user: user[1]._id,
      track_number: 4,
      title: 'Охотник',
      album: albums[3]._id,
      time: '2:33',
    },
    {
      user: user[1]._id,
      track_number: 5,
      title: 'Паника в селе',
      album: albums[3]._id,
      time: '3:16',
    },
    {
      user: user[1]._id,
      track_number: 1,
      title: 'Thunderstruck',
      album: albums[4]._id,
      time: '4:53',
    },
    {
      user: user[1]._id,
      track_number: 2,
      title: 'Fire Your Guns',
      album: albums[4]._id,
      time: '2:54',
    },
    {
      user: user[1]._id,
      track_number: 3,
      title: 'Moneytalks',
      album: albums[4]._id,
      time: '3:46',
    },
    {
      user: user[1]._id,
      track_number: 4,
      title: 'The Razors Edge',
      album: albums[4]._id,
      time: '4:22',
    },
    {
      user: user[1]._id,
      track_number: 5,
      title: 'Mistress For Christmas',
      album: albums[4]._id,
      time: '4:00',
    },
    {
      user: user[0]._id,
      track_number: 1,
      title: 'REISE, REISE',
      album: albums[5]._id,
      time: '4:11',
    },
    {
      user: user[0]._id,
      track_number: 2,
      title: 'MEIN TEIL',
      album: albums[5]._id,
      time: '4:33',
    },
    {
      user: user[0]._id,
      track_number: 3,
      title: 'DALAI LAMA',
      album: albums[5]._id,
      time: '5:39',
    },
    {
      user: user[0]._id,
      track_number: 4,
      title: 'Keine Lust',
      album: albums[5]._id,
      time: '3:43',
    },
    {
      user: user[0]._id,
      track_number: 5,
      title: 'LOS',
      album: albums[5]._id,
      time: '4:24',
    },
  );

  await connection.close();
};

run().catch(error => {
  console.log('Something went wrong', error);
});
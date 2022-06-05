const express = require('express');
const router = express.Router();
const Album = require('../../bin/generator/db/Album');
const Artist = require('../../bin/generator/db/Artist');
const Song = require('../../bin/generator/db/Song');
const generateFakeDate = require('../../bin/generator/scripts/generateFakeDate');
const getRandomIntInclusive = require('../../bin/generator/scripts/getRandomIntInclusive');
const shuffle = require('../../bin/generator/scripts/shuffle');
const findArtists = require('../../middlewares/generator/findArtists');
const processParams = require('../../middlewares/generator/processParams');
const fs = require("fs");

// Pour la generation d'une date sur un artiste
router.get('/group/:name/dates', async function (req, res, next) {
  const artist = await Artist.findOne({ name: req.params.name });

  if (!artist) {
    return res.status(404).json({ error: 'Artist not found' });
  }

  if (!artist.deathDate && req.query.typeDate === 'death') {
    return res.status(404).json({ error: 'This artist is alive !' });
  }

  res.status(200).json({ birthDate: artist.birthDate, endDate: artist.deathDate, ended: artist.deathDate !== null });
});

// Pour la generation d'une question sur une chanson d'un artiste
router.get('/group/:name/chanson', async function (req, res, next) {
  const artist = await Artist.findOne({ name: req.params.name });

  if (!artist) {
    return res.status(404).json({ error: 'Artist not found' });
  }

  const song = await Song.findOne({ artist: artist._id });

  if (!song) {
    return res.status(404).json({ error: 'Song not found' });
  }

  res.status(200).json({ song: song.title });
});

router.get('/group/:name/album', async function (req, res, next) {
  const artist = await Artist.findOne({ name: req.params.name });

  if (!artist) {
    return res.status(404).json({ error: 'Artist not found' });
  }

  const album = await Album.findOne({ artist: artist._id });

  if (!album) {
    return res.status(404).json({ error: 'Song not found' });
  }

  res.status(200).json({ song: album.title });
});

router.get('/group/:name/all', async function (req, res, next) {
  const artist = await Artist.findOne({ name: req.params.name, birthDate: { $ne: null } });

  if (!artist || !artist.birthDate) {
    return res.status(404).json({ error: 'Artist not found' });
  }

  const questions = [];

  const fakeDates = generateFakeDate(artist.birthDate);

  let random = Math.floor(Math.random() * 4);

  fakeDates.splice(random, 0, artist.birthDate);

  questions.push({ question: `Quel est la date de naissance de ${artist.name} ?`, proposition: fakeDates, indexreponse: random });

  const album = await Album.findOne({ artist: artist._id });

  if (!album) {
    return res.status(404).json({ error: 'Album not found' });
  }

  const countAlbum = await Album.countDocuments({ artist: { $ne: artist._id } });

  const moreAlbums = await Album.find({ artist: { $ne: artist._id } }).skip(getRandomIntInclusive(0, countAlbum - 4)).limit(3);

  const fakeAlbums = moreAlbums.map(a => a.title);

  random = Math.floor(Math.random() * 4);

  fakeAlbums.splice(random, 0, album.title);

  questions.push({ question: `Quelle album a été réalisé par  "${artist.name}" ?`, proposition: fakeAlbums, indexreponse: random });

  const song = await Song.findOne({ artist: artist._id });

  if (!song) {
    return res.status(404).json({ error: 'Song not found' });
  }

  const countSong = await Song.countDocuments({ artist: { $ne: artist._id } });

  const moreSongs = await Song.find({ artist: { $ne: artist._id } }).skip(getRandomIntInclusive(0, countSong - 4)).limit(3);

  const fakeSongs = moreSongs.map(s => s.title);

  random = Math.floor(Math.random() * 4);

  fakeAlbums.splice(random, 0, album.title);

  questions.push({ question: `Quelle chanson a été réalisée par  "${artist.name}" ?`, proposition: fakeSongs, indexreponse: random });

  res.status(200).json(questions);
});

// Pour la generation de X question sur des dates
router.get('/questions/gen10/artistDates', processParams, findArtists, async function (req, res, next) {
  const questions = [];
  const artists = [];

  for (const artist of req.artistsBD) {
    if (artists.length >= parseInt(req.query.nbQuestion)) {
      break;
    }

    if (!artist.birthDate) continue;

    if (req.query.minDate && !req.query.maxDate) {
      if (artist.birthDate >= req.query.minDate) {
        artists.push({ name: artist.name, birthDate: artist.birthDate });
        console.log('Artiste: ' + artist.name + ", Nombre d'artistes: " + artists.length);
      }
    }

    if (req.query.minDate && req.query.maxDate) {
      if (artist.birthDate >= req.query.minDate && artist.birthDate <= req.query.maxDate) {
        artists.push({ name: artist.name, birthDate: artist.birthDate });
        console.log('Artiste: ' + artist.name + ", Nombre d'artistes: " + artists.length);
      }
    }

    if (!req.query.minDate && req.query.maxDate) {
      if (artist.birthDate <= req.query.maxDate) {
        artists.push({ name: artist.name, birthDate: artist.birthDate });
        console.log('Artiste: ' + artist.name + ", Nombre d'artistes: " + artists.length);
      }
    }

    if (!req.query.minDate && !req.query.maxDate) {
      artists.push({ name: artist.name, birthDate: artist.birthDate });
      console.log('Artiste: ' + artist.name + ", Nombre d'artistes: " + artists.length);
    }

    // artists.push({ name: artist.name, birthDate: artist.birthDate });
    // console.log('Artiste: ' + artist.name + ", Nombre d'artistes: " + artists.length);
  }

  for (const artist of artists) {
    const random = Math.floor(Math.random() * 4);

    const fakeDates = generateFakeDate(artist.birthDate);

    fakeDates.splice(random, 0, artist.birthDate);

    if (fakeDates.length === 4) questions.push({ question: `Quel est la date de naissance de ${artist.name} `, proposition: fakeDates, indexreponse: random });
  }

  res.status(200).json(questions);
});

router.get('/questions/gen10/artistAlbums', processParams, findArtists, async function (req, res, next) {
  const questions = [];
  const artists = [];
  const albumList = [];

  for (const artist of req.artistsBD) {
    const albums = await Album.find({ artist: artist._id });

    if (!albums || albums.length <= 0) {
      continue;
    }

    if ((albumList.length >= (parseInt(req.query.nbQuestion) * 3) && artists.length >= req.query.nbQuestion)) {
      break;
    }

    if (artists.length * 3 < albumList.length) {
      if (req.query.minDate && !req.query.maxDate) {
        if (artist.birthDate >= req.query.minDate && artist.birthDate) {
          artists.push({ name: artist.name, song: albums[0].title });
          console.log('Artiste: ' + artist.name + ", Nombre d'artistes: " + artists.length);
        }
      }

      if (req.query.minDate && req.query.maxDate) {
        if (artist.birthDate >= req.query.minDate && artist.birthDate <= req.query.maxDate && artist.birthDate) {
          artists.push({ name: artist.name, song: albums[0].title });
          console.log('Artiste: ' + artist.name + ", Nombre d'artistes: " + artists.length);
        }
      }

      if (!req.query.minDate && req.query.maxDate) {
        if (artist.birthDate <= req.query.maxDate && artist.birthDate) {
          artists.push({ name: artist.name, song: albums[0].title });
          console.log('Artiste: ' + artist.name + ", Nombre d'artistes: " + artists.length);
        }
      }

      if (!req.query.minDate && !req.query.maxDate) {
        artists.push({ name: artist.name, song: albums[0].title });
        console.log('Artiste: ' + artist.name + ", Nombre d'artistes: " + artists.length);
      }

      // artists.push({ name: artist.name, song: albums[0].title });
      // console.log('Artiste: ' + artist.name + ", Nombre d'artistes: " + artists.length);
    } else {
      albumList.push(albums[0].title);
      console.log('Musique: ' + albums[0].title + ", Nombre d'albums: " + albumList.length);
    }
  }

  for (const artist of artists) {
    const random = Math.floor(Math.random() * 4);

    const fakeAlbums = albumList.splice(0, 3);

    fakeAlbums.splice(random, 0, artist.song);

    if (fakeAlbums.length === 4) questions.push({ question: `Quelle album a été réalisé par "${artist.name}" ?`, proposition: fakeAlbums, indexreponse: random });
  }
  console.log('Taille liste artiste from BD:' + req.artistsBD.length);
  console.log('Taille liste artiste:' + artists.length);
  console.log('DONE');

  res.status(200).json(questions);
});

// Pour la generation de X question sur des chansons
router.get('/questions/gen10/artistSongs', processParams, findArtists, async function (req, res, next) {
  const questions = [];

  const songsDB = await Song.find();

  for (const artist of req.artistsBD) {
    if (req.query.minDate) {
      if (artist.birthDate < req.query.minDate || !artist.birthDate) {
        continue;
      }
    }

    if (req.query.maxDate) {
      if (artist.birthDate > req.query.maxDate || !artist.birthDate) {
        continue;
      }
    }

    const songs = await Song.find({ artist: artist._id });

    if (!songs || songs.length <= 0) {
      continue;
    }

    const random = Math.floor(Math.random() * 4);

    const fakeSongs = [];

    shuffle(songsDB);

    for (const song of songsDB) {
      if (fakeSongs.length > 3) break;

      if (song.artist !== artist._id) fakeSongs.push(song.title);
    }

    fakeSongs.splice(random, 0, songs[0].title);

    questions.push({ question: `Quelle chanson a été chanté par "${artist.name}" ?`, proposition: fakeSongs, indexreponse: random });

    console.log('Artiste: ' + artist.name + ', Nombre de Questions: ' + questions.length);

    if (questions.length >= parseInt(req.query.nbQuestion)) break;
  }

  res.status(200).json(questions);
});

// Pour la generation de X question sur des dates, albums et chansons
router.get('/questions/gen10/allRandom', processParams, findArtists, async function (req, res, next) {
  const questions = [];
  let nbQuestionDate = Math.floor(Math.random() * req.query.nbQuestion);
  console.log('nb question a date : ' + nbQuestionDate);
  let nbQuestionAlbum = Math.floor(Math.random() * (req.query.nbQuestion - nbQuestionDate));
  console.log('nb question a album : ' + nbQuestionAlbum);
  let nbQuestionChanson = parseInt(req.query.nbQuestion) - nbQuestionDate - nbQuestionAlbum;
  console.log('nb question a chanson : ' + nbQuestionChanson);

  for (const artist of req.artistsBD) {
    if (req.query.minDate) {
      if (!artist.birthDate || artist.birthDate < req.query.minDate) {
        continue;
      }
    }

    if (req.query.maxDate) {
      if (!artist.birthDate || artist.birthDate > req.query.maxDate) {
        continue;
      }
    }

    if (nbQuestionDate > 0) {
      if (!artist.birthDate) continue;

      const fakeDates = generateFakeDate(artist.birthDate);

      const random = Math.floor(Math.random() * 4);

      fakeDates.splice(random, 0, artist.birthDate);

      questions.push({ question: `Quel est la date de naissance de ${artist.name} ?`, proposition: fakeDates, indexreponse: random });
      nbQuestionDate--;
    } else if (nbQuestionAlbum > 0) {
      const album = await Album.findOne({ artist: artist._id });

      if (!album) {
        continue;
      }

      const countAlbums = await Album.countDocuments({ artist: { $ne: artist._id } });

      const albums = await Album.find({ artist: { $ne: artist._id } }).skip(getRandomIntInclusive(0, countAlbums - 4)).limit(3);

      const fakeAlbums = albums.map(a => a.title);

      const random = Math.floor(Math.random() * 4);

      fakeAlbums.splice(random, 0, album.title);

      questions.push({ question: `Quelle album a été réalisé par  "${artist.name}" ?`, proposition: fakeAlbums, indexreponse: random });
      nbQuestionAlbum--;
    } else if (nbQuestionChanson > 0) {
      const song = await Song.findOne({ artist: artist._id });

      if (!song) {
        continue;
      }

      const countSongs = await Song.countDocuments({ artist: { $ne: artist._id } });

      const songs = await Song.find({ artist: { $ne: artist._id } }).skip(getRandomIntInclusive(0, countSongs - 4)).limit(3);

      const fakeSongs = songs.map(a => a.title);

      const random = Math.floor(Math.random() * 4);

      fakeSongs.splice(random, 0, song.title);

      questions.push({ question: `Quelle chanson a été réalisée par  "${artist.name}" ?`, proposition: fakeSongs, indexreponse: random });
      nbQuestionChanson--;
    } else {
      return res.status(200).json(questions);
    }
  }

  res.status(200).json(questions);
});


// Pour la génération de x questions faciles de type aléatoire 
router.get('/questions/gen10/test', processParams, findArtists, async function (req, res, next) {
  const questions = [];
  let nbQuestionToGenerate = parseInt(req.query.nbQuestion);
  let questionType;
  let random;


  for (const artist of req.artistsBD) {
    questionType = Math.floor(Math.random() * 3);

    switch (questionType) {
      case 0:
        if (!artist.birthDate) continue;
        const fakeDates = generateFakeDate(artist.birthDate);

        random = Math.floor(Math.random() * 4);

        fakeDates.splice(random, 0, artist.birthDate);
        questions.push({ question: `Quelle est la date de naissance de ${artist.name} ?`, proposition: fakeDates, indexreponse: random });
        nbQuestionToGenerate--;
        break;

      case 1:
        const album = await Album.findOne({ artist: artist._id });
        if (!album) {
          continue;
        }
        const countAlbums = await Album.countDocuments({ artist: { $ne: artist._id } });
        const albums = await Album.find({ artist: { $ne: artist._id } }).skip(getRandomIntInclusive(0, countAlbums - 4)).limit(3);
        const fakeAlbums = albums.map(a => a.title);
        random = Math.floor(Math.random() * 4);

        fakeAlbums.splice(random, 0, album.title);
        questions.push({ question: `Quel album a été réalisé par  "${artist.name}" ?`, proposition: fakeAlbums, indexreponse: random });
        nbQuestionToGenerate--;
        break;

      case 2:
        const song = await Song.findOne({ artist: artist._id });
        if (!song) {
          continue;
        }
        const countSongs = await Song.countDocuments({ artist: { $ne: artist._id } });
        const songs = await Song.find({ artist: { $ne: artist._id } }).skip(getRandomIntInclusive(0, countSongs - 4)).limit(3);
        const fakeSongs = songs.map(a => a.title);
        random = Math.floor(Math.random() * 4);

        fakeSongs.splice(random, 0, song.title);
        questions.push({ question: `Quelle chanson a été réalisée par  "${artist.name}" ?`, proposition: fakeSongs, indexreponse: random });
        nbQuestionToGenerate--;
    }

    if (nbQuestionToGenerate == 0) {
      break;
    }
  }

  fs.writeFile("./questionMusique.json", JSON.stringify(questions), (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync("./questionMusique.json", "utf8"));
    }
  });

  res.status(200).json(questions);

});

router.get('/fake/chanson', async function (req, res, next) {
  const countSongs = await Song.countDocuments();

  const songs = await Song.find().skip(getRandomIntInclusive(0, countSongs - 4)).limit(3);

  const fakeChansons = songs.map(s => s.title);

  res.status(200).json({ fakeChansons: fakeChansons });
});

router.get('/fake/album', async function (req, res, next) {
  const countAlbums = await Album.countDocuments();

  const albums = await Album.find().skip(getRandomIntInclusive(0, countAlbums - 4)).limit(3);

  const fakeChansons = albums.map(a => a.title);

  res.status(200).json({ fakeChansons: fakeChansons });
});

router.get('/questions/gen10/songArtists', processParams, findArtists, async function (req, res, next) {
  const questions = [];

  for (const artist of req.artistsBD) {
    const song = await Song.findOne({ artist: artist._id });

    if (!song) {
      continue;
    }

    const random = Math.floor(Math.random() * 4);

    const fakeArtists = [];

    for (let i = getRandomIntInclusive(0, req.artistsBD.length - 5); i > 0; i++) {
      if (fakeArtists.length > 3) break;

      if (req.artistsBD[i] !== artist) fakeArtists.push(artist.name);
    }

    fakeArtists.splice(random, 0, artist.name);

    questions.push({ question: `Qui a interprété "${song.title}" ?`, proposition: fakeArtists, indexreponse: random });

    console.log('Song: ' + song.title + ', Nombre de Questions: ' + questions.length);

    if (questions.length >= parseInt(req.query.nbQuestion ? req.query.nbQuestion : 10)) break;
  }

  res.status(200).json(questions);
});
module.exports = router;

const got = require('got');
const mongoose = require('mongoose');
const Album = require('./db/Album');
const Artist = require('./db/Artist');
const Genre = require('./db/Genre');
const Song = require('./db/Song');
const fs = require('fs');

let loadTestData = false;
let artists = [
  "ABBA",
"AC/DC",
"Adele",
"Akon",
"Alicia Keys",
"Ariana Grande",
"Avicii",
"Avril Lavigne",
"Beyoncé",
"Blink-182",
"Bob Marley & The Wailers",
"Bring Me The Horizon",
"Britney Spears",
"Bruno Mars",
"Calvin Harris",
"Camila Cabello",
"Carly Rae Jepsen",
"Charli XCX",
"Chris Brown",
"Christina Aguilera"
];

process.argv.forEach((val, index) => {
  //console.log(`${index}: ${val}`);
  if (index == 2 && val == "testData") {
    loadTestData = true;
  }
});
/*
fs.readFile('./bin/artists.json', (err, data) => {
  if (err) throw err;
  let artists = JSON.parse(data);
  //console.log(artists);
  //artists.forEach((artist) => console.log(artist));
});*/

//console.log(artists)
//artists.forEach((artist) => console.log(artist));

mongoose.connect('mongodb://localhost:27017/QuizzGen');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MongoDB Connected');
  populate();
});

async function populate() {
  await Artist.deleteMany();
  await Album.deleteMany();
  await Song.deleteMany();
  await Genre.deleteMany();

  const artistsCompare = [];
  const genresCompare = [];
  const albumsCompare = [];
  const songsCompare = [];

  let increment;
  let nbLoops;
  let parameter;

  if(loadTestData){
    increment = 1;
    nbLoops = artists.length;
  }
  else{
    increment = 200;
    nbLoops = 77491;
  }
  
  console.log("increment : " + increment);
  console.log("nbLoops : " + nbLoops);

  for (let i = 0; i < nbLoops; i += increment) {
    if(loadTestData){
      parameter = "name/" + artists[i];
    }
    else{
      parameter = i;
    }
    console.log("parameter : " + parameter);
    console.log(`https://wasabi.i3s.unice.fr/api/v1/artist_all/${parameter}`);
    const { body } = await got(`https://wasabi.i3s.unice.fr/api/v1/artist_all/${parameter}`, {
      responseType: 'json'
    });

    if (body.error) {
      continue;
    }
    
    console.log(body);
    await Promise.all(body.map(async artist => {
      if (!artist || artist === null || artist === 'null' || !artist.gender || artist.gender === '') {
        return;
      }

      if (artistsCompare.indexOf(artist.name) !== -1) {
        return;
      }

      artistsCompare.push(artist.name);

      let a = new Artist();
      a.name = artist.name;
      a.deezerFans = artist.deezerFans;
      if (artist.lifeSpan && artist.lifeSpan.begin && !artist.lifeSpan.begin.includes('?')) a.birthDate = artist.lifeSpan.begin;
      if (artist.lifeSpan && artist.lifeSpan.end && !artist.lifeSpan.end.includes('?')) a.deathDate = artist.lifeSpan.end;
      if (artist.genres && artist.genres.length > 0) {
        const genres = artist.genres.map(g => {
          const found = genresCompare.find(e => e.name === g);
          if (found !== undefined) {
            return found;
          }

          return { name: g };
        });

        const newGenres = genres.filter(g => g._id === undefined);

        const savedGenres = await Genre.insertMany(newGenres);

        genresCompare.push(...savedGenres);

        a.genres = savedGenres.concat(genres.filter(g => g._id !== undefined));
      }

      try {
        a = await a.save();

        if (!a) {
          return;
        }
      } catch (error) {
        console.error(error);
        return;
      }

      artist.albums.forEach(async album => {
        if (!album || album === null || album === 'null' || !album.songs || album.songs.length <= 0 || !album.title || album.title.toLowerCase().includes('song')) {
          return;
        }

        if (albumsCompare.indexOf(album.title) !== -1) {
          return null;
        }

        albumsCompare.push(album.title);

        let alb = new Album();
        alb.title = album.title;
        alb.artist = a._id;
        if (album.publicationDate) alb.releaseDate = album.publicationDate;

        try {
          alb = await alb.save();

          if (!alb) {
            return;
          }
        } catch (error) {
          console.error(error);
          return;
        }

        const songs = album.songs.map(song => {
          if (!song || song === null || song === 'null' || !song.title || song.title.toLowerCase().includes('song')) {
            return null;
          }

          if (songsCompare.indexOf(song.title) !== -1) {
            return null;
          }

          songsCompare.push(song.title);

          const s = new Song();
          s.title = song.title;
          s.artist = a._id;
          s.album = alb._id;
          if (song.publicationDate) s.releaseDate = song.publicationDate;

          return s;
        }).filter(s => s !== null);

        const savedSongs = await Song.insertMany(songs);

        alb.songs = savedSongs;

        try {
          alb = await alb.save();
        } catch (error) {
          console.error(error);
        }
      });
    }));
    if(loadTestData){
      console.log(i + 1 + " artists done out of " + artists.length);
    }
    else{
      console.log(Math.min((i + 200), 77491) + ' artists done out of 77491');
    }
    
  }
  console.log('DONE');
  process.exit(0);
}

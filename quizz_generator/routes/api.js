const express = require('express');
const router = express.Router();
const got = require('got');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('api/index.html.twig', { title: 'Express' });
});

// Pour la generation d'une date sur un artiste
router.get('/group/:name/dates', async function (req, res, next) {
  const { body } = await got('https://wasabi.i3s.unice.fr/api/v1/artist/name/' + req.params.name, {
    responseType: 'json'
  });

  if (!body || !body.lifeSpan || !body.lifeSpan.begin) {
    return res.status(404).json({ error: 'Artist or lifespan not found' });
  }

  res.status(200).json({ birthDate: body.lifeSpan.begin, endDate: body.lifeSpan.end, ended: body.lifeSpan.ended });
});

// Pour la generation d'une question sur une chanson d'un artiste
router.get('/group/:name/chanson', async function (req, res, next) {
  const { body } = await got('https://wasabi.i3s.unice.fr/api/v1/artist_all/name/' + req.params.name, {
    responseType: 'json'
  });
  if (body && body.albums && body.albums.length !== 0) {
    let trouve = false;
    let song;
    while (trouve === false) {
      const i = Math.floor(Math.random() * body.albums.length);
      if (body.albums[i].songs.length !== 0) {
        song = body.albums[i].songs[Math.floor(Math.random() * body.albums[i].songs.length)].title;
        trouve = true;
      }
    }
    if (trouve === true) {
      res.status(200).json({ song: song });
    }
  } else {
    return res.status(404).json({ error: 'Artist or song not found' });
  }
});

router.get('/group/:name/album', async function (req, res, next) {
  const { body } = await got('https://wasabi.i3s.unice.fr/api/v1/artist_all/name/' + req.params.name, {
    responseType: 'json'
  });
  if (body && body.albums && body.albums.length !== 0) {
    let song;
    let i = 0;
    do {
      song = body.albums[i].title;
      i++;
    } while (song.toLowerCase() === 'other songs' && i < body.albums.length);

    if (song.toLowerCase() !== 'other songs') {
      res.status(200).json({ song: song });
    }
  } else {
    return res.status(404).json({ error: 'Artist or album not found' });
  }
});

router.get('/group/:name/all', async function (req, res, next) {
  const questions = [];
  const { body } = await got('https://wasabi.i3s.unice.fr/api/v1/artist_all/name/' + req.params.name, {
    responseType: 'json'
  });

  // Question a Date
  if (!body || !body.lifeSpan || !body.lifeSpan.begin) {
    return res.status(404).json({ error: 'Artist or lifespan not found' });
  } else {
    const fakeDates = generateFakeDate(body.lifeSpan.begin);

    const random = Math.floor(Math.random() * 4);

    fakeDates.splice(random, 0, body.lifeSpan.begin);

    questions.push({ question: `Quel est la date de naissance de ${body.name} ?`, proposition: fakeDates, 'index-reponse': random });
  }

  // Question a Album
  if (body && body.albums && body.albums.length !== 0) {
    let album;
    let i = 0;
    do {
      if (body.albums[i].title) {
        album = body.albums[i].title;
      }
      i++;
    } while (album.toLowerCase() === 'other songs' && i < body.albums.length);

    if (album.toLowerCase() !== 'other songs') {
      const random = Math.floor(Math.random() * 4);
      const fakeAlbums = [];
      const pagesVisited = [];

      while (fakeAlbums.length < 3) {
        let skip;
        do {
          skip = Math.floor(Math.random() * 100) * 200;
        } while (pagesVisited.indexOf(skip) !== -1);

        pagesVisited.push(skip);
        const { body } = await got(`https://wasabi.i3s.unice.fr/api/v1/artist_all/${skip}`, {
          responseType: 'json'
        });

        for (const artist of body) {
          if (fakeAlbums.length < 3 && artist && artist !== null && artist !== 'null' && artist.gender && artist.gender !== '' && artist.albums && artist.albums.length !== 0) {
            let song;
            let i = 0;
            do {
              if (artist.albums[i].title) {
                song = artist.albums[i].title;
              }
              i++;
            } while (song.toLowerCase() === 'other songs' && i < artist.albums.length);

            if (song.toLowerCase() !== 'other songs') {
              fakeAlbums.push(song);
            }
          } else if (fakeAlbums.length < 3 && artist && artist !== null && artist !== 'null' && artist.albums && artist.albums.length > 1) {
            let song;
            let i = 0;
            do {
              if (artist.albums[i].title) {
                song = artist.albums[i].title;
              }
              i++;
            } while (song.toLowerCase() === 'other songs' && i < artist.albums.length);

            if (song.toLowerCase() !== 'other songs') {
              fakeAlbums.push(song);
            }
          }
        }
      }
      fakeAlbums.splice(random, 0, album);
      questions.push({ question: `Quelle album a été réalisé par  "${body.name}" ?`, proposition: fakeAlbums, 'index-reponse': random });
    } else {
      return res.status(404).json({ error: 'Artist or album not found' });
    }
  }

  // Question a Chanson
  if (body && body.albums && body.albums.length !== 0) {
    let album;
    let i = 0;
    do {
      album = body.albums[i].title;
      i++;
    } while (album.toLowerCase() === 'other songs' && i < body.albums.length);

    if (album.toLowerCase() !== 'other songs') {
      const random = Math.floor(Math.random() * 4);
      const fakeChansons = [];
      const pagesVisited = [];

      while (fakeChansons.length < 3) {
        let skip;
        do {
          skip = Math.floor(Math.random() * 100) * 200;
        } while (pagesVisited.indexOf(skip) !== -1);

        pagesVisited.push(skip);
        const { body } = await got(`https://wasabi.i3s.unice.fr/api/v1/artist_all/${skip}`, {
          responseType: 'json'
        });

        for (const artist of body) {
          if (fakeChansons.length < 3 && artist && artist !== null && artist !== 'null' && artist.gender && artist.gender !== '' && artist.albums && artist.albums.length !== 0) {
            let song;
            let i = 0;
            do {
              song = artist.albums[i].songs[0].title;
              i++;
            } while (song.toLowerCase() === 'other songs' && i < artist.albums.length);

            if (song.toLowerCase() !== 'other songs') {
              fakeChansons.push(song);
            }
          } else if (fakeChansons.length < 3 && artist && artist !== null && artist !== 'null' && artist.albums && artist.albums.length > 1) {
            let song;
            let i = 0;
            do {
              song = artist.albums[i].songs[0].title;
              i++;
            } while (song.toLowerCase() === 'other songs' && i < artist.albums.length);

            if (song.toLowerCase() !== 'other songs') {
              fakeChansons.push(song);
            }
          }
        }
      }
      fakeChansons.splice(random, 0, album);
      questions.push({ question: `Quelle chanson a été réalisé par  "${body.name}" ?`, proposition: fakeChansons, 'index-reponse': random });
    } else {
      return res.status(404).json({ error: 'Artist or album not found' });
    }
  }
  res.status(200).json(questions);
});

// Pour la generation de X question sur des dates
router.get('/questions/gen10/artistDates', async function (req, res, next) {
  const questions = [];
  const artists = [];
  const pagesVisited = [];
  while (artists.length < parseInt(req.query.nbQuestion)) {
    let skip;
    do {
      skip = Math.floor(Math.random() * 100);
    } while (pagesVisited.indexOf(skip) !== -1);

    pagesVisited.push(skip);

    const { body } = await got('https://wasabi.i3s.unice.fr/api/v1/artist/count/album?skip=' + skip + '&limit=10', {
      responseType: 'json'
    });
    for (const artist of body) {
      const { body } = await got(`https://wasabi.i3s.unice.fr/api/v1/artist/name/${artist.name}`, {
        responseType: 'json'
      });

      if (body && body !== null && body !== 'null' && body.gender && body.gender !== '' && body.lifeSpan && body.lifeSpan.begin) {
        artists.push({ name: body.name, lifeSpan: body.lifeSpan });
        if (artists.length === parseInt(req.query.nbQuestion)) break;
      }
    }
  }

  artists.forEach(artist => {
    const fakeDates = generateFakeDate(artist.lifeSpan.begin);

    const random = Math.floor(Math.random() * 4);

    fakeDates.splice(random, 0, artist.lifeSpan.begin);

    questions.push({ question: `Quel est la date de naissance de ${artist.name} ?`, proposition: fakeDates, 'index-reponse': random });
  });

  res.status(200).json(questions);
});

// Pour la generation de X question sur des chansons
router.get('/questions/gen10/artistAlbums', async function (req, res, next) {
  const questions = [];
  const artists = [];
  const pagesVisited = [];
  const albumList = [];

  while (artists.length < req.query.nbQuestion || albumList.length < (parseInt(req.query.nbQuestion) * 3)) {
    let skip;
    do {
      skip = Math.floor(Math.random() * 100) * 200;
    } while (pagesVisited.indexOf(skip) !== -1);

    pagesVisited.push(skip);
    const { body } = await got(`https://wasabi.i3s.unice.fr/api/v1/artist_all/${skip}`, {
      responseType: 'json'
    });

    for (const artist of body) {
      if (artists.length < req.query.nbQuestion && artist && artist !== null && artist !== 'null' && artist.gender && artist.gender !== '' && artist.albums && artist.albums.length !== 0) {
        let song;
        let i = 0;
        do {
          song = artist.albums[i].title;
          i++;
        } while (song.toLowerCase() === 'other songs' && i < artist.albums.length);

        if (song.toLowerCase() !== 'other songs') {
          artists.push({ name: artist.name, song: song });
          console.log('Artiste: ' + artist.name + ", Nombre d'artistes: " + artists.length);
        }
      } else if (albumList.length < (parseInt(req.query.nbQuestion) * 3) && artist && artist !== null && artist !== 'null' && artist.albums && artist.albums.length > 1) {
        let song;
        let i = 0;
        do {
          song = artist.albums[i].title;
          i++;
        } while (song.toLowerCase() === 'other songs' && i < artist.albums.length);

        if (song.toLowerCase() !== 'other songs') {
          albumList.push(song);
          console.log('Chanson: ' + song + ', Nombre de musiques: ' + albumList.length);
        }
      }
    }
  }

  for (const artist of artists) {
    const random = Math.floor(Math.random() * 4);

    const fakeAlbums = albumList.splice(0, 3);

    fakeAlbums.splice(random, 0, artist.song);

    questions.push({ question: `Quelle album a été réalisé par  "${artist.name}" ?`, proposition: fakeAlbums, 'index-reponse': random });
  }

  res.status(200).json(questions);
});

// Pour la generation de X question sur des chansons
router.get('/questions/gen10/artistSongs', async function (req, res, next) {
  const questions = [];
  const artists = [];
  const pagesVisited = [];
  const songList = [];

  while (artists.length < req.query.nbQuestion || songList.length < (parseInt(req.query.nbQuestion) * 3)) {
    let skip;
    do {
      skip = Math.floor(Math.random() * 100) * 200;
    } while (pagesVisited.indexOf(skip) !== -1);

    pagesVisited.push(skip);
    const { body } = await got(`https://wasabi.i3s.unice.fr/api/v1/artist_all/${skip}`, {
      responseType: 'json'
    });

    for (const artist of body) {
      if (artists.length < req.query.nbQuestion && artist && artist !== null && artist !== 'null' && artist.gender && artist.gender !== '' && artist.albums && artist.albums.length !== 0) {
        let song;
        let i = 0;
        do {
          song = artist.albums[i].songs[0].title;
          i++;
        } while (song.toLowerCase() === 'other songs' && i < artist.albums.length);

        if (song.toLowerCase() !== 'other songs') {
          artists.push({ name: artist.name, song: song });
          console.log('Artiste: ' + artist.name + ", Nombre d'artistes: " + artists.length);
        }
      } else if (songList.length < (parseInt(req.query.nbQuestion) * 3) && artist && artist !== null && artist !== 'null' && artist.albums && artist.albums.length > 1) {
        let song;
        let i = 0;
        do {
          song = artist.albums[i].songs[0].title;
          i++;
        } while (song.toLowerCase() === 'other songs' && i < artist.albums.length);

        if (song.toLowerCase() !== 'other songs') {
          songList.push(song);
          console.log('Chanson: ' + song + ', Nombre de musiques: ' + songList.length);
        }
      }
    }
  }

  for (const artist of artists) {
    const random = Math.floor(Math.random() * 4);

    const fakeSongs = songList.splice(0, 3);

    fakeSongs.splice(random, 0, artist.song);

    questions.push({ question: `Quelle chanson a été chanté par "${artist.name}" ?`, proposition: fakeSongs, 'index-reponse': random });
  }

  res.status(200).json(questions);
});

// Pour la generation de X question sur des chansons
router.get('/questions/gen10/allRandom', async function (req, res, next) {
  const questions = [];
  const pagesVisited = [];
  const nbQuestionDate = Math.floor(Math.random() * req.query.nbQuestion);
  console.log('nb question a date : ' + nbQuestionDate);
  // const nbQuestionAlbum = getRandomIntInclusive(0, (parseInt(req.query.nbQuestion) - nbQuestionDate));
  const nbQuestionAlbum = req.query.nbQuestion - nbQuestionDate;
  console.log('nb question a album : ' + nbQuestionAlbum);
  const nbQuestionChanson = parseInt(req.query.nbQuestion) - nbQuestionDate - nbQuestionAlbum;
  console.log('nb question a chanson : ' + nbQuestionChanson);
  let i = 0;
  let j = 0;

  while (questions.length < req.query.nbQuestion) {
    let skip;
    do {
      skip = Math.floor(Math.random() * 100) * 200;
    } while (pagesVisited.indexOf(skip) !== -1);

    pagesVisited.push(skip);
    const { body } = await got(`https://wasabi.i3s.unice.fr/api/v1/artist_all/${skip}`, {
      responseType: 'json'
    });

    if (!body || !body.length) {
      return res.status(404).json({ error: 'No body or body legnt is null/undefined' });
    }

    let randomNumber = getRandomIntInclusive(0, parseInt(body.length) - 1);

    // Question a date
    for (i; i < nbQuestionDate; i++) {
      do {
        randomNumber = getRandomIntInclusive(0, parseInt(body.length) - 1);
        if (body[randomNumber] && body[randomNumber] !== null && body[randomNumber] !== 'null' && body[randomNumber].gender && body[randomNumber].gender !== '' && body[randomNumber].lifeSpan && body[randomNumber].lifeSpan.begin) {
          const fakeDates = generateFakeDate(body[randomNumber].lifeSpan.begin);
          const random = Math.floor(Math.random() * 4);
          fakeDates.splice(random, 0, body[randomNumber].lifeSpan.begin);
          questions.push({ question: `Quel est la date de naissance de ${body[randomNumber].name} ?`, proposition: fakeDates, 'index-reponse': random });
        }
      } while ((!body[randomNumber] || !body[randomNumber].gender || body[randomNumber].gender === '' || !body[randomNumber].lifeSpan || !body[randomNumber].lifeSpan.begin));
    }

    // Question a album
    for (j; j < nbQuestionAlbum; j++) {
      do {
        randomNumber = getRandomIntInclusive(0, parseInt(body.length) - 1);
        if (body[randomNumber] && body[randomNumber] !== null && body[randomNumber] !== 'null' && body[randomNumber].albums && body[randomNumber].albums.length !== 0) {
          let title;
          let index = 0;
          do {
            if (body[randomNumber].albums[index] && body[randomNumber].albums[index].title) {
              title = body[randomNumber].albums[index].title; // Des fois undefined
            }
            index++;
          } while (title.toLowerCase() === 'other songs' && i < body[randomNumber].albums.length);

          if (title.toLowerCase() !== 'other songs') {
            const random = Math.floor(Math.random() * 4);
            const fakeAlbums = [];
            const pagesVisited = [];

            while (fakeAlbums.length < 3) {
              let skip;
              do {
                skip = Math.floor(Math.random() * 100) * 200;
              } while (pagesVisited.indexOf(skip) !== -1);

              pagesVisited.push(skip);
              const { body } = await got(`https://wasabi.i3s.unice.fr/api/v1/artist_all/${skip}`, {
                responseType: 'json'
              });

              for (const artist of body) {
                if (fakeAlbums.length < 3 && artist && artist !== null && artist !== 'null' && artist.albums && artist.albums.length > 1) {
                  let song;
                  let i = 0;
                  do {
                    if (artist.albums[i].title) {
                      song = artist.albums[i].title;
                    }
                    i++;
                  } while (song.toLowerCase() === 'other songs' && i < artist.albums.length);

                  if (song.toLowerCase() !== 'other songs') {
                    fakeAlbums.push(song);
                    console.log('Add to fakeAlbum');
                  }
                }
              }
            }
            fakeAlbums.splice(random, 0, title);
            questions.push({ question: `Quelle album a été réalisé par  "${body[randomNumber].name}" ?`, proposition: fakeAlbums, 'index-reponse': random });
          }
        }
        console.log('grosse boucle');
      } while ((!body[randomNumber].albums || body[randomNumber].albums === 0));
    }
  }
  res.status(200).json(questions);
});

// Pour la génération de x questions faciles de type aléatoire 
router.get('/questions/gen10/test', async function (req, res, next) {
  const questions = [];
  const artists = [];
  const pagesVisited = [];


  while (artists.length < parseInt(req.query.nbQuestion)) {
    let skip;
    do {
      skip = Math.floor(Math.random() * 388);
    } while (pagesVisited.indexOf(skip) !== -1);

    pagesVisited.push(skip);
    console.log(skip);

    const { body } = await got('https://wasabi.i3s.unice.fr/api/v1/artist_all/' + skip*200, {
      responseType: 'json'
    });
    
    for (const artist of body) {
      if(artist.deezerFans > 1000000 && artist.lifeSpan.begin != ""){
        //console.log(artist.name + " --- " + artist.deezerFans);
        artists.push({name : artist.name, deezerFans : artist.deezerFans, begin : artist.lifeSpan.begin});
        const albums = artist.albums
        console.log("- " + artist.name)
        //console.log(albums)
        albums.forEach(album => {console.log(album.title)})
      }
      
      /*const { body } = await got(`https://wasabi.i3s.unice.fr/api/v1/artist/name/${artist.name}`, {
        responseType: 'json'
      });

      if (body && body !== null && body !== 'null' && body.gender && body.gender !== '' && body.lifeSpan && body.lifeSpan.begin) {
        artists.push({ name: body.name, lifeSpan: body.lifeSpan });
        if (artists.length === parseInt(req.query.nbQuestion)) break;
      }*/
    }
  }

  artists.forEach(artist => {
    console.log(artist.name + " ---- " + artist.deezerFans);
    
    const fakeDates = generateFakeDate(artist.begin);

    const random = Math.floor(Math.random() * 4);

    fakeDates.splice(random, 0, artist.begin);

    questions.push({ question: `Quel est la daaaaaate de naissance de ${artist.name} ?`, proposition: fakeDates, 'index-reponse': random });
  });

  res.status(200).json(questions);
});

router.get('/fake/date', async function (req, res, next) {
  const date = req.query.date;

  if (!date) {
    return res.status(400).json({ error: 'Query parameter date is required' });
  }

  const fakeDates = generateFakeDate(date);

  res.status(200).json({ date: date, fakeDates: fakeDates });
});

router.get('/fake/chanson', async function (req, res, next) {
  const fakeChansons = [];
  const pagesVisited = [];

  while (fakeChansons.length < 3) {
    let skip;
    do {
      skip = Math.floor(Math.random() * 100) * 200;
    } while (pagesVisited.indexOf(skip) !== -1);

    pagesVisited.push(skip);
    const { body } = await got(`https://wasabi.i3s.unice.fr/api/v1/artist_all/${skip}`, {
      responseType: 'json'
    });
    for (const artist of body) {
      if (artist && artist.albums && artist.albums.length !== 0) {
        let song;
        while (fakeChansons.length < 3) {
          const i = Math.floor(Math.random() * artist.albums.length);
          if (artist.albums[i].songs.length !== 0) {
            song = artist.albums[i].songs[Math.floor(Math.random() * artist.albums[i].songs.length)].title;
            fakeChansons.push(song);
          }
        }
      }
    }
  }
  res.status(200).json({ fakeChansons: fakeChansons });
});

router.get('/fake/album', async function (req, res, next) {
  const fakeChansons = [];
  const pagesVisited = [];

  while (fakeChansons.length < 3) {
    let skip;
    do {
      skip = Math.floor(Math.random() * 100) * 200;
    } while (pagesVisited.indexOf(skip) !== -1);

    pagesVisited.push(skip);
    const { body } = await got(`https://wasabi.i3s.unice.fr/api/v1/artist_all/${skip}`, {
      responseType: 'json'
    });
    for (const artist of body) {
      if (artist && artist.albums && artist.albums.length !== 0) {
        let song;
        let i = 0;
        do {
          song = artist.albums[i].title;
          i++;
        } while (song.toLowerCase() === 'other songs' && i < artist.albums.length);
        if (song.toLowerCase() !== 'other songs' && fakeChansons.length < 3) {
          fakeChansons.push(song);
          if (fakeChansons.length === 3) {
            break;
          }
        }
      }
    }
  }
  res.status(200).json({ fakeChansons: fakeChansons });
});

function generateFakeDate (trueDate) {
  // $('#create-json textarea').remove();

  const actualYear = new Date().getFullYear();

  const fakeDates = [];

  const dateSeparator = '-';

  const count = (trueDate.match(/-/g) || []).length;

  if (count === 0) {
    for (let i = 0; i < 3; i++) {
      let year;
      do {
        year = getRandomIntInclusive(parseInt(trueDate[0]) - 5, Math.min(parseInt(trueDate[0]) + 5, actualYear));
      } while (year === actualYear || fakeDates.indexOf(year) !== -1);
      const res = '' + year;

      fakeDates.push(res);
    }
  } else if (count === 1) {
    const year = getRandomIntInclusive(parseInt(trueDate[0]) - 5, Math.min(parseInt(trueDate[0]) + 5, actualYear));
    const month = getRandomIntInclusive(1, 12);

    const res = '' + year + dateSeparator + month;

    fakeDates.push(res);
  } else if (count === 2) {
    trueDate = trueDate.split(dateSeparator);

    for (let i = 0; i < 3; i++) {
      let day;
      const year = getRandomIntInclusive(parseInt(trueDate[0]) - 5, Math.min(parseInt(trueDate[0]) + 5, actualYear));
      const month = getRandomIntInclusive(1, 12);

      switch (month) {
        case 2:
          if (((year % 4) === 0 && (year % 100) !== 0) || (year % 400) === 0) {
            day = getRandomIntInclusive(1, 29);
          } else {
            day = getRandomIntInclusive(1, 28);
          }
          break;
        case 1: case 3: case 5: case 7: case 8: case 10: case 12:
          day = getRandomIntInclusive(1, 31);
          break;
        default:
          day = getRandomIntInclusive(1, 30);
      }

      const res = '' + year + dateSeparator + (month < 10 ? '0' : '') + month + dateSeparator + (day < 10 ? '0' : '') + day;

      fakeDates.push(res);
    }
  } else {
    return;
  }

  return fakeDates;
}

async function generateFakeArtiste (artistName) { // eslint-disable-line no-unused-vars
  const fakeArtiste = [];
  const pagesVisited = [];

  while (fakeArtiste.length < 3) {
    let skip;
    do {
      skip = Math.floor(Math.random() * 100);
    } while (pagesVisited.indexOf(skip) !== -1);

    pagesVisited.push(skip);

    const { body } = await got('https://wasabi.i3s.unice.fr/api/v1/artist/count/album?skip=' + skip + '&limit=10', {
      responseType: 'json'
    });
    for (const artist of body) {
      const { body } = await got(`https://wasabi.i3s.unice.fr/api/v1/artist/name/${artist.name}`, {
        responseType: 'json'
      });

      if (body && body !== null && body !== 'null' && body.gender && body.gender !== '' && body.lifeSpan && body.lifeSpan.begin && body.name !== artistName) {
        console.log('Artiste:' + artistName + ' - Fake: ' + body.name);
        fakeArtiste.push(body.name);
        if (fakeArtiste.length === 3) break;
      }
    }
  }
  return fakeArtiste;
}

function getRandomIntInclusive (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

router.get('/questions/gen10/songArtists', async function (req, res, next) {
  const questions = [];
  const artists = [];
  const pagesVisited = [];

  while (artists.length < 40) {
    let skip;
    do {
      skip = Math.floor(Math.random() * 100) * 200;
    } while (pagesVisited.indexOf(skip) !== -1);

    pagesVisited.push(skip);

    const { body } = await got(`https://wasabi.i3s.unice.fr/api/v1/artist_all/${skip}`, {
      responseType: 'json'
    });

    for (const artist of body) {
      if (artist && artist !== null && artist !== 'null' && artist.gender && artist.gender !== '' && artist.albums && artist.albums.length !== 0) {
        let song;
        let i = 0;
        do {
          song = artist.albums[i].title;
          i++;
        } while ((song.includes(artist.name) || song.toLowerCase() === 'other songs') && i < artist.albums.length); // TODO Songs on Compilations

        if (song.toLowerCase() !== 'other songs') {
          artists.push({ name: artist.name, song: song });
          console.log('Artiste: ' + artist.name + ', Musique: ' + song);
          if (artists.length === 40) break;
        }
      }
    }
  }

  for (let i = 0; i < 10; i++) {
    const random = Math.floor(Math.random() * 4);

    const fakeArtists = artists.splice(0, 4);

    questions.push({ question: `Qui a interprété "${fakeArtists[random].song}" ?`, proposition: fakeArtists.map(e => e.name), 'index-reponse': random });
  }

  res.status(200).json(questions);
});

module.exports = router;

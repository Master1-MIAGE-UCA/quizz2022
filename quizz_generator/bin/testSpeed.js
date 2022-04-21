const mongoose = require('mongoose');
const Song = require('./db/Song');
const { performance } = require('perf_hooks');

mongoose.connect('mongodb://localhost:27017/QuizzGen');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MongoDB Connected');
  test();
});

async function test () {
  const bdPerf = [];
  const bdCountPerf = [];
  const arrayPerfSome = [];
  const arrayPerfIndexOf = [];
  const songs = await Song.find();
  const songNames = songs.map(e => e.name);

  console.log('Array Some Length: ' + songs.length);
  console.log('Array IndexOf Length: ' + songNames.length);
  console.log('BD length (should be the same): ' + (await Song.countDocuments()));
  console.log('Calculting perfs on 1000 tests');

  for (let i = 0; i < 1000; i++) {
    const randomSong = songs[Math.floor(Math.random() * songs.length)].title;
    const t1 = performance.now();
    const findSong = await Song.find({ name: randomSong });

    if (findSong === null) {
      // IT FAILED
    }
    const t2 = performance.now();

    bdPerf.push(t2 - t1);

    const t7 = performance.now();
    const findSong4 = await Song.countDocuments({ name: randomSong });

    if (findSong4 === null) {
      // IT FAILED
    }
    const t8 = performance.now();

    bdCountPerf.push(t8 - t7);

    const t3 = performance.now();
    const findSong2 = songs.some(e => e.title === randomSong);
    if (findSong2 === -1) {
      // IT FAILED
    }
    const t4 = performance.now();

    arrayPerfSome.push(t4 - t3);

    const t5 = performance.now();
    const findSong3 = songNames.indexOf(e => e.title === randomSong);
    if (findSong3 === -1) {
      // IT FAILED
    }
    const t6 = performance.now();

    arrayPerfIndexOf.push(t6 - t5);
  }

  const average = (array) => array.reduce((a, b) => a + b) / array.length;

  console.log('BD mean time: ' + average(bdPerf) + ' ms');
  console.log('BD count mean time: ' + average(bdCountPerf) + ' ms');
  console.log('Array Some mean time: ' + average(arrayPerfSome) + ' ms');
  console.log('Array IndexOf mean time: ' + average(arrayPerfIndexOf) + ' ms');

  process.exit(0);
}

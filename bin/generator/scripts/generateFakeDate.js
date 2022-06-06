const getRandomIntInclusive = require('./getRandomIntInclusive');

function generateFakeDate (trueDate) {
  // $('#create-json textarea').remove();
  const actualYear = new Date().getFullYear();

  const fakeDates = [];

  const dateSeparator = '-';

  const count = (trueDate.match(/-/g) || []).length;

  trueDate = trueDate.split(dateSeparator);

  if (count === 0) {
    for (let i = 0; i < 3; i++) {
      let year;
      do {
        year = getRandomIntInclusive(parseInt(trueDate[0]) - 5, Math.min(parseInt(trueDate[0]) + 5, actualYear));
      } while (year === actualYear || fakeDates.indexOf(year) !== -1 || year === parseInt(trueDate));
      const res = '' + year;

      fakeDates.push(res);
    }
  } else if (count === 1) {
    for (let i = 0; i < 3; i++) {
      const year = getRandomIntInclusive(parseInt(trueDate[0]) - 5, Math.min(parseInt(trueDate[0]) + 5, actualYear));
      const month = getRandomIntInclusive(1, 12);

      const res = '' + year + dateSeparator + month;

      fakeDates.push(res);
    }
  } else if (count === 2) {
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

module.exports = generateFakeDate;

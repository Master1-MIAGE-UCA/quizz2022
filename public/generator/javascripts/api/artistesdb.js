/* globals $, Blob */
'use strict';

$(document).ready(function () {
  const formAuthor = document.getElementsByClassName('form-author');
  const result = document.getElementsByClassName('result-author');

  // Partie: Generer une question a date a partir d'un artiste precis
  formAuthor[0].addEventListener('submit', event => {
    event.preventDefault();

    const fname = formAuthor[0].elements.firstname;
    const lname = formAuthor[0].elements.lastname;
    const date = formAuthor[0].elements.date;

    if (fname.value === null || date.value === null) {
      return;
    }

    $.ajax({
      url: `/db/group/${fname.value}${lname.value ? ' ' + lname.value : ''}/dates?typeDate=${date.value}`,
      data: {},
      success: (res) => {
        document.getElementById('fake-date').style.display = 'none';
        if (date.value === 'death') {
          if (res.endDate !== '') {
            result[0].classList.add('active');
            result[0].classList.remove('error');
            result[0].innerHTML = 'Résultat: ' + (date.value === 'birth' ? res.birthDate : res.endDate);
            document.getElementById('fake-date').style.display = 'block';
          } else {
            result[0].classList.add('error');
            result[0].classList.remove('active');
            result[0].innerHTML = 'Error: This artist is alive !';
          }
        } else {
          result[0].classList.add('active');
          result[0].classList.remove('error');
          result[0].innerHTML = 'Résultat: ' + (date.value === 'birth' ? res.birthDate : res.endDate);
          document.getElementById('fake-date').style.display = 'block';
        }
      },
      error: (error) => {
        document.getElementById('fake-date').style.display = 'none';
        result[0].classList.add('error');
        result[0].classList.remove('active');
        result[0].innerHTML = 'Error: ' + ((error.responseJSON && error.responseJSON.error) ? error.responseJSON.error : error.responseText);
      }
    });

    $('#fake-date p').remove();
    $('#create-json textarea').remove();
    document.getElementById('create-json').style.display = 'none';
    document.querySelector('#generate-date-button').disabled = false;
    document.querySelector('#create-json button').disabled = false;
  });

  document.getElementById('generate-date-button').addEventListener('click', function (event) {
    event.preventDefault();
    const date = result[0].innerHTML.split(' ')[1];
    $.ajax({
      url: `/api/fake/date?date=${date}`,
      data: {},
      success: (res) => {
        const fakeDates = res.fakeDates;
        const generateButton = document.querySelector('#generate-date-button');

        for (let i = 0; i < fakeDates.length; i++) {
          const newElement = document.createElement('p');
          newElement.innerHTML = fakeDates[i];
          generateButton.after(newElement);
        }

        generateButton.disabled = true;

        document.getElementById('create-json').style.display = 'block';
      },
      error: (error) => {
        const element = document.createElement('p');
        element.innerHTML = (error.responseJSON && error.responseJSON.error) ? error.responseJSON.error : error.responseText;
        document.querySelector('#generate-date-button').after(element);
      }
    });
  });

  document.getElementById('generate-json').addEventListener('click', function (event) {
    event.preventDefault();
    generateJSON();
  });

  function generateJSON () {
    const answer = result[0].innerHTML.split(' ')[1];
    const fakeDates = [];
    document.querySelectorAll('#fake-date p').forEach(e => {
      fakeDates.push(e.innerHTML);
    });

    const textArea = document.createElement('textarea');

    const fnameDate = formAuthor[0].elements.firstname;
    const lnameDate = formAuthor[0].elements.lastname;
    const random = Math.floor(Math.random() * 4);
    fakeDates.splice(random, 0, answer);
    textArea.innerHTML = JSON.stringify({ question: `Quel est la date de naissance de ${fnameDate.value} ${lnameDate.value} ?`, proposition: fakeDates, 'index-reponse': random });

    document.querySelector('#generate-json').after(textArea);

    document.querySelector('#generate-json').disabled = true;
  }

  // Partie: Generer des question a date a partir d'artites aleatoires
  document.getElementById('genererXQuestionsDate').addEventListener('click', function (event) {
    event.preventDefault();
    const nbQuestion = document.getElementById('nbDateQuestion').value;
    if (nbQuestion < 101 && nbQuestion > 0) {
      generateDateQuestion(nbQuestion);
    }
  });

  function generateDateQuestion (nbQuestion) {
    document.querySelector('#dateArtisteAleatoireDiv textarea').innerHTML = '';
    document.querySelector('#dateArtisteAleatoireDiv p').innerHTML = 'Loading...';
    document.querySelector('#genererXQuestionsDate').disabled = true;

    let myURL = `/db/questions/gen10/artistDates?nbQuestion=${nbQuestion}`;

    const popularity = document.getElementById('popularityDate').value;
    if (popularity !== '') {
      myURL += `&popularity=${popularity}`;
    }

    const genres = [...(document.getElementById('artistGenresDate').options)].map(e => e.selected ? e.value : null).filter(e => e !== null);
    if (genres !== '') {
      myURL += `&genres=${genres}`;
    }

    const minDate = document.getElementById('dateMinDate').value;
    if (minDate !== '') {
      myURL += `&minDate=${minDate}`;
    }

    const maxDate = document.getElementById('dateMaxDate').value;
    if (maxDate !== '') {
      myURL += `&maxDate=${maxDate}`;
    }

    $.ajax({
      url: myURL,
      data: {},
      success: (res) => {
        document.querySelector('#dateArtisteAleatoireDiv p').innerHTML = '';
        document.getElementsByClassName('downloadDivFromAleatoire')[0].style.display = 'block';
        document.getElementsByClassName('backToArtistDivFromAleatoire')[0].style.display = 'block';
        const textArea = document.querySelector('#dateArtisteAleatoireDiv textarea');

        textArea.innerHTML = JSON.stringify(res);
        document.querySelector('#genererXQuestionsDate').disabled = false;
      },
      error: (error) => {
        document.querySelector('#dateArtisteAleatoireDiv p').innerHTML = '';
        const textArea = document.querySelector('#dateArtisteAleatoireDiv textarea');

        textArea.innerHTML = (error && error.error) ? error.error : JSON.stringify(error);
      }
    });
  }

  // Partie: Generer une question a album a partir d'un precis
  formAuthor[1].addEventListener('submit', event => {
    event.preventDefault();

    const fnameAlbum = formAuthor[1].elements.firstname;
    const lnameAlbum = formAuthor[1].elements.lastname;

    if (fnameAlbum.value === null) {
      return;
    }

    $.ajax({
      url: `/db/group/${fnameAlbum.value}${lnameAlbum.value ? ' ' + lnameAlbum.value : ''}/album`,
      data: {},
      success: (res) => {
        document.getElementById('fake-albums').style.display = 'none';
        result[1].classList.add('active');
        result[1].classList.remove('error');
        result[1].innerHTML = 'Résultat: ' + res.song;
        document.getElementById('fake-albums').style.display = 'block';
      },
      error: (error) => {
        document.getElementById('fake-albums').style.display = 'none';
        result[1].classList.add('error');
        result[1].classList.remove('active');
        result[1].innerHTML = 'Error: ' + ((error.responseJSON && error.responseJSON.error) ? error.responseJSON.error : error.responseText);
      }
    });

    $('#fake-albums p').remove();
    $('#create-json-album textarea').remove();
    document.getElementById('create-json-album').style.display = 'none';
    document.querySelector('#generate-albums-button').disabled = false;
    document.querySelector('#create-json-album button').disabled = false;
  });

  document.getElementById('generate-albums-button').addEventListener('click', function (event) {
    event.preventDefault();
    $.ajax({
      url: '/db/fake/album',
      data: {},
      success: (res) => {
        const fakeChansons = res.fakeChansons;
        const generateAlbumsButton = document.querySelector('#generate-albums-button');

        for (let i = 0; i < fakeChansons.length; i++) {
          const newElement = document.createElement('p');
          newElement.innerHTML = fakeChansons[i];
          generateAlbumsButton.after(newElement);
        }

        generateAlbumsButton.disabled = true;

        document.getElementById('create-json-album').style.display = 'block';
      },
      error: (error) => {
        const element = document.createElement('p');
        element.innerHTML = (error.responseJSON && error.responseJSON.error) ? error.responseJSON.error : error.responseText;
        document.querySelector('#generate-albums-button').after(element);
      }
    });
  });

  document.getElementById('generate-json-album').addEventListener('click', function (event) {
    event.preventDefault();
    generateJSONAlbum();
  });

  function generateJSONAlbum () {
    const answer = result[1].innerHTML.split(': ')[1];
    const fakeAlbums = [];
    document.querySelectorAll('#fake-albums p').forEach(e => {
      fakeAlbums.push(e.innerHTML);
    });

    const textArea = document.createElement('textarea');

    const fnameAlbum = formAuthor[1].elements.firstname;
    const lnameAlbum = formAuthor[1].elements.lastname;
    const random = Math.floor(Math.random() * 4);
    fakeAlbums.splice(random, 0, answer);
    textArea.innerHTML = JSON.stringify({ question: `Quel album a été realisé par ${fnameAlbum.value} ${lnameAlbum.value} ?`, proposition: fakeAlbums, 'index-reponse': random });

    document.querySelector('#generate-json-album').after(textArea);

    document.querySelector('#generate-json-album').disabled = true;
  }

  // Partie: Generer une question a album a partir d'artites aleatoires
  document.getElementById('genererXQuestionsAlbum').addEventListener('click', function (event) {
    event.preventDefault();
    const nbQuestion = document.getElementById('nbAlbumsQuestion').value;
    if (nbQuestion < 101 && nbQuestion > 0) {
      generateAlbumQuestion(nbQuestion);
    }
  });

  function generateAlbumQuestion (nbQuestion) {
    document.querySelector('#albumArtisteAleatoireDiv textarea').innerHTML = '';
    document.querySelector('#albumArtisteAleatoireDiv p').innerHTML = 'Loading...';
    document.querySelector('#genererXQuestionsAlbum').disabled = true;

    let myURL = `/db/questions/gen10/artistAlbums?nbQuestion=${nbQuestion}`;

    const popularity = document.getElementById('popularityAlbum').value;
    if (popularity !== '') {
      myURL += `&popularity=${popularity}`;
    }

    const genres = [...(document.getElementById('artistGenresAlbum').options)].map(e => e.selected ? e.value : null).filter(e => e !== null);
    if (genres !== '') {
      myURL += `&genres=${genres}`;
    }

    const minDate = document.getElementById('dateMinAlbum').value;
    if (minDate !== '') {
      myURL += `&minDate=${minDate}`;
    }

    const maxDate = document.getElementById('dateMaxAlbum').value;
    if (maxDate !== '') {
      myURL += `&maxDate=${maxDate}`;
    }

    $.ajax({
      url: myURL,
      data: {},
      success: (res) => {
        document.querySelector('#albumArtisteAleatoireDiv p').innerHTML = '';
        document.getElementsByClassName('downloadDivFromAleatoire')[1].style.display = 'block';
        document.getElementsByClassName('backToArtistDivFromAleatoire')[1].style.display = 'block';
        const textArea = document.querySelector('#albumArtisteAleatoireDiv textarea');

        textArea.innerHTML = JSON.stringify(res);
        document.querySelector('#genererXQuestionsAlbum').disabled = false;
      },
      error: (error) => {
        document.querySelector('#albumArtisteAleatoireDiv p').innerHTML = '';
        const textArea = document.querySelector('#albumArtisteAleatoireDiv textarea');

        textArea.innerHTML = (error && error.error) ? error.error : JSON.stringify(error);
      }
    });
  }

  // Partie: Generer une question a chanson a partir d'un precis
  formAuthor[2].addEventListener('submit', event => {
    event.preventDefault();

    const fname = formAuthor[2].elements.firstname;
    const lname = formAuthor[2].elements.lastname;

    if (fname.value === null) {
      return;
    }

    $.ajax({
      url: `/db/group/${fname.value}${lname.value ? ' ' + lname.value : ''}/chanson`,
      data: {},
      success: (res) => {
        document.getElementById('fake-chansons').style.display = 'none';
        result[2].classList.add('active');
        result[2].classList.remove('error');
        result[2].innerHTML = 'Résultat: ' + res.song;
        document.getElementById('fake-chansons').style.display = 'block';
      },
      error: (error) => {
        document.getElementById('fake-chansons').style.display = 'none';
        result[2].classList.add('error');
        result[2].classList.remove('active');
        result[2].innerHTML = 'Error: ' + ((error.responseJSON && error.responseJSON.error) ? error.responseJSON.error : error.responseText);
      }
    });

    $('#fake-chansons p').remove();
    $('#create-json-chanson textarea').remove();
    document.getElementById('create-json-chanson').style.display = 'none';
    document.querySelector('#generate-chansons-button').disabled = false;
    document.querySelector('#create-json-chanson button').disabled = false;
  });

  document.getElementById('generate-chansons-button').addEventListener('click', function (event) {
    event.preventDefault();
    $.ajax({
      url: '/db/fake/chanson',
      data: {},
      success: (res) => {
        const fakeChansons = res.fakeChansons;
        const generateChansonsButton = document.querySelector('#generate-chansons-button');

        for (let i = 0; i < fakeChansons.length; i++) {
          const newElement = document.createElement('p');
          newElement.innerHTML = fakeChansons[i];
          generateChansonsButton.after(newElement);
        }

        generateChansonsButton.disabled = true;

        document.getElementById('create-json-chanson').style.display = 'block';
      },
      error: (error) => {
        const element = document.createElement('p');
        element.innerHTML = (error.responseJSON && error.responseJSON.error) ? error.responseJSON.error : error.responseText;
        document.querySelector('#generate-chansons-button').after(element);
      }
    });
  });

  document.getElementById('generate-json-chanson').addEventListener('click', function (event) {
    event.preventDefault();
    generateJSONChanson();
  });

  function generateJSONChanson () {
    const answer = result[2].innerHTML.split(': ')[1];
    const fakeChansons = [];
    document.querySelectorAll('#fake-chansons p').forEach(e => {
      fakeChansons.push(e.innerHTML);
    });

    const textArea = document.createElement('textarea');

    const fnameChanson = formAuthor[2].elements.firstname;
    const lnameChanson = formAuthor[2].elements.lastname;
    const random = Math.floor(Math.random() * 4);
    fakeChansons.splice(random, 0, answer);
    textArea.innerHTML = JSON.stringify({ question: `Quel chanson a été realisé par ${fnameChanson.value} ${lnameChanson.value} ?`, proposition: fakeChansons, 'index-reponse': random });

    document.querySelector('#generate-json-chanson').after(textArea);

    document.querySelector('#generate-json-chanson').disabled = true;
  }

  // Partie: Generer des question a chanson a partir d'artites aleatoires
  document.getElementById('genererXQuestionsChanson').addEventListener('click', function (event) {
    event.preventDefault();
    const nbQuestion = document.getElementById('nbChansonsQuestion').value;
    if (nbQuestion < 101 && nbQuestion > 0) {
      generateChansonsQuestion(nbQuestion);
    }
  });

  function generateChansonsQuestion (nbQuestion) {
    document.querySelector('#chansonArtisteAleatoireDiv textarea').innerHTML = '';
    document.querySelector('#chansonArtisteAleatoireDiv p').innerHTML = 'Loading...';
    document.querySelector('#genererXQuestionsChanson').disabled = true;

    let myURL = `/db/questions/gen10/artistSongs?nbQuestion=${nbQuestion}`;

    const popularity = document.getElementById('popularityChanson').value;
    if (popularity !== '') {
      myURL += `&popularity=${popularity}`;
    }

    const genres = [...(document.getElementById('artistGenresChanson').options)].map(e => e.selected ? e.value : null).filter(e => e !== null);
    if (genres !== '') {
      myURL += `&genres=${genres}`;
    }

    const minDate = document.getElementById('dateMinChanson').value;
    if (minDate !== '') {
      myURL += `&minDate=${minDate}`;
    }

    const maxDate = document.getElementById('dateMaxChanson').value;
    if (maxDate !== '') {
      myURL += `&maxDate=${maxDate}`;
    }

    $.ajax({
      url: myURL,
      data: {},
      success: (res) => {
        document.querySelector('#chansonArtisteAleatoireDiv p').innerHTML = '';
        document.getElementsByClassName('downloadDivFromAleatoire')[2].style.display = 'block';
        document.getElementsByClassName('backToArtistDivFromAleatoire')[2].style.display = 'block';
        const textArea = document.querySelector('#chansonArtisteAleatoireDiv textarea');

        textArea.innerHTML = JSON.stringify(res);
        document.querySelector('#genererXQuestionsChanson').disabled = false;
      },
      error: (error) => {
        document.querySelector('#chansonArtisteAleatoireDiv p').innerHTML = '';
        const textArea = document.querySelector('#chansonArtisteAleatoireDiv textarea');

        textArea.innerHTML = (error && error.error) ? error.error : JSON.stringify(error);
      }
    });
  }

  // Partie: Generer des questions aleatoire a partir d'un precis
  formAuthor[3].addEventListener('submit', event => {
    event.preventDefault();

    const fnameAll = formAuthor[3].elements.firstname;
    const lnameAll = formAuthor[3].elements.lastname;

    if (fnameAll.value === null) {
      return;
    }

    $.ajax({
      url: `/db/group/${fnameAll.value}${lnameAll.value ? ' ' + lnameAll.value : ''}/all`,
      data: {},
      success: (res) => {
        console.log(res);
        const jsonArea = document.getElementById('create-json-all');
        const textArea = document.createElement('textarea');
        textArea.innerHTML = JSON.stringify(res);
        jsonArea.appendChild(textArea);
        jsonArea.style.display = 'block';
      },
      error: (error) => {
        const jsonArea = document.getElementById('create-json-all');
        const textArea = document.createElement('textarea');
        textArea.innerHTML = (error && error.error) ? error.error : JSON.stringify(error);
        jsonArea.appendChild(textArea);
        jsonArea.style.display = 'block';
      }
    });
  });

  // Partie: Generer des question aleatoire a partir d'artistes aleatoire
  document.getElementById('genererXQuestionsAll').addEventListener('click', function (event) {
    event.preventDefault();
    const nbQuestion = document.getElementById('nbAllQuestion').value;
    if (nbQuestion < 101 && nbQuestion > 0) {
      generateAllQuestion(nbQuestion);
    }
  });

  function generateAllQuestion (nbQuestion) {
    document.querySelector('#allArtisteAleatoireDiv textarea').innerHTML = '';
    document.querySelector('#allArtisteAleatoireDiv p').innerHTML = 'Loading...';
    document.querySelector('#genererXQuestionsAll').disabled = true;

    let myURL = `/db/questions/gen10/allRandom?nbQuestion=${nbQuestion}`;

    const popularity = document.getElementById('popularityAll').value;
    if (popularity !== '') {
      myURL += `&popularity=${popularity}`;
    }

    const genres = [...(document.getElementById('artistGenresAll').options)].map(e => e.selected ? e.value : null).filter(e => e !== null);
    if (genres !== '') {
      myURL += `&genres=${genres}`;
    }

    const minDate = document.getElementById('dateMinAll').value;
    if (minDate !== '') {
      myURL += `&minDate=${minDate}`;
    }

    const maxDate = document.getElementById('dateMaxAll').value;
    if (maxDate !== '') {
      myURL += `&maxDate=${maxDate}`;
    }

    $.ajax({
      url: myURL,
      data: {},
      success: (res) => {
        document.querySelector('#allArtisteAleatoireDiv p').innerHTML = '';
        document.getElementsByClassName('downloadDivFromAleatoire')[3].style.display = 'block';
        document.getElementsByClassName('backToArtistDivFromAleatoire')[3].style.display = 'block';
        const textArea = document.querySelector('#allArtisteAleatoireDiv textarea');

        textArea.innerHTML = JSON.stringify(res);
        document.querySelector('#genererXQuestionsAll').disabled = false;
      },
      error: (error) => {
        document.querySelector('#allArtisteAleatoireDiv p').innerHTML = '';
        const textArea = document.querySelector('#allArtisteAleatoireDiv textarea');

        textArea.innerHTML = (error && error.error) ? error.error : JSON.stringify(error);
      }
    });
  }

  // Partie: Bouton de retour
  document.getElementsByClassName('backToArtistDivBtnFromPrecis')[0].addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'block';
    document.getElementById('dateArtistePrecisDiv').style.display = 'none';
    // document.getElementById('backToArtistDivFromPrecis').style.display = 'none';
    result[0].innerHTML = '';
    result[0].classList.remove('active');
    result[0].classList.remove('error');
    $('#fake-date p').remove();
    $('#create-json textarea').remove();
    document.getElementById('fake-date').style.display = 'none';
    document.getElementById('create-json').style.display = 'none';
    document.getElementById('fnameDate').value = '';
    document.getElementById('lnameDate').value = '';
  });

  document.getElementsByClassName('backToArtistDivBtnFromAleatoire')[0].addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'block';
    document.querySelector('#dateArtisteAleatoireDiv p').innerHTML = '';
    document.getElementById('dateArtisteAleatoireDiv').style.display = 'none';
    document.getElementsByClassName('downloadDivFromAleatoire')[0].style.display = 'none';
    document.getElementsByClassName('backToArtistDivFromAleatoire')[0].style.display = 'none';

    document.getElementById('nbDateQuestion').value = '';
    document.getElementById('dateMinDate').value = '';
    document.getElementById('dateMaxDate').value = '';
    document.getElementById('popularityDate').value = '';
    [...(document.getElementById('artistGenresDate').options)].forEach(e => { e.selected = false; });

    document.querySelector('#dateArtisteAleatoireDiv p').innerHTML = '';
    document.querySelector('#dateArtisteAleatoireDiv textarea').innerHTML = '';

    document.querySelector('#genererXQuestionsDate').disabled = false;
  });

  document.getElementsByClassName('backToArtistDivBtnFromPrecis')[1].addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'block';
    document.getElementById('albumArtistePrecisDiv').style.display = 'none';
    // document.getElementById('backToArtistDivFromPrecis').style.display = 'none';
    result[1].innerHTML = '';
    result[1].classList.remove('active');
    result[1].classList.remove('error');
    $('#fake-albums p').remove();
    $('#create-json-album textarea').remove();
    document.getElementById('fake-albums').style.display = 'none';
    document.getElementById('create-json-album').style.display = 'none';
    document.getElementById('fnameAlbum').value = '';
    document.getElementById('lnameAlbum').value = '';
  });

  document.getElementsByClassName('backToArtistDivBtnFromAleatoire')[1].addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'block';
    document.querySelector('#albumArtisteAleatoireDiv p').innerHTML = '';
    document.getElementById('albumArtisteAleatoireDiv').style.display = 'none';
    document.getElementsByClassName('downloadDivFromAleatoire')[1].style.display = 'none';
    document.getElementsByClassName('backToArtistDivFromAleatoire')[1].style.display = 'none';

    document.getElementById('nbAlbumsQuestion').value = '';
    document.getElementById('dateMinAlbum').value = '';
    document.getElementById('dateMaxAlbum').value = '';
    document.getElementById('popularityAlbum').value = '';
    [...(document.getElementById('artistGenresAlbum').options)].forEach(e => { e.selected = false; });

    document.querySelector('#albumArtisteAleatoireDiv p').innerHTML = '';
    document.querySelector('#albumArtisteAleatoireDiv textarea').innerHTML = '';

    document.querySelector('#genererXQuestionsAlbum').disabled = false;
  });

  document.getElementsByClassName('backToArtistDivBtnFromPrecis')[2].addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'block';
    document.getElementById('chansonArtistePrecisDiv').style.display = 'none';
    // document.getElementById('backToArtistDivFromPrecis').style.display = 'none';
    result[2].innerHTML = '';
    result[2].classList.remove('active');
    result[2].classList.remove('error');
    $('#fake-chansons p').remove();
    $('#create-json-chanson textarea').remove();
    document.getElementById('fake-chansons').style.display = 'none';
    document.getElementById('create-json-chanson').style.display = 'none';
    document.getElementById('fnameChanson').value = '';
    document.getElementById('lnameChanson').value = '';
  });

  document.getElementsByClassName('backToArtistDivBtnFromAleatoire')[2].addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'block';
    document.querySelector('#chansonArtisteAleatoireDiv p').innerHTML = '';
    document.getElementById('chansonArtisteAleatoireDiv').style.display = 'none';
    document.getElementsByClassName('downloadDivFromAleatoire')[2].style.display = 'none';
    document.getElementsByClassName('backToArtistDivFromAleatoire')[2].style.display = 'none';

    document.getElementById('nbChansonsQuestion').value = '';
    document.getElementById('dateMinChanson').value = '';
    document.getElementById('dateMaxChanson').value = '';
    document.getElementById('popularityChanson').value = '';
    [...(document.getElementById('artistGenresChanson').options)].forEach(e => { e.selected = false; });

    document.querySelector('#chansonArtisteAleatoireDiv p').innerHTML = '';
    document.querySelector('#chansonArtisteAleatoireDiv textarea').innerHTML = '';

    document.querySelector('#genererXQuestionsChanson').disabled = false;
  });

  document.getElementsByClassName('backToArtistDivBtnFromPrecis')[3].addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'block';
    document.getElementById('allArtistePrecisDiv').style.display = 'none';
    // document.getElementById('backToArtistDivFromPrecis').style.display = 'none';
    $('#create-json-all textarea').remove();
    document.getElementById('create-json-all').style.display = 'none';
    document.getElementById('fnameAll').value = '';
    document.getElementById('lnameAll').value = '';
  });

  document.getElementsByClassName('backToArtistDivBtnFromAleatoire')[3].addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'block';
    document.querySelector('#allArtisteAleatoireDiv p').innerHTML = '';
    document.getElementById('allArtisteAleatoireDiv').style.display = 'none';
    document.getElementsByClassName('downloadDivFromAleatoire')[3].style.display = 'none';
    document.getElementsByClassName('backToArtistDivFromAleatoire')[3].style.display = 'none';

    document.getElementById('nbAllQuestion').value = '';
    document.getElementById('dateMinAll').value = '';
    document.getElementById('dateMaxAll').value = '';
    document.getElementById('popularityAll').value = '';
    [...(document.getElementById('artistGenresAll').options)].forEach(e => { e.selected = false; });

    document.querySelector('#allArtisteAleatoireDiv p').innerHTML = '';
    document.querySelector('#allArtisteAleatoireDiv textarea').innerHTML = '';

    document.querySelector('#genererXQuestionsAll').disabled = false;
  });

  // Partie: Bouton de download
  document.getElementsByClassName('downloadButton')[0].addEventListener('click', function (event) {
    event.preventDefault();
    const textArea = document.querySelector('#dateArtisteAleatoireDiv textarea');
    saveTextAsFile(textArea.innerHTML, 'question.json');
  });

  document.getElementsByClassName('downloadButton')[1].addEventListener('click', function (event) {
    event.preventDefault();
    const textArea = document.querySelector('#albumArtisteAleatoireDiv textarea');
    saveTextAsFile(textArea.innerHTML, 'question.json');
  });

  document.getElementsByClassName('downloadButton')[2].addEventListener('click', function (event) {
    event.preventDefault();
    const textArea = document.querySelector('#chansonArtisteAleatoireDiv textarea');
    saveTextAsFile(textArea.innerHTML, 'question.json');
  });

  document.getElementsByClassName('downloadButton')[3].addEventListener('click', function (event) {
    event.preventDefault();
    const textArea = document.querySelector('#allArtisteAleatoireDiv textarea');
    saveTextAsFile(textArea.innerHTML, 'question.json');
  });

  function saveTextAsFile (textToWrite, fileNameToSaveAs) {
    const textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    const downloadLink = document.createElement('a');
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = 'Download File';
    if (window.webkitURL != null) {
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
    }
    downloadLink.click();
  }

  function destroyClickedElement (event) {
    document.body.removeChild(event.target);
  }
});

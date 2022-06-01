/* globals  */
'use strict';

window.onload = () => {
  // const result = document.getElementById('result-author');
  /* document.getElementById('chooseTypeUnique').addEventListener('click', function (event) {
    event.preventDefault();
    console.log('click');
    document.getElementById('chooseType').style.display = 'none';
    document.getElementById('multipleQuestions').style.display = 'none';
    document.getElementById('multipleQuestionsFromSong').style.display = 'none';
    document.getElementById('multipleQuestionsFromArtist').style.display = 'none';

    document.getElementById('backToChooseType').style.display = 'block';
    document.getElementById('uniqueQuestion').style.display = 'block';

    document.querySelector('#genTitle').innerHTML = 'Generation d\'une question simple a partir d\'une date';
  });

  // Listener pour generation de 10 question sur des chansons
  document.getElementById('chooseTypeMultipleFromSong').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('chooseType').style.display = 'none';
    document.getElementById('uniqueQuestion').style.display = 'none';
    document.getElementById('multipleQuestions').style.display = 'none';
    document.getElementById('multipleQuestionsFromSong').style.display = 'block';
    document.getElementById('multipleQuestionsFromArtist').style.display = 'none';

    document.querySelector('#multipleQuestionsFromSong textarea').innerHTML = '';
    document.querySelector('#genTitle').innerHTML = 'Generation de questions simples a partir de chansons';

    // TODO Appeler fonction de generation de 10 question random et afficher la text area avec le jsson generer
    $.ajax({
      url: '/api/questions/gen10/songArtists',
      data: {},
      success: (res) => {
        document.querySelector('#multipleQuestionsFromSong p').innerHTML = '';
        document.getElementById('backToChooseType').style.display = 'block';
        const textArea = document.querySelector('#multipleQuestionsFromSong textarea');

        textArea.innerHTML = JSON.stringify(res);
      },
      error: (error) => {
        document.querySelector('#multipleQuestionsFromSong p').innerHTML = '';
        const textArea = document.querySelector('#multipleQuestionsFromSong textarea');

        textArea.innerHTML = (error && error.error) ? error.error : JSON.stringify(error);
      }
    });
  });

  document.getElementById('chooseTypeMultipleFromArtist').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('chooseType').style.display = 'none';
    document.getElementById('uniqueQuestion').style.display = 'none';
    document.getElementById('multipleQuestions').style.display = 'none';
    document.getElementById('multipleQuestionsFromSong').style.display = 'none';
    document.getElementById('multipleQuestionsFromArtist').style.display = 'block';

    document.querySelector('#multipleQuestionsFromArtist textarea').innerHTML = '';
    document.querySelector('#genTitle').innerHTML = 'Generation de questions simples a partir de chansons';

    // TODO Appeler fonction de generation de 10 question random et afficher la text area avec le jsson generer
  }); */

  /* document.getElementById('backToArtistDivBtn').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('chooseType').style.display = 'block';
    document.getElementById('backToChooseType').style.display = 'none';
    document.getElementById('uniqueQuestion').style.display = 'none';
    document.getElementById('multipleQuestions').style.display = 'none';
    document.getElementById('multipleQuestionsFromSong').style.display = 'none';
    document.getElementById('multipleQuestionsFromArtist').style.display = 'none';
    result.innerHTML = '';
    result.classList.remove('active');
    result.classList.remove('error');
    $('#fake-date p').remove();
    $('#create-json textarea').remove();
    document.getElementById('fake-date').style.display = 'none';
    document.getElementById('create-json').style.display = 'none';
    document.querySelector('#genTitle').innerHTML = 'Generation de question(s) simple(s)';
  }); */
};

/* globals $ */
'use strict';

$(document).ready(function () {
  document.getElementById('dateArtistePrecis').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'none';
    document.getElementById('dateArtistePrecisDiv').style.display = 'block';
    document.getElementById('dateArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('albumArtistePrecisDiv').style.display = 'none';
    document.getElementById('albumArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('chansonArtistePrecisDiv').style.display = 'none';
    document.getElementById('chansonArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('allArtistePrecisDiv').style.display = 'none';
    document.getElementById('allArtisteAleatoireDiv').style.display = 'none';
    // document.getElementById('backToArtistDivFromPrecis').style.display = 'block';
    // document.getElementById('backToArtistDivFromAleatoire').style.display = 'none';
  });

  document.getElementById('dateArtisteAleatoire').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'none';
    document.getElementById('dateArtistePrecisDiv').style.display = 'none';
    document.getElementById('dateArtisteAleatoireDiv').style.display = 'block';
    document.getElementById('albumArtistePrecisDiv').style.display = 'none';
    document.getElementById('albumArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('chansonArtistePrecisDiv').style.display = 'none';
    document.getElementById('chansonArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('allArtistePrecisDiv').style.display = 'none';
    document.getElementById('allArtisteAleatoireDiv').style.display = 'none';
    // document.getElementById('backToArtistDivFromPrecis').style.display = 'none';
    // document.getElementById('backToArtistDivFromAleatoire').style.display = 'block';
  });

  document.getElementById('albumArtistePrecis').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'none';
    document.getElementById('dateArtistePrecisDiv').style.display = 'none';
    document.getElementById('dateArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('albumArtistePrecisDiv').style.display = 'block';
    document.getElementById('albumArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('chansonArtistePrecisDiv').style.display = 'none';
    document.getElementById('chansonArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('allArtistePrecisDiv').style.display = 'none';
    document.getElementById('allArtisteAleatoireDiv').style.display = 'none';
    // document.getElementById('backToArtistDivFromPrecis').style.display = 'none';
    // document.getElementById('backToArtistDivFromAleatoire').style.display = 'block';
  });

  document.getElementById('albumArtisteAleatoire').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'none';
    document.getElementById('dateArtistePrecisDiv').style.display = 'none';
    document.getElementById('dateArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('albumArtistePrecisDiv').style.display = 'none';
    document.getElementById('albumArtisteAleatoireDiv').style.display = 'block';
    document.getElementById('chansonArtistePrecisDiv').style.display = 'none';
    document.getElementById('chansonArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('allArtistePrecisDiv').style.display = 'none';
    document.getElementById('allArtisteAleatoireDiv').style.display = 'none';
    // document.getElementById('backToArtistDivFromPrecis').style.display = 'none';
    // document.getElementById('backToArtistDivFromAleatoire').style.display = 'block';
  });

  document.getElementById('chansonArtistePrecis').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'none';
    document.getElementById('dateArtistePrecisDiv').style.display = 'none';
    document.getElementById('dateArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('albumArtistePrecisDiv').style.display = 'none';
    document.getElementById('albumArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('chansonArtistePrecisDiv').style.display = 'block';
    document.getElementById('chansonArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('allArtistePrecisDiv').style.display = 'none';
    document.getElementById('allArtisteAleatoireDiv').style.display = 'none';
    // document.getElementById('backToArtistDivFromPrecis').style.display = 'none';
    // document.getElementById('backToArtistDivFromAleatoire').style.display = 'block';
  });

  document.getElementById('chansonArtisteAleatoire').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'none';
    document.getElementById('dateArtistePrecisDiv').style.display = 'none';
    document.getElementById('dateArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('albumArtistePrecisDiv').style.display = 'none';
    document.getElementById('albumArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('chansonArtistePrecisDiv').style.display = 'none';
    document.getElementById('chansonArtisteAleatoireDiv').style.display = 'block';
    document.getElementById('allArtistePrecisDiv').style.display = 'none';
    document.getElementById('allArtisteAleatoireDiv').style.display = 'none';
    // document.getElementById('backToArtistDivFromPrecis').style.display = 'none';
    // document.getElementById('backToArtistDivFromAleatoire').style.display = 'block';
  });

  document.getElementById('allArtistePrecis').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'none';
    document.getElementById('dateArtistePrecisDiv').style.display = 'none';
    document.getElementById('dateArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('albumArtistePrecisDiv').style.display = 'none';
    document.getElementById('albumArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('chansonArtistePrecisDiv').style.display = 'none';
    document.getElementById('chansonArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('allArtistePrecisDiv').style.display = 'block';
    document.getElementById('allArtisteAleatoireDiv').style.display = 'none';
    // document.getElementById('backToArtistDivFromPrecis').style.display = 'none';
    // document.getElementById('backToArtistDivFromAleatoire').style.display = 'block';
  });

  document.getElementById('allArtisteAleatoire').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('artistesDiv').style.display = 'none';
    document.getElementById('dateArtistePrecisDiv').style.display = 'none';
    document.getElementById('dateArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('albumArtistePrecisDiv').style.display = 'none';
    document.getElementById('albumArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('chansonArtistePrecisDiv').style.display = 'none';
    document.getElementById('chansonArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('allArtistePrecisDiv').style.display = 'none';
    document.getElementById('allArtisteAleatoireDiv').style.display = 'block';
    // document.getElementById('backToArtistDivFromPrecis').style.display = 'none';
    // document.getElementById('backToArtistDivFromAleatoire').style.display = 'block';
  });

  document.getElementById('testAleatoire').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('testDiv').style.display = 'none';
    document.getElementById('testAleatoireDiv').style.display = 'block';
  });
});

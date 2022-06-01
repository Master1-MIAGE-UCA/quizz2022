/* globals $ */
'use strict';

function navbarGeneration () {
  const tabsNewAnim = $('#navbarSupportedContent');
  // const selectorNewAnim = $('#navbarSupportedContent').find('li').length;
  const activeItemNewAnim = tabsNewAnim.find('.active');
  const activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
  const activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
  const itemPosNewAnimTop = activeItemNewAnim.position();
  const itemPosNewAnimLeft = activeItemNewAnim.position();
  $('.hori-selector').css({
    top: itemPosNewAnimTop.top + 'px',
    left: itemPosNewAnimLeft.left + 'px',
    height: activeWidthNewAnimHeight + 'px',
    width: activeWidthNewAnimWidth + 'px'
  });
  $('#navbarSupportedContent').on('click', 'li', function (e) {
    $('#navbarSupportedContent ul li').removeClass('active');
    $(this).addClass('active');
    // console.log($(this).children('a').text());
    const activeWidthNewAnimHeight = $(this).innerHeight();
    const activeWidthNewAnimWidth = $(this).innerWidth();
    const itemPosNewAnimTop = $(this).position();
    const itemPosNewAnimLeft = $(this).position();
    $('.hori-selector').css({
      top: itemPosNewAnimTop.top + 'px',
      left: itemPosNewAnimLeft.left + 'px',
      height: activeWidthNewAnimHeight + 'px',
      width: activeWidthNewAnimWidth + 'px'
    });
    changeDiv($(this).children('a').text());
  });
}

function changeDiv (newDivName) {
  if (newDivName === 'Accueil') {
    document.getElementById('accueil').style.display = 'block';
    document.getElementById('artistesDiv').style.display = 'none';
    document.getElementById('dateArtistePrecisDiv').style.display = 'none';
    document.getElementById('dateArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('albumArtistePrecisDiv').style.display = 'none';
    document.getElementById('albumArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('chansonArtistePrecisDiv').style.display = 'none';
    document.getElementById('chansonArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('allArtistePrecisDiv').style.display = 'none';
    document.getElementById('allArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('testDiv').style.display = 'none';
    document.getElementById('testAleatoireDiv').style.display = 'none';
    
    /* const backPrecisFromA = document.getElementsByClassName('backToArtistDivFromPrecis');
    for (let i = 0; i < backPrecisFromA.length; i++) {
      backPrecisFromA[i].style.display = 'none';
    }
    const backAleatoireFromA = document.getElementsByClassName('backToArtistDivFromAleatoire');
    for (let i = 0; i < backAleatoireFromA.length; i++) {
      backAleatoireFromA[i].style.display = 'none';
    } */
  } else if (newDivName === 'Artistes') {
    document.getElementById('accueil').style.display = 'none';
    document.getElementById('artistesDiv').style.display = 'block';
    document.getElementById('dateArtistePrecisDiv').style.display = 'none';
    document.getElementById('dateArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('albumArtistePrecisDiv').style.display = 'none';
    document.getElementById('albumArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('chansonArtistePrecisDiv').style.display = 'none';
    document.getElementById('chansonArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('allArtistePrecisDiv').style.display = 'none';
    document.getElementById('allArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('testDiv').style.display = 'none';
    document.getElementById('testAleatoireDiv').style.display = 'none';
  } else if (newDivName === 'Test') {
    document.getElementById('accueil').style.display = 'none';
    document.getElementById('artistesDiv').style.display = 'none';
    document.getElementById('dateArtistePrecisDiv').style.display = 'none';
    document.getElementById('dateArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('albumArtistePrecisDiv').style.display = 'none';
    document.getElementById('albumArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('chansonArtistePrecisDiv').style.display = 'none';
    document.getElementById('chansonArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('allArtistePrecisDiv').style.display = 'none';
    document.getElementById('allArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('testDiv').style.display = 'block';
    document.getElementById('testAleatoireDiv').style.display = 'none';
  } else {
    document.getElementById('accueil').style.display = 'none';
    document.getElementById('artistesDiv').style.display = 'none';
    document.getElementById('dateArtistePrecisDiv').style.display = 'none';
    document.getElementById('dateArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('albumArtistePrecisDiv').style.display = 'none';
    document.getElementById('albumArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('chansonArtistePrecisDiv').style.display = 'none';
    document.getElementById('chansonArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('allArtistePrecisDiv').style.display = 'none';
    document.getElementById('allArtisteAleatoireDiv').style.display = 'none';
    document.getElementById('testDiv').style.display = 'none';
    document.getElementById('testAleatoireDiv').style.display = 'none';
  }
}

$(document).ready(function () {
  setTimeout(function () { navbarGeneration(); });
});

$(window).on('resize', function () {
  setTimeout(function () { navbarGeneration(); }, 500);
});

$('.navbar-toggler').click(function () {
  setTimeout(function () { navbarGeneration(); });
});

/* global io Messages */
/* eslint-disable no-unused-vars, no-undef */

const socket = io();

/**
* Listening to the server that notifies that the game is over
*
socket.on(Messages.gameFinished, () => {
  document.getElementById('container').hidden = true;
  // document.getElementById('container').style.display = 'none';
  document.getElementById('containerScore').hidden = false;
}); */

window.onload = () => {
  /**
   * Add an event to the "join as guest" button
   */
  document.getElementById('guest')
    .addEventListener('click', function () {
      document.getElementById('home').hidden = true;
      // document.querySelector('#topnav').hidden = false;
      document.querySelector('.group').style.display = 'flex';
      // document.querySelector('.group').style.height = (document.querySelector('.group').offsetHeight - document.querySelector('#topnav').offsetHeight) + 'px';
      // console.log(document.getElementById('divroom').offsetHeight);
      socket.emit(Messages.username, null);
    }, false);

    document.getElementById('logo')
    .addEventListener('click', function () {
      document.getElementById('home').hidden = false;
    }, false);

  /**
   * Add event to the "quick game" button
   */
  document.querySelector('.quick')
    .addEventListener('click', function () {
      const boxB = document.querySelector('.box-button');
      boxB.style.flexGrow = 0.1;
      document.querySelector('.trans').classList.toggle('transform-active');
      const chat = document.querySelector('#chat');
      const list = document.querySelector('#list');
      const start = document.querySelector('.start');
      chat.style.display = 'initial';
      list.style.display = 'initial';
      start.style.display = 'flex';
    }, false);

  /**
   * Add event to the "start" button
   */
  document.querySelector('.start')
    .addEventListener('click', function () {
      socket.emit(Messages.beginQuizz, { state: true });
    });

    
  
    
};

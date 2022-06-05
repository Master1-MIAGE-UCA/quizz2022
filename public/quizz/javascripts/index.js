/* global io Messages */
/* eslint-disable no-unused-vars, no-undef */

const socket = io();

/**
* Listening to the server that notifies that the game is over

socket.on(Messages.gameFinished, () => {
  document.getElementById('container').hidden = true;
  // document.getElementById('container').style.display = 'none';
  document.getElementById('containerScore').hidden = false;
}); **/

window.onload = () => {
  var id;
  /**
   * Add an event to the "join as guest" button
   */
  document.getElementById('guest')
    .addEventListener('click', function () {
      id = "guest";
      document.getElementById('home').hidden = true;
      // document.querySelector('#topnav').hidden = false;
      document.querySelector('.group').style.display = 'flex';
      // document.querySelector('.group').style.height = (document.querySelector('.group').offsetHeight - document.querySelector('#topnav').offsetHeight) + 'px';
      // console.log(document.getElementById('divroom').offsetHeight);
      socket.emit(Messages.username, null);
    }, false);

  document.getElementById('logo')
    .addEventListener('click', function () {
      if(id!="start"){
        document.getElementById('home').hidden = false;
        document.getElementById('back').hidden = false;
        document.querySelector('.group').style.display ='none';
      }
    }, false);

  document.getElementById('back')
    .addEventListener('click', function () {
      console.log(id);
      switch (id) {
        case "guest":
          document.getElementById('home').hidden = false;
          break;
        case "quick":
          const boxB = document.querySelector('.box-button');
          boxB.style.flexGrow = 0.1;
          document.querySelector('.trans').classList.toggle('transform-active');
          document.querySelector('#chat').style.display = 'none';
          document.querySelector('#list').style.display = 'none';
          document.querySelector('.start').style.display = 'none';
          id = "guest";
          break;

        case "start":
          document.getElementById('home').hidden = false;
          
          break;
      }
    }, false);

  /**
   * Add event to the "quick game" button
   */
  document.querySelector('.quick')
    .addEventListener('click', function () {
      id = "quick";
      const boxB = document.querySelector('.box-button');
      boxB.style.flexGrow = 0.1;
      document.querySelector('.trans').classList.toggle('transform-active');
      const chat = document.querySelector('#chat');
      const list = document.querySelector('#list');
      const start = document.querySelector('.start');
      //const genQuestions = document.querySelector('.genQuestions');
      chat.style.display = 'initial';
      list.style.display = 'initial';
      start.style.display = 'flex';
      //genQuestions.style.display = 'flex';
    }, false);

  /**
   * Add event to the "start" button
   */
  document.querySelector('.start')
    .addEventListener('click', function () {
      id = "start";
      socket.emit(Messages.beginQuizz, { state: true });
      document.getElementById('back').hidden = true;
    });
/*
    document.querySelector('.genQuestions').addEventListener('click', function () {
      //$.ajax()
    });*/
    
    
    /**
   * Add event to the "quit" button
   */
     document.getElementById('quit')
     .addEventListener('click', function () {
       socket.emit(Messages.quitQuizz);
       document.getElementById('home').hidden = false;
       document.querySelector('.group').style.display ='none';


       

     });
 
    
};

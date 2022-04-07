/* eslint-disable no-unused-vars, no-undef */

/**
  * Listening to the server which sends a message to all clients
*/
socket.on(Messages.broadcast, (data) => {
  console.log(data.user);
  setPlayerName(data.user);
  addPlayerToList(data.user);
});

/**
  * Listening to the server which sends a question to display for the quiz
*/
socket.on(Messages.sendQuestion, (data) => {
  // console.log(data);
  const lobby = document.querySelector('.hidden');
  const question = document.querySelector('#container');
  const reponse = document.getElementById('answers');
  const nodes = document.getElementById('answers').childNodes;
  lobby.style.display = 'none';
  question.hidden = false;
  timer();
  renderingQuestion(data.question);
  renderingAnswers(data, nodes);
});

/**
  * Listening to the server which sends a message to the client who want to be a spectator
*/
socket.on(Messages.alreadyStarted, () => {
  const r = confirm('The game is already in progress! Would you like to join the party as a spectator?');
  if (r === true) { // ok button
    console.log('join as spectator');
    socket.emit(Messages.addSpectator, null);
  } else { // cancel button
    console.log('Do nothing');
  }
});

/**
  * Listening to the server which sends a message to init the start game page
*/
socket.on(Messages.start, () => {
  const lobby = document.querySelector('.hidden').style.display = 'none';
  const question = document.querySelector('#container').hidden = false;
});

/**
  * Sends a message to the server to receive an another question
*/
function nextQuestion() {
  socket.emit(Messages.nextQuestion, null);
}

/**
 * Add the player to a list of players displayed to the clients
 * @param {*} tab
 */
function addPlayerToList(tab) {
  const div1 = document.querySelector('.liste-joueur');
  if (typeof (div1) !== 'undefined' && div1 != null) {
    while (div1.firstChild) {
      div1.removeChild(div1.firstChild);
      // console.log("JE REMOVE");
    }
  }

  tab.forEach((e) => {
    const div = document.createElement('div');
    div.setAttribute('class', 'le-joueur');
    const span1 = document.createElement('span');
    span1.setAttribute('class', 'le-joueur__img');

    const img = document.createElement('img');
    img.setAttribute('alt', 'avatar');
    img.setAttribute('src', '');

    span1.appendChild(img);

    const span2 = document.createElement('span');
    span2.setAttribute('class', 'le-joueur__name');
    span2.innerHTML = e[1];

    div.appendChild(span1);
    div.appendChild(span2);
    div1.appendChild(div);
  });
}

/**
 * Add the username to the UI
 * @param {*} tab
 */
function setPlayerName(tab) {
  tab.forEach((e) => {
    if (e[0] === socket.id) {
      document.querySelector('.username').innerHTML = e[1];
    }
  });
}

function toggleSound(img) {
  
  soundOff = !soundOff;
  
  img.src = img.src == "http://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Speaker_Icon.svg/500px-Speaker_Icon.svg.png" ? "https://cdn2.iconfinder.com/data/icons/picons-essentials/57/music_off-512.png" : "http://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Speaker_Icon.svg/500px-Speaker_Icon.svg.png";
}

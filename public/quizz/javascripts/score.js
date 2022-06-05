/* eslint-disable no-unused-vars, no-undef */

/**
 * Listening to the server which sends player score board
 */
socket.on(Messages.gameFinished, (data) => {
  document.getElementById('container').hidden = true;
  // document.getElementById('container').style.display = 'none';
  document.getElementById('containerScore').hidden = false;
  console.log(data.playerScore);
  addPlayerScoreList(data.playerScore);
});

/**
 * Add the player and their scores to score table (UI)
 * @param {*} tab
 */
function addPlayerScoreList(tab) {
  const div1 = document.querySelector('.tableau-score');
  /* if (typeof (div1) !== 'undefined' && div1 != null) {
        while (div1.firstChild) {
            div1.removeChild(div1.firstChild);
            // console.log('JE REMOVE');      }
        }
    } */
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
  span2.innerHTML = tab[1];

  const span3 = document.createElement('span');
  span3.setAttribute('class', 'le-joueur__name');
  span3.innerHTML = tab[2] + ' Points';

  div.appendChild(span1);
  div.appendChild(span2);
  div.appendChild(span3);
  div1.appendChild(div);
}

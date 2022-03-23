/* eslint-disable no-unused-vars, no-undef */

const correct = new Audio('music/correct.wav');
const wrongA = new Audio('music/wrong.wav');
const countd = new Audio('music/count.wav');

/**
 * Manages the question time
 */
function timer () {
  const l = document.getElementById('l-half');
  const r = document.getElementById('r-half');
  const c = document.getElementById('count');

  c.innerHTML = 10;
  l.classList.remove('l-half');
  r.classList.remove('r-half');
  c.classList.remove('count');

  void l.offsetWidth;
  void r.offsetWidth;
  void c.offsetWidth;

  let TIMER;
  l.classList.add('l-half');
  r.classList.add('r-half');
  c.classList.add('count');

  TIMER = setInterval(renderCounter, 1000);

  function renderCounter () {
    if (c.innerHTML > 0) {
      c.innerHTML--;
      countd.play();
      countd.volume = 0.2;
    } else {
      countd.pause();
      countd.currentTime = 0;
      clearInterval(TIMER);
      nextQuestion();
    }
  }
}

let numQ = 0;
/**
 * Display the question sent to the UI
 * @param {*} data
 */
function renderingQuestion (data) {
  numQ++;
  const question = document.getElementById('question');
  const numQuestion = document.getElementById('numQuestion');

  question.innerHTML = data.question;
  numQuestion.innerHTML = 'Question n°' + numQ + '/10';
}

/**
 * Display the answers sent to the UI
 * @param {*} data
 */
function renderingAnswers (data, nodes) {
  const question = data.question;
  const answers = document.getElementById('answers');

  if (answers.childElementCount > 0) {
    while (answers.firstChild) {
      answers.removeChild(answers.firstChild);
    }
  }

  let compteurId = 0;
  if (question != null && question.proposition != null) {
    question.proposition.forEach(element => {
      const button = document.createElement('button');
      button.setAttribute('id', compteurId);
      button.setAttribute('class', 'game-button orange');
      button.textContent = element;
      answers.appendChild(button);
      compteurId++;
    });
  } else {
    const noData = document.createElement('p');
    noData.textContent = 'NO DATA';
    answers.appendChild(noData);
  }

  if (data.isSpectator) {
    nodes.forEach(element => {
      element.classList.add('disabled');
    });
  }

  const buttons = answers.querySelectorAll('button');
  buttons.forEach(b => b.addEventListener('click', function () {
    const selected = document.querySelector('.selected');
    if (selected) selected.classList.remove('selected');
    this.classList.add('selected');
    socket.emit(Messages.checkAnswer, { id: b.getAttribute('id') });
  }));
}

/**
  * Listening to the server which sends the results of the verification of the responses
*/
socket.on(Messages.answerChecked, (data) => {
  const buttons = answers.querySelectorAll('button');
  buttons.forEach(element => {
    if (element.getAttribute('id') === data.id) {
      if (data.answer) {
        correct.play();
        const right = document.querySelector('.rightAnswer');
        if (right) right.classList.remove('rightAnswer');
        element.classList.add('rightAnswer');
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].disabled = true;
          buttons[i].style.pointerEvents = 'none';
        }
      } else {
        wrongA.play();
        const wrong = document.querySelector('.wrongAnswer');
        if (wrong) wrong.classList.remove('wrongAnswer');
        element.classList.add('wrongAnswer');
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].disabled = true;
          buttons[i].style.pointerEvents = 'none';
        }
      }
    }
  });
  if(data.newScore != null){
    const score = document.getElementById('score');
    score.innerHTML = "Score : " + data.newScore;
  }
});

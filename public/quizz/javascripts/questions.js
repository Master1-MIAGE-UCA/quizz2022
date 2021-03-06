/* eslint-disable no-unused-vars, no-undef */

const correct = new Audio('../quizz/music/correct.wav');
const wrongA = new Audio('../quizz/music/wrong.wav');
const countd = new Audio('../quizz/music/count.wav');
let soundOff=false;
/**
 * Manages the question time
 * @param {*} data
 */
function timer(data) {
  const l = document.getElementById('l-half');
  const r = document.getElementById('r-half');
  const c = document.getElementById('count');
  const rightResponse=document.getElementById('rightResponse');
  rightResponse.hidden=true;


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
  
  function renderCounter() {
    if (c.innerHTML > 0) {
      c.innerHTML--;
      if(soundOff){
        countd.pause();
      }
      else{
        countd.play();
        countd.volume = 0.2;
      }   
    } else {
      countd.pause();
      countd.currentTime = 0;
      clearInterval(TIMER);  
      //disable buttons after time runs out so the player can't cheat
      const buttons = answers.querySelectorAll('button');
      buttons.forEach(element => {
            for (let i = 0; i < buttons.length; i++) {
              buttons[i].disabled = true;
              buttons[i].style.pointerEvents = 'none';
              if(buttons[i].textContent===data.proposition[data.indexreponse]){
                buttons[i].style.border = "solid 12px green";
                buttons[i].style.fontSize="30px";

              }
            } 
      });
      if(data != null){
      rightResponse.hidden=false;
      rightResponse.innerHTML ="✓ The right answer is: "+data.proposition[data.indexreponse];
      rightResponse.style.fontSize="20px"
      rightResponse.style.color="green"

    
                      }

      setTimeout(nextQuestion, 4000) //Wait 4 seconds before continuing to next function: nextQuestion();

    }
  }
}

let numQ = 0;
/**
 * Display the question sent to the UI
 * @param {*} data
 */
function renderingQuestion(data) {
  numQ=data.num;

  const question = document.getElementById('question');
  const numQuestion = document.getElementById('numQuestion');

  question.innerHTML = data.question;
  numQuestion.innerHTML = 'Question n°' + numQ + '/10';
}

/**
 * Display the answers sent to the UI
 * @param {*} data
 */
function renderingAnswers(data, nodes) {
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
        if(soundOff){
          correct.pause();
        }
        else{
          correct.play();
        }
        const right = document.querySelector('.rightAnswer');
        if (right) right.classList.remove('rightAnswer');
        element.classList.add('rightAnswer');
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].disabled = true;
          buttons[i].style.pointerEvents = 'none';
        }
      } else {
        if(soundOff){
          wrongA.pause();
        }
        else{
          wrongA.play();
        }
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
  if (data.newScore != null) {
    const score = document.getElementById('score');
    score.innerHTML = "Score : " + data.newScore;
  }
});

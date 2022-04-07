/**
 * @class
 * @description Manages the socketio events names.
 */

class Messages {
  constructor () {
    throw new TypeError('Abstract class \'Messages\' cannot be instantiated directly');
  }
}

// serveur → client
Messages.broadcast = 'server:broadcast';
Messages.userlist = 'server:userlist';
Messages.usernametaken = 'server:nickname';
Messages.sendQuestion = 'server:sendQuestion';
Messages.phaseStart = 'server:phaseStart';
Messages.phaseEnd = 'server:phaseEnd';
Messages.gameFinished = 'server:gameFinished';
Messages.selectTheme = 'server:selectTheme';
Messages.start = 'serveur:start';
Messages.sendPlayerScore = 'sereur:sendPlayerScore';
Messages.alreadyStarted = 'sereur:alreadyStarted';
Messages.answerChecked = 'sereur:answerChecked';

// client → serveur
Messages.username = 'client:username';
Messages.startGame = 'client:startGame';
Messages.nextQuestion = 'client:nextQuestion';
Messages.beginQuizz = 'client:beginQuizz';
Messages.quitQuizz='client:quitQuizz';
Messages.checkAnswer = 'client:checkAnswer';
Messages.finalScore = 'client:finalScore';
Messages.addSpectator = 'client:addSpectator';

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Messages;
}

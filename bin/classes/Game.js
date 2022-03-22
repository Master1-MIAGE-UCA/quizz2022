const Player = require('./Player');
const Messages = require('./Messages');

/**
 * @class
 * @description The class to manage the Game.
 */
class Game {
  /**
   * @constructs Game
   * @param {Array} clientList - List of Clients, (socketid, clientname, socket).
   * @param io - the socketio io object.
   * @param jsonData
   */
  constructor(clientList, io, jsonData, id) {
    this.io = io;
    this.jsonData = jsonData;
    this.id = id;
    this.spectator = [];
    this.initPlayer(clientList);
    this.initQuizData();
    this.gameStarted = false;
  }

  /**
   * Create the players with their socketio object and store them in an array (playerList)
   * Also initializes the player scoreboard
   * @param {Array} clientList
   */
  initPlayer(clientList) {
    this.playerList = [];
    for (let i = 0; i < clientList.length; i++) {
      this.playerList.push(new Player(clientList[i][0], clientList[i][2]));
    }
    this.playerList.forEach(element => {
      element.initGameScore(this.id);
    });
  }

  /**
   * Allows to clone the question's array (object) without keeping a reference to the copied objects
   */
  initQuizData() {
    if (this.jsonData !== null || this.jsonData !== 'undefined') {
      this.quizData = this.jsonData.map((a) => ({ ...a }));
      this.copyQuizData = this.quizData.map((a) => ({ ...a }));
    } else {
      console.log('Server> Problem reached with jsonData');
    }
  }

  /**
   * Allows you to randomly select a question from the question array and remove the
   * answer ID to prevent players from seeing the answer on the client side
   * @returns a question (Object)
   */
  selectQuestion() {
    this.question = this.copyQuizData[Math.floor(Math.random() * this.copyQuizData.length)];
    this.copyQuizData.splice(this.copyQuizData.indexOf(this.question), 1);
    delete this.question.indexreponse;
    return this.question;
  }

  /**
   * Sends the chosen question for the next turn to all players
   * @param {Object} chosenQuestion
   */
  sendQuestion(chosenQuestion) {
    this.playerList.forEach(element => {
      this.io.to(element.getSocket().id).emit(Messages.sendQuestion, { question: chosenQuestion, isSpectator: false });
    });
    if (this.spectator.length > 0) {
      this.spectator.forEach(element => {
        this.io.to(element).emit(Messages.sendQuestion, { question: chosenQuestion, isSpectator: true });
      });
    }
  }

  /**
   * Sends the final player's score array to the client to display it
   * @param {Array} tab
   */
  sendPlayerScore(tab) {
    this.io.sockets.emit(Messages.gameFinished, { playerScore: tab });
    // this.io.sockets.emit(Messages.sendPlayerScore, { playerScore: tab });
  }

  /**
   * Allows you to start the game and begin the quiz
   */
  start() {
    this.gameStarted = true;
    this.question = this.selectQuestion();
    this.sendQuestion(this.question);
  }

  /**
   * Allows you to add the client who wishes to be a spectator to a spectator list
   * and send them questions during the game.
   * @param {String} socketid
   */
  addSpectator(socketid) {
    this.spectator.push(socketid);
    this.io.to(socketid).emit(Messages.sendQuestion, { question: this.question, isSpectator: true });
  }

  /**
   * Check if a player has played
   * @returns true or false
   */
  checkPlayerState() {
    let state = false;
    for (let i = 0, len = this.playerList.length; i < len; i++) {
      if (this.playerList[i].getStatus() === true) {
        state = true;
      } else {
        return false;
      }
    }
    return state;
  }

  /**
   * Allows you to check the answer id sent by the client with the answer's id of the question 
   * being played. If it is correct, the player is awarded a point and sends a message to the 
   * client to say whether it is right or wrong.
   * @param {String} id
   * @param {String} socketid
   */
  checkPlayerAnswer(id, socketid) {
    const name = this.findPlayerBySocket(socketid);
    console.log(`Server> the response ID sent by the client for verification : ${id}`);
    this.quizData.forEach(element => {
      if (element.question === this.question.question) {
        console.log(`Server> indexreponse ${element.indexreponse}`);
        console.log(`Server> id received ${id}`);
        if (element.indexreponse.toString() === id) {
          console.log(`Server> ${name} found the correct answer !`);
          this.playerList.forEach(element => {
            if (element.getName() === name) {
              element.addPoint();
            }
          });
          this.io.to(socketid).emit(Messages.answerChecked, { answer: true, id: id });
        } else {
          console.log(`Server> ${name} clicked on the wrong answer !`);
          this.io.to(socketid).emit(Messages.answerChecked, { answer: false, id: id });
        }
      }
    });
  }

  /**
   * Allows you to find a player's nickname using their client socket ID
   * @param {String} socketid
   * @returns pseudo of player or null
   */
  findPlayerBySocket(socketid) {
    let exist = null;
    for (let i = 0, len = this.playerList.length; i < len; i++) {
      if (this.playerList[i].getSocket().id === socketid) {
        exist = this.playerList[i].getName();
        break;
      }
    }
    return exist;
  }

  /**
   * Allows you to change the game status of all players to false.
   */
  setPlayerStateFalse() {
    this.playerList.forEach(element => {
      element.setStatus(false);
    });
  }

  /**
   * Allows the player's game status to be changed to true
   * @param {Object} socketid
   */
  setPlayerStateTrue(socket) {
    this.playerList.forEach(element => {
      if (element.getSocket().id === socket.id) {
        element.setStatus(true);
      }
    });
  }

  getStatus() {
    return this.gameStarted;
  }

  getPlayerList() {
    return this.playerList;
  }

  getCopyQuizData() {
    return this.copyQuizData;
  }
}

module.exports = Game;

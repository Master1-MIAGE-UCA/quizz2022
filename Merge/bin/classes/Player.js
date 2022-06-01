/**
 * @class
 * @description Is a player of the game.
 */
class Player {
  constructor(socket, name) {
    this.name = name;
    this.socket = socket;
    this.hasPlayed = false;
    this.gameScore = [];
    this.records = [];
  }

  /**
   * Initializes the player scoreboard
   * @param {String} gameId 
   */
  initGameScore(gameId) {
    if (this.gameScore.length > 0) this.gameScore = [];
    this.gameScore.push(this.socket.id);
    this.gameScore.push(this.name);
    this.gameScore.push(0);
  }



  /**
   * Keep a record of the game played
   * @param {Array} tab 
   */
  addToRecords(tab) {
    // TO DO
    this.records.push(tab);
  }

  addPoint() {
    this.gameScore[2] += 1;
  }

  getStatus() {
    return this.hasPlayed;
  }

  setStatus(status) {
    this.hasPlayed = status;
  }

  getSocket() {
    return this.socket;
  }

  getName() {
    return this.name;
  }

  getPlayerScore() {
    return this.gameScore;
  }
}

module.exports = Player;

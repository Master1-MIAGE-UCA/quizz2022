const Messages = require('../classes/Messages');
const Game = require('../classes/Game');
const fs = require('fs');
const faker = require('faker');

function io(http) {
  const io = require('socket.io')(http);
  let jsonData = null;
  let game = null;
  let guestUserName = '';
  /*
    fs.readFile('./questionMusique.json', (err, data) => {
      if (err) throw err;
      jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData))
    });*/

  /**
   * Array of players connected
   */
  const activeUsers = [];
  const quitUsers = [];

  /**
   * Listening to the clients who try to connect to the server
   */
  io.on('connection', (socketClient) => {
    console.log(`Connected to client : ${socketClient.id}`);

    /**
    * Listening to the clients who ask for a username
    */
    socketClient.on(Messages.username, () => {
      let alreadyExist = false;
      activeUsers.forEach(element => {
        console.log("socket id " + socketClient.id + "    element id " + element[1]);
        if (socketClient.id == element[1]) {
          console.log("existe déjà");
          alreadyExist = true;
        }
      });
      if (!alreadyExist) {
        console.log("n'existe pas");
        guestUserName = 'Guest_' + faker.name.firstName();
        activeUsers.push([socketClient, socketClient.id, guestUserName, false]);
        console.log('socket id : ' + socketClient.id + ', is identified as : ' + guestUserName);
        const userlist = activeUsers.map(a => a.filter((b, i) => i === 1 || i === 2));
        io.sockets.emit(Messages.broadcast, { user: userlist });
        console.log(`Server> Displaying the client list ${userlist}`);

      }
      else {
        //the player who left the game can come back to play and join the other players (at the same level)
        quitUsers.forEach(function (element, i) {
          if (element.getSocket().id == socketClient.id) {
            activeUsers.forEach(function (elem, j) {
              if (elem[1] == socketClient.id) {
                game.getPlayerList().push(element);
                game.setPlayerStateTrue(socketClient);
              }
            }
            );
          }
        });

      }
    });

    /**
     * Listening to the clients who decide to start the game
     */
    socketClient.on(Messages.beginQuizz, (data) => {
      console.log('Server> Is there at least two players ?!');
      console.log('Server> checking...');
      console.log(`Server> Player's number : ${activeUsers.length}`);



      if (game !== null && game !== 'undefined') {
        console.log(Object.values(game));
        if (game.getStatus()) {
          console.log('***************** GAME STARTED ******************');
          io.sockets.emit(Messages.alreadyStarted, null);
        }
      } else {
        setTimeout(function () {
          fs.readFile('./questionMusique.json', (err, data) => {
            if (err) throw err;
            jsonData = JSON.parse(data);
            console.log(JSON.stringify(jsonData))
            game = new Game(activeUsers, io, jsonData, '1');
            game.start();
          });
        }, 1000);
      }
    });

    /**
     * Listening to the clients who decide to quit the game
     */
    socketClient.on(Messages.quitQuizz, (data) => {
      console.log('GAME FINISHED');
      game.getPlayerList().forEach(function (element, i) {
        if (element.getSocket().id == socketClient.id) {
          quitUsers.push(element);
          game.getPlayerList().splice(i, 1);

        }
      });

      // when all players leave the game
      if (game.getPlayerList().length == 0) {
        io.sockets.emit(Messages.gameFinished, null);

      }


    });

    /**
     * Listening to the clients who send their chosen answer
     */
    socketClient.on(Messages.checkAnswer, (data) => {
      game.checkPlayerAnswer(data.id, socketClient.id);
    });

    /**
     * Listening to the clients who want to be a spectator
     */
    socketClient.on(Messages.addSpectator, () => {
      game.addSpectator(socketClient.id);
      console.log('Spectator added');
      console.log(game.spectator);
    });

    /**
     * Listening to the clients who finished their turns and ask for the next question
     */
    socketClient.on(Messages.nextQuestion, () => {
      let playerState;
      if (game !== null || game !== 'undefined') {
        game.setPlayerStateTrue(socketClient);
        playerState = game.checkPlayerState();
      } else {
        playerState = false;
      }
      console.log(`Server> playerState setting : ${playerState}`);

      if (playerState) {
        game.setPlayerStateFalse();
        console.log('Server> Checking players state set : ');
        game.getPlayerList().forEach(element => {
          console.log(`******* Player ${element.getName()} → ${element.getStatus()}`);
        });

        if (game.getCopyQuizData().length === 0) {
          console.log('********************* END *********************');
          game.getPlayerList().forEach(element => {
            console.log(element.getPlayerScore());
            game.sendPlayerScore(element.getPlayerScore());
          });
          //io.sockets.emit(Messages.gameFinished, null);
        } else {
          console.log('********************* NEXT QUESTION *********************');
          game.getPlayerList().forEach(element => {
            console.log(element.getPlayerScore());

          });
          const chosenQuestion = game.selectQuestion();
          game.sendQuestion(chosenQuestion);
        }
      } else {
        console.log('Server> Waiting all player to finish their game');
      }
    });

    /**
     * Listening to the client who disconnects, close the web page
     */
    socketClient.on('disconnect', () => {
      console.log('user disconnected : ' + socketClient.id);
      activeUsers.forEach(function (element, i) {
        if (element[1] == socketClient.id) {
          activeUsers.splice(i, 1);
        }
      });
    });
  });
}

module.exports = io;

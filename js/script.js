"use strict";

const h1 = document.querySelector("h1");
const h3 = document.querySelector("h3");
const grid = document.querySelector(".grid-container");

function gameBoard() {
  const availableCells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let winningCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  //Create player factory
  function Player(name, marker, active) {
    function getName() {
      return name;
    }
    function getMarker() {
      return marker;
    }
    function getActiveStatus() {
      return active;
    }

    function setName(newName) {
      name = newName;
    }

    function setMarker(newMarker) {
      marker = newMarker;
    }

    function toggleActiveStatus() {
      if (active === true) active = false;
      else if (active === false) active = true;
    }

    return {
      getName,
      getMarker,
      getActiveStatus,
      setName,
      setMarker,
      toggleActiveStatus,
    };
  }

  //Create Players via factory
  const players = [Player("player1", "x", true), Player("player2", "o", false)];

  //function to associate cell with a player and ultimately alter the winning combinations array
  function selectCell(cell, player, availableCells) {
    //Check to make sure the move is valid
    if (getAvailableCells().includes(cell)) {
      availableCells.splice(availableCells.indexOf(cell), 1);

      //Add the players name into each instance of the cell in winning combinations
      const transformedCombos = winningCombinations.map(function (el) {
        return el.map(function (innerEl) {
          if (cell === innerEl) return player.getName();
          else return innerEl;
        });
      });

      console.log(getAvailableCells());

      //Reset winning combinations
      winningCombinations = transformedCombos;
      return winningCombinations;
    } else return "ERROR: That square is not available.";
  }

  function swapActiveStatus() {
    //Change the active player
    players.forEach(function (player) {
      player.toggleActiveStatus();
    });
  }

  function checkWinner(player, winningCombinations) {
    for (let row of winningCombinations) {
      if (
        row[0] === row[1] &&
        row[1] == row[2] &&
        row[2] === player.getName()
      ) {
        return true;
      }
    }
    return false;
  }

  //board level getters
  function getWinningCombinations() {
    return winningCombinations;
  }
  function getAvailableCells() {
    return availableCells;
  }

  function getPlayers() {
    return players;
  }

  function getActivePlayer() {
    return players.filter(function (player) {
      return player.getActiveStatus() === true;
    })[0];
  }

  return {
    getWinningCombinations,
    getAvailableCells,
    selectCell,
    checkWinner,
    getPlayers,
    getActivePlayer,
    swapActiveStatus,
  };
}

function game() {
  const board = gameBoard();
  let won = false;

  grid.addEventListener("click", function (e) {
    h3.textContent = `${board.getActivePlayer().getName()}'s turn`;

    if ([...e.target.classList].includes("grid-item") && won == false) {
      const id = parseInt(e.target.id);
      if (board.getAvailableCells().includes(id)) {
        board.selectCell(
          id,
          board.getActivePlayer(),
          board.getAvailableCells()
        );
        e.target.textContent = `${board.getActivePlayer().getMarker()}`;

        if (
          board.checkWinner(
            board.getActivePlayer(),
            board.getWinningCombinations()
          )
        ) {
          h1.textContent = `${board.getActivePlayer().getName()} Wins!`;
          h3.textContent = "Click new game to play again!";
          won = true;
        } else {
          board.swapActiveStatus();

          h3.textContent = `${board.getActivePlayer().getName()}'s turn`;
        }
      }
    }
  });
}

const newGame = document.querySelector(".new-game");
game();
newGame.addEventListener("click", function () {
  const gridItems = document.querySelectorAll(".grid-item");

  h1.textContent = "Tic Tac Toe";
  h3.textContent = "New Game Started. player1's move";
  gridItems.forEach(function (item) {
    item.textContent = "";
  });
  const board = gameBoard();
  game();
});

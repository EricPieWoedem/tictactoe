const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    const getBoard = () => board;
    const updateBoard = (index, marker) => {
        if (board[index] === "") board[index] = marker;
    };
    const resetBoard = () => board.fill("");
    return { getBoard, updateBoard, resetBoard };
})();

const Player = (name, marker) => {
    return { name, marker };
};

let players = [];

const GameController = (() => {
    let currentPlayerIndex = 0;
    let isGameOver = false;

    const initializeGame = (player1Name, player2Name) => {
        players = [Player(player1Name, "X"), Player(player2Name, "O")];
        currentPlayerIndex = 0;
        Gameboard.resetBoard();
    };

    const playTurn = (index) => {
        if (isGameOver) return;

        const board = Gameboard.getBoard();
        if (board[index] !== "") return;

        Gameboard.updateBoard(index, players[currentPlayerIndex].marker);

        if (checkWin()) {
            displayController.updateStatus(`${players[currentPlayerIndex].name} wins!`);
            isGameOver = true;
        } else if (checkTie()) {
            displayController.updateStatus("It's a tie!");
            isGameOver = true;
        } else {
            currentPlayerIndex = 1 - currentPlayerIndex; 
            displayController.updateStatus(`${players[currentPlayerIndex].name}'s Turn`);
        }
    };

   const resetGame = () => {
    isGameOver = false;
    Gameboard.resetBoard();
    currentPlayerIndex = 0;
    displayController.updateStatus(`${players[currentPlayerIndex].name}'s Turn`);
    displayController.resetUI();
   }

   const checkWin = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]           
        ];

        return winPatterns.some(pattern => 
            pattern.every(index => board[index] === players[currentPlayerIndex].marker)
        );
    };

    const checkTie = () => {
        return !Gameboard.getBoard().includes("");
    };

    return { initializeGame, playTurn, resetGame, checkWin, checkTie };
})();

const displayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const statusDisplay = document.querySelector(".status");
    const restartButton = document.querySelector(".restart");
  
    const renderBoard = (board) => {
      cells.forEach((cell, index) => {
        cell.textContent = board[index]; 
      });
    };
  
    const updateStatus = (message) => {
      statusDisplay.textContent = message;
    };
  
    const resetUI = () => {
      renderBoard(Gameboard.getBoard());
    };
  
    restartButton.addEventListener("click", () => {
      GameController.resetGame();
    });
  
    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        GameController.playTurn(parseInt(index)); 
        renderBoard(Gameboard.getBoard()); 
      });
    });
  
    return { renderBoard, updateStatus, resetUI };
  })();

  const playerFormModal = document.querySelector("#player-form-modal");
const playerNameForm = document.querySelector("#player-name-form");
const player1Input = document.querySelector("#player1-name");
const player2Input = document.querySelector("#player2-name");

playerNameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const player1Name = player1Input.value || "Player 1";
  const player2Name = player2Input.value || "Player 2";

  GameController.initializeGame(player1Name, player2Name);

  displayController.updateStatus(`${player1Name}'s Turn`);

  playerFormModal.style.display = "none";
});

  


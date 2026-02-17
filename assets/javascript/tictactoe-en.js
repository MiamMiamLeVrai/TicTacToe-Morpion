document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("playerChoice");
  const result = document.getElementById("playerResult");
  const turnInfos = document.getElementById("turnInfos");
  const resetBtn = document.getElementById("restartButton");
  const rechooseBtn = document.getElementById("rechoosePlayer");
  const rechoosePlayerText = document.getElementById("rechoosePlayerText");
  const winInfos = document.getElementById("winsInfos");
  const cells = document.querySelectorAll(".cell");

  let currentPlayer = null;
  let board = Array(9).fill("");
  let gameActive = false;

  function resetGame() {
    currentPlayer = null;
    board = Array(9).fill("");
    gameActive = false;
    result.textContent = "";
    turnInfos.textContent = "";
    winInfos.textContent = "";
    rechooseBtn.disabled = true;
    rechooseBtn.style.cursor = "not-allowed";
    rechoosePlayerText.textContent = "";
    btn.disabled = false;
    btn.style.cursor = "pointer";
    resetBtn.disabled = true;
    resetBtn.style.cursor = "not-allowed";
    cells.forEach((cell) => {
      cell.textContent = "";
    });
  }

  function verifyWin() {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  resetBtn.style.cursor = "not-allowed";
  rechooseBtn.style.cursor = "not-allowed";

  rechooseBtn.addEventListener("click", () => {
    resetGame();
    currentPlayer = Math.random() < 0.5 ? "X" : "O";
    rechoosePlayerText.textContent = `New player chosen: ${currentPlayer}`;
    result.textContent = `It's the turn of player ${currentPlayer} to start!`;
    gameActive = true;
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
    resetBtn.disabled = false;
    resetBtn.style.cursor = "pointer";
    rechooseBtn.disabled = false;
    rechooseBtn.style.cursor = "pointer";
  });

  btn.addEventListener("click", () => {
    currentPlayer = Math.random() < 0.5 ? "X" : "O";
    result.textContent = `It's the turn of player ${currentPlayer} to start!`;
    turnInfos.textContent = "";
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
    gameActive = true;
    resetBtn.disabled = false;
    resetBtn.style.cursor = "pointer";
    rechooseBtn.disabled = false;
    rechooseBtn.style.cursor = "pointer";
  });

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const index = Number(cell.getAttribute("data-cell"));
      if (!gameActive) {
        alert("Please choose a player to start the game.");
        return;
      }
      if (board[index] !== "") {
        return;
      }

      board[index] = currentPlayer;
      cell.textContent = currentPlayer;

      resetBtn.disabled = false;
      resetBtn.style.cursor = "pointer";
      rechooseBtn.disabled = false;
      rechooseBtn.style.cursor = "pointer";

      const winner = verifyWin();
      if (winner) {
        winInfos.textContent = `The player ${winner} has won!`;
        gameActive = false;
        turnInfos.textContent = "";
        result.textContent = "";
        return;
      }

      if (board.every((cellVal) => cellVal !== "")) {
        winInfos.textContent = "Draw, you can restart a new game!";
        gameActive = false;
        result.textContent = "";
        turnInfos.textContent = "";
        return;
      }

      currentPlayer = currentPlayer === "X" ? "O" : "X";
      turnInfos.textContent = `It's the turn of player ${currentPlayer} to play.`;
      result.textContent = "";
    });
  });

  resetBtn.addEventListener("click", resetGame);
});

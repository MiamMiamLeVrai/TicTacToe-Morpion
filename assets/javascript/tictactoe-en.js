document.addEventListener("DOMContentLoaded", function () {
    const cells = document.querySelectorAll(".cell");
    const btnChoice = document.getElementById("playerChoice");
    const resultText = document.getElementById("playerResult");
    const turnInfos = document.getElementById("turnInfos");
    const winsInfos = document.getElementById("winsInfos");
    const restartBtn = document.getElementById("restartButton");
    const rechooseBtn = document.getElementById("rechoosePlayer");

    let currentPlayer = null;
    let board = Array(9).fill("");
    let gameActive = false;
    
    restartBtn.style.pointerEvents = "none";
    rechooseBtn.style.pointerEvents = "none";

    function resetGame() {
        currentPlayer = null;
        board = Array(9).fill("");
        gameActive = false;
        resultText.textContent = "";
        turnInfos.textContent = "";
        winsInfos.textContent = "";
        resultText.style.transform = "translateX(200%)";
        turnInfos.style.transform = "translateX(200%)";
        winsInfos.style.transform = "translateX(200%)";
        resultText.style.opacity = 0;
        turnInfos.style.opacity = 0;
        winsInfos.style.opacity = 0;
        btnChoice.disabled = false;
        btnChoice.style.pointerEvents = "auto";
        restartBtn.disabled = true;
        restartBtn.style.pointerEvents = "none";
        rechooseBtn.disabled = true;
        rechooseBtn.style.pointerEvents = "none";
        cells.forEach((cell) => {
            cell.style.backgroundColor = "";
            cell.textContent = "";
            cell.disabled = false;
            cell.style.pointerEvents = "auto";
            cell.setAttribute("aria-label", "Empty cell");
        });
    }

    function verifyWin() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];
        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return {
                    winner: board[a],
                    combo: [a, b, c]
                };
            }
        }
        return null;
    }

    cells.forEach((cell) => {
        cell.addEventListener("click", () => {
            const index = Number(cell.getAttribute("data-cell"));
            if (!gameActive) {
                alert("Before starting the game, click on the \"Choose randomly!\" button");
                return;
            }
            if (board[index] !== "") {
                cell.setAttribute("aria-label", `This space is taken by the player ${board[index]}.`);
                return;
            }

            board[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.setAttribute("aria-label", `This square has just been taken by the player ${currentPlayer}.`);
            cell.disabled = true;
            cell.style.pointerEvents = "none";
            restartBtn.disabled = false;
            restartBtn.style.pointerEvents = "auto";
            rechooseBtn.disabled = false;
            rechooseBtn.style.pointerEvents = "auto";

            const winData = verifyWin();
            if (winData) {
                const { winner, combo } = winData;
                
                combo.forEach((index) => {
                    cells[index].style.backgroundColor = "#00B400";
                    cells[index].setAttribute("aria-label", `Winning cells occupied by the player ${winner}.`);
                    cells[index].style.pointerEvents = "none";
                });
                winsInfos.textContent = `The player ${winner} has won! A rematch ?`;
                winsInfos.style.transform = "translateX(0%)";
                winsInfos.style.opacity = 1;
                gameActive = false;
                cells.forEach(cell => {
                    cell.disabled = true;
                    cell.style.pointerEvents = "none";
                }); 
                return;
            }

            if (board.every((cellVal) => cellVal !== "")) {
                resultText.textContent = "";
                turnInfos.textContent = "";
                winsInfos.textContent = "Draw, you can restart a new game!";
                winsInfos.style.transform = "translateX(0%)";
                winsInfos.style.opacity = 1;
                gameActive = false;
                cells.forEach(cell => {
                    cell.disabled = true;
                    cell.style.pointerEvents = "none";
                    cell.setAttribute("aria-label", "Boxes disabled after a draw.");
                });
                return;
            }
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            resultText.textContent = "";
            turnInfos.textContent = `It's the turn of player ${currentPlayer} to play.`;
            turnInfos.style.transform = "translateX(0%)";
            turnInfos.style.opacity = 1;
        });
    });
    
    btnChoice.addEventListener("click", () => {
        gameActive = true;
        currentPlayer = Math.random() < 0.5 ? "X" : "O";
        resultText.style.transform = "translateX(0%)";
        resultText.textContent = `It's the turn of player ${currentPlayer} to start!`;
        resultText.style.opacity = 1;
        btnChoice.disabled = true;
        btnChoice.style.pointerEvents = "none";
        restartBtn.disabled = false;
        restartBtn.style.pointerEvents = "auto";
        rechooseBtn.disabled = false;
        rechooseBtn.style.pointerEvents = "auto";
    });
    rechooseBtn.addEventListener("click", () => {
        resetGame();
        gameActive = true;
        currentPlayer = Math.random() < 0.5 ? "X" : "O";
        resultText.textContent = `It's the turn of player ${currentPlayer} to start!`;
        resultText.style.transform = "translateX(0%)";
        resultText.style.opacity = 1;
        btnChoice.disabled = true;
        btnChoice.style.pointerEvents = "none";
        restartBtn.disabled = false;
        restartBtn.style.pointerEvents = "auto";
        rechooseBtn.disabled = false;
        rechooseBtn.style.pointerEvents = "auto";
    });
    restartBtn.addEventListener("click", resetGame);
});

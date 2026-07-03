document.addEventListener("DOMContentLoaded", function () {
    const cells = document.querySelectorAll(".cell");
    const btnChoice = document.getElementById("playerChoice");
    const resultText = document.getElementById("playerResult");
    const turnInfos = document.getElementById("turnInfos");
    const winsInfos = document.getElementById("winsInfos");
    const restartBtn = document.getElementById("restartButton");

    let currentPlayer = null;
    let board = Array(9).fill("");
    let gameActive = false;

    restartBtn.style.pointerEvents = "none";
    
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
        restartBtn.style.pointerEvents = "none";
        restartBtn.disabled = true;
        cells.forEach((cell) => {
            cell.style.backgroundColor = "";
            cell.textContent = "";
            cell.disabled = false;
            cell.style.pointerEvents = "auto";
            cell.setAttribute("aria-label", "Empty cell, row " + (Math.floor(cell.getAttribute("data-cell") / 3) + 1) + ", column " + (cell.getAttribute("data-cell") % 3 + 1));
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
                resultText.style.transform = "translateX(0%)";
                resultText.style.opacity = 1;
                resultText.textContent = "Wait, are you clicking the box instead of \"Random draw\"? \ud83e\udd28";
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
            restartBtn.style.pointerEvents = "auto";
            restartBtn.disabled = false;

            const winData = verifyWin();
            if (winData) {
                const { winner, combo } = winData;
                
                combo.forEach((index) => {
                    cells[index].style.backgroundColor = "#00B400";
                    cells[index].style.color = "#2F2D2E";
                    cells[index].setAttribute("aria-label", `Winning cells occupied by the player ${winner}.`);
                });
                winsInfos.textContent = `Player ${winner} won \ud83c\udfc6 \ud83c\udf89! A rematch?`;
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
                winsInfos.textContent = "Draw! \ud83d\ude35 Tough break, but you can restart a game!";
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
            turnInfos.textContent = `Now it's the turn of player ${currentPlayer} to play.`;
            turnInfos.style.transform = "translateX(0%)";
            turnInfos.style.opacity = 1;
        });
    });
    
    btnChoice.addEventListener("click", () => {
        gameActive = true;
        currentPlayer = Math.random() < 0.5 ? "X" : "O";
        resultText.style.transform = "translateX(0%)";
        resultText.textContent = `The draw decided that it is the player ${currentPlayer} who starts`;
        resultText.style.opacity = 1;
        btnChoice.disabled = true;
        btnChoice.style.pointerEvents = "none";
        restartBtn.style.pointerEvents = "auto";
        restartBtn.disabled = false;
    });
    
    restartBtn.addEventListener("click", resetGame);
});

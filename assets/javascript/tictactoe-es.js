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
            cell.setAttribute("aria-label", "Casilla vacía");
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
                alert("Antes de comenzar el juego, haz clic en el botón \"¡Echa suertes!\"");
                return;
            }
            if (board[index] !== "") {
                cell.setAttribute("aria-label", `Este espacio está ocupado por el jugador ${board[index]}`);
                return;
            }

            board[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.setAttribute("aria-label", `Este cuadrado acaba de ser ocupado por el jugador ${currentPlayer}`);
            cell.disabled = true;
            cell.style.pointerEvents = "none";
            restartBtn.disabled = false;
            restartBtn.style.pointerEvents = "auto";
            rechooseBtn.disabled = false;
            rechooseBtn.style.pointerEvents = "auto";

            const winData = verifyWin();
            if (winData) { 
                const { winner, combo } = winData;
                
                combo.forEach(index => {
                    cells[index].style.backgroundColor = "#00B400";
                    cells[index].setAttribute("aria-label", `Casillas ganadoras ocupadas por el jugador ${winner}`);
                    cells[index].style.pointerEvents = "none";
                });
                winsInfos.textContent = `¡El jugador ${winner} ganó! ¿Revancha?`;
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
                winsInfos.textContent =
                    "¡Es un empate, puedes empezar una nueva partida!";
                winsInfos.style.transform = "translateX(0%)";
                winsInfos.style.opacity = 1;
                gameActive = false;
                cells.forEach(cell => {
                    cell.disabled = true;
                    cell.style.pointerEvents = "none";
                    cell.setAttribute("aria-label", "Casilla deshabilitada tras un sorteo.");
                });
                return;
            }
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            resultText.textContent = "";
            turnInfos.textContent = `Turno del jugador ${currentPlayer}`;
            turnInfos.style.transform = "translateX(0%)";
            turnInfos.style.opacity = 1;
        });
    });
    btnChoice.addEventListener("click", () => {
        gameActive = true;
        currentPlayer = Math.random() < 0.5 ? "X" : "O";
        resultText.textContent = `El jugador ${currentPlayer} comienza la partida.`;
        resultText.style.transform = "translateX(0%)";
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
        resultText.textContent = `Se ha elegido a un nuevo jugador: ${currentPlayer}`;
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

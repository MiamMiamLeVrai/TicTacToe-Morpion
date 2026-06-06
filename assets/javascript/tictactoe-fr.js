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
        restartBtn.disabled = true;
        restartBtn.style.pointerEvents = "none";
        cells.forEach((cell) => {
            cell.style.backgroundColor = "";
            cell.textContent = "";
            cell.disabled = false;
            cell.style.pointerEvents = "auto";
            cell.setAttribute("aria-label", "Case vide, ligne " + (Math.floor(cell.getAttribute("data-cell") / 3) + 1) + ", colonne " + (cell.getAttribute("data-cell") % 3 + 1));
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
                resultText.textContent = "Attends, tu cliques sur la case au lieu de \"Tirage au sort\" ? \ud83e\udd28";
                return;
            }
            if (board[index] !== "") {
                cell.setAttribute("aria-label", `Cette case est prise par le joueur ${board[index]}`);
                return;
            }

            board[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.setAttribute("aria-label", `Cette case vient d'être prise par le joueur ${currentPlayer}`);
            cell.disabled = true;
            cell.style.pointerEvents = "none";
            restartBtn.disabled = false;
            restartBtn.style.pointerEvents = "auto";            

            const winData = verifyWin();
            if (winData) { 
                const { winner, combo } = winData;
                
                combo.forEach(index => {
                    cells[index].style.backgroundColor = "#00B400";
                    cells[index].style.color = "#2F2D2E";
                    cells[index].setAttribute("aria-label", `Cases gagnantes occupées par le joueur ${winner}`);
                });
                winsInfos.textContent = `Le joueur ${winner} a gagné \ud83c\udfc6 \ud83c\udf89 ! Une revanche ?`;
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
                winsInfos.textContent =
                    "Match nul ! \ud83d\ude35 Coup dur, mais vous pouvez relancer une partie !";
                winsInfos.style.transform = "translateX(0%)";
                winsInfos.style.opacity = 1;
                gameActive = false;
                cells.forEach(cell => {
                    cell.disabled = true;
                    cell.style.pointerEvents = "none";
                    cell.setAttribute("aria-label", "Cases désactivés après match nul");
                });
                return;
            }
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            turnInfos.textContent = `Au tour du joueur ${currentPlayer} de jouer.`;
            turnInfos.style.transform = "translateX(0%)";
            turnInfos.style.opacity = 1;
        });
    });
    btnChoice.addEventListener("click", () => {
        gameActive = true;
        currentPlayer = Math.random() < 0.5 ? "X" : "O";
        resultText.textContent = `Le tirage au sort a décidé que c'est le joueur ${currentPlayer} qui commence`;
        resultText.style.transform = "translateX(0%)";
        resultText.style.opacity = 1;
        btnChoice.disabled = true;
        btnChoice.style.pointerEvents = "none";
        restartBtn.disabled = false;
        restartBtn.style.pointerEvents = "auto";
    });
    restartBtn.addEventListener("click", resetGame);
});

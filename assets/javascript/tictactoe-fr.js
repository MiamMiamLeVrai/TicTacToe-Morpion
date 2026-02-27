document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("playerChoice");
    const result = document.getElementById("playerResult");
    const turnInfos = document.getElementById("turnInfos");
    const resetBtn = document.getElementById("restartButton");
    const rechooseBtn = document.getElementById("rechoosePlayer");
    const rechoosePlayerText = document.getElementById("rechoosePlayerText");
    const winsInfos = document.getElementById("winsInfos");
    const cells = document.querySelectorAll(".cell");

    let currentPlayer = null;
    let board = Array(9).fill("");
    let gameActive = false;

    resetBtn.style.cursor = "not-allowed";
    rechooseBtn.style.cursor = "not-allowed";

    function resetGame() {
        currentPlayer = null;
        board = Array(9).fill("");
        gameActive = false;
        result.textContent = "";
        result.style.transform = "translateX(200%)";
        result.style.opacity = 0;
        turnInfos.textContent = "";
        turnInfos.style.transform = "translateX(200%)";
        turnInfos.style.opacity = 0;
        winsInfos.textContent = "";
        winsInfos.style.transform = "translateX(200%)";
        winsInfos.style.opacity = 0;
        rechooseBtn.disabled = true;
        rechooseBtn.style.cursor = "not-allowed";
        rechoosePlayerText.textContent = "";
        rechoosePlayerText.style.transform = "translateX(200%)";
        rechoosePlayerText.style.opacity = 0;
        cells.forEach((cell) => {
            cell.style.backgroundColor = "";
        });
        btn.disabled = false;
        btn.style.cursor = "pointer";
        resetBtn.disabled = true;
        resetBtn.style.cursor = "not-allowed";
        cells.forEach((cell) => {
            cell.textContent = "";
            cell.disabled = false;
            cell.setAttribute("aria-label", "Case vide");
        });
    }

    function verifyWin() {
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // horizontales
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // verticales
            [0, 4, 8],
            [2, 4, 6], // diagonales
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

    btn.addEventListener("click", () => {
        result.style.transform = "translateX(0%)";
        result.style.opacity = 1;
        currentPlayer = Math.random() < 0.5 ? "X" : "O";
        result.textContent = `C'est au joueur ${currentPlayer} de commencer !`;
        turnInfos.textContent = "";
        btn.disabled = true;
        btn.style.cursor = "not-allowed";
        gameActive = true;
        resetBtn.disabled = false;
        resetBtn.style.cursor = "pointer";
        rechooseBtn.disabled = false;
        rechooseBtn.style.cursor = "pointer";
    });

    rechooseBtn.addEventListener("click", () => {
        resetGame();
        currentPlayer = Math.random() < 0.5 ? "X" : "O";
        rechoosePlayerText.textContent = `Nouveau joueur choisi : ${currentPlayer}`;
        rechoosePlayerText.style.transform = "translateX(0%)";
        rechoosePlayerText.style.opacity = 1;
        result.textContent = `C'est au joueur ${currentPlayer} de commencer !`;
        gameActive = true;
        btn.disabled = true;
        btn.style.cursor = "not-allowed";
        resetBtn.disabled = false;
        resetBtn.style.cursor = "pointer";
        rechooseBtn.disabled = false;
        rechooseBtn.style.cursor = "pointer";
    });

    cells.forEach((cell) => {
        cell.addEventListener("click", () => {
            const index = Number(cell.getAttribute("data-cell"));
            if (!gameActive) {
                alert("Veuillez choisir un joueur pour commencer la partie.");
                return;
            }
            if (board[index] !== "") {
                cell.setAttribute("aria-label", `Case déjà occupé par le joueur ${board[index]}`);
                cell.disabled = true;
                cell.style.cursor = "not-allowed";
                cell.style.pointerEvents = "none";
                // case déjà occupée
                return;
            }

            // placer le symbole du joueur actuel
            board[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.disabled = true;
            cell.setAttribute("aria-label", `Case maintenant occupé par le joueur ${currentPlayer}`);

            // activer boutons
            resetBtn.disabled = false;
            resetBtn.style.cursor = "pointer";
            rechooseBtn.disabled = false;
            rechooseBtn.style.cursor = "pointer";

            // vérifier victoire
            const winData = verifyWin();
            
            if (winData) { 
                const { winner, combo } = winData;
                
                combo.forEach(index => {
                    cells[index].style.backgroundColor = "#00FF00";
                });
                
                winsInfos.style.transform = "translateX(0%)";
                winsInfos.style.opacity = 1;
                winsInfos.textContent = `Le joueur ${winner} a gagné ! Une revanche ?`;
                turnInfos.textContent = "";
                
                gameActive = false;
                
                cells.forEach(cell => {
                    cell.disabled = true;
                    cell.style.cursor = "not-allowed";
                    cell.style.pointerEvents = "none";
                });
                
                return;
            }

            // vérifier match nul
            if (board.every((cellVal) => cellVal !== "")) {
                winsInfos.style.transform = "translateX(0%)";
                winsInfos.style.opacity = 1;
                winsInfos.textContent =
                    "Match nul, vous pouvez relancer une partie !";
                gameActive = false;
                result.textContent = "";
                turnInfos.textContent = "";
                cells.forEach(cell => {
                    cell.disabled = true;
                    cell.style.cursor = "not-allowed";
                });
                return;
            }

            // passer au joueur suivant
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            turnInfos.textContent = `C'est au joueur ${currentPlayer} de jouer.`;
            turnInfos.style.transform = "translateX(0%)";
            turnInfos.style.opacity = 1;
            result.textContent = "";
        });
    });

    resetBtn.addEventListener("click", resetGame);
});

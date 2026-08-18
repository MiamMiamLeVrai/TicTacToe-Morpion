import { getBestMove, verifyWinIA } from "./IA_Player.js";

document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll(".cell");
    const startBtn = document.getElementById("startBtn");
    const playerSymbolText = document.getElementById("playerSymbol");
    const winsInfos = document.getElementById("winsInfos");
    const restartBtn = document.getElementById("restartButton");

    let humanSymbol = null;
    let aiSymbol = null;
    let board = Array(9).fill("");
    let gameActive = false;

    restartBtn.style.pointerEvents = "none";

    function resetGame() {
        humanSymbol = null;
        aiSymbol = null;
        board = Array(9).fill("");
        gameActive = false;
        playerSymbolText.textContent = "";
        playerSymbolText.style.transform = "translateX(200%)";
        playerSymbolText.style.opacity = 0;
        winsInfos.textContent = "";
        winsInfos.style.transform = "translateX(200%)";
        winsInfos.style.opacity = 0;
        startBtn.disabled = false;
        startBtn.style.pointerEvents = "auto";
        restartBtn.disabled = true;
        restartBtn.style.pointerEvents = "none";
        cells.forEach((cell) => {
            cell.textContent = "";
            cell.disabled = false;
            cell.style.backgroundColor = "";
            cell.style.color = "";
            cell.style.pointerEvents = "auto";
            cell.setAttribute("aria-label", "Case vide, ligne " + (Math.floor(cell.getAttribute("data-cell") / 3) + 1) + ", colonne " + (cell.getAttribute("data-cell") % 3 + 1));
        });
    }

    function endGame(message) {
        gameActive = false;
        winsInfos.textContent = message;
        winsInfos.style.transform = "translateX(0%)";
        winsInfos.style.opacity = 1;
        cells.forEach((cell) => {
            cell.disabled = true;
            cell.style.pointerEvents = "none";
        });
    }

    function playAI() {
        const bestMove = getBestMove(board, aiSymbol, humanSymbol);
        if (bestMove === null) return;

        board[bestMove] = aiSymbol;
        cells[bestMove].textContent = aiSymbol;
        cells[bestMove].disabled = true;
        cells[bestMove].style.pointerEvents = "none";
        cells[bestMove].setAttribute("aria-label", `Case occupée par l'IA (${aiSymbol})`);

        const winner = verifyWinIA(board);
        if (winner) {
            winner.combo.forEach(i => {
                cells[i].style.backgroundColor = "#B40000";
                cells[i].style.color = "#FFEFD3";
                cells[i].setAttribute("aria-label", `Cases gagnantes occupées par le joueur ${winner.symbol}`);
            });
            endGame("Oh non, c'est l'IA qui a gagné \ud83d\ude26 ! Faudra retenter !");
            return;
        }
        if (board.every(cell => cell !== "")) {
            endGame("Match nul… au moins c'est pas l'IA qui a gagné \ud83d\ude10");
            return;
        }
    }

    startBtn.addEventListener("click", () => {
        humanSymbol = Math.random() < 0.5 ? "X" : "O";
        aiSymbol = humanSymbol === "X" ? "O" : "X";

        gameActive = true;
        startBtn.disabled = true;
        startBtn.style.pointerEvents = "none";
        restartBtn.disabled = false;
        restartBtn.style.pointerEvents = "auto";

        playerSymbolText.textContent = `Tu joues avec le symbole ${humanSymbol}, donc l'IA joue avec le symbole ${aiSymbol}`;
        playerSymbolText.style.transform = "translateX(0%)";
        playerSymbolText.style.opacity = 1;

        if (aiSymbol === "X") {
            setTimeout(playAI, 400);
        }
    });

    cells.forEach((cell) => {
        cell.addEventListener("click", () => {
            const index = Number(cell.getAttribute("data-cell"));

            if (!gameActive) {
                winsInfos.textContent = "Avant de commencer, clique sur \"Tirage au sort\" pour choisir le symbole";
                winsInfos.style.transform = "translateX(0%)";
                winsInfos.style.opacity = 1;
                return;
            }

            if (board[index] !== "") return;

            board[index] = humanSymbol;
            cell.textContent = humanSymbol;
            cell.disabled = true;
            cell.style.pointerEvents = "none";
            cell.setAttribute("aria-label", `Case occupée par toi ${humanSymbol}`);

            const winner = verifyWinIA(board);
            if (winner) {
                winner.combo.forEach(i => {
                    cells[i].style.backgroundColor = "#00B400";
                    cells[i].style.color = "#2F2D2E";
                    cells[i].setAttribute("aria-label", `Cases gagnantes occupées par le joueur ${winner.symbol}`);
                });
                endGame("Félicitations, tu as gagné \ud83c\udfc6 !");
                return;
            }
            if (board.every(cell => cell !== "")) {
                endGame("Match nul... au moins c'est pas l'IA qui a gagné \ud83d\ude10");
                return;
            }
            setTimeout(playAI, 400);
        });
    });
    restartBtn.addEventListener("click", resetGame);
});
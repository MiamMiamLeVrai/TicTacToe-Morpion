import { getBestMove, verifyWinIA } from "./5x5_Player.js";

document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const iaChoice = document.getElementById("iaChoice");
    const humanChoice = document.getElementById("humanChoice");
    const startBtn = document.getElementById("startBtn");
    const restartButton = document.getElementById("restartButton");
    const winsInfos = document.getElementById("winsInfos");
    const playerSymbolText = document.getElementById("playerSymbol");
    const titleGame = document.getElementById("infos-title");

    let humanSymbol = null;
    let aiSymbol = null;
    let currentPlayer = null;
    let modeChoice = null;
    let board = Array(25).fill("");
    let gameActive = false;

    restartButton.style.pointerEvents = "none";
    startBtn.style.pointerEvents = "none";

    const COMBOS = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20],
    ];

    function highlightCombo(combo, bgColor, textColor) {
        combo.forEach(i => {
            cells[i].style.backgroundColor = bgColor;
            cells[i].style.color = textColor;
        });
    }

    function endGame(message) {
        gameActive = false;
        winsInfos.textContent = message;
        winsInfos.style.transform = 'translateX(0%)';
        winsInfos.style.opacity = 1;
        cells.forEach(cell => {
            cell.disabled = true;
            cell.style.pointerEvents = 'none';
        });
    }

    function resetGame() {
        modeChoice = null;
        humanSymbol = null;
        aiSymbol = null;
        currentPlayer = null;
        board = Array(25).fill('');
        gameActive = false;

        playerSymbolText.textContent = '';
        playerSymbolText.style.transform = 'translateX(200%)';
        playerSymbolText.style.opacity = 0;
        winsInfos.textContent = '';
        winsInfos.style.transform = 'translateX(200%)';
        winsInfos.style.opacity = 0;

        startBtn.disabled = true;
        startBtn.style.pointerEvents = 'none';
        restartButton.disabled = true;
        restartButton.style.pointerEvents = 'none';

        iaChoice.disabled = false;
        iaChoice.style.pointerEvents = 'auto';
        humanChoice.disabled = false;
        humanChoice.style.pointerEvents = 'auto';

        titleGame.textContent = "Elección de jugador";

        cells.forEach(cell => {
            const idx = Number(cell.getAttribute('data-cell'));
            cell.textContent = '';
            cell.style.backgroundColor = '';
            cell.style.color = '';
            cell.disabled = false;
            cell.style.pointerEvents = 'auto';
            cell.setAttribute('aria-label', `Celda vacía, fila ${Math.floor(idx / 5) + 1}, columna ${(idx % 5) + 1}`);
        });
    }

    function playAI() {
        if (!gameActive) return;

        const bestMove = getBestMove(board, aiSymbol, humanSymbol);
        if (bestMove === null) return;

        board[bestMove] = aiSymbol;
        cells[bestMove].textContent = aiSymbol;
        cells[bestMove].disabled = true;
        cells[bestMove].style.pointerEvents = 'none';
        cells[bestMove].setAttribute('aria-label', `Caso ocupado por la IA (${aiSymbol}), fila ${Math.floor(bestMove / 5) + 1}, columna ${(bestMove % 5) + 1}`);

        const result = verifyWinIA(board);
        if (result) {
            highlightCombo(result.combo, '#B40000', '#FFEFD3');
            endGame("Oh no, es la IA que ganó \ud83d\ude26! Tendremos que intentarlo de nuevo!");
            return;
        }
        if (board.every(cell => cell !== '')) {
            endGame("Sorteo... al menos no es la IA la que ganó \ud83d\ude10")
        }
    }

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = Number(cell.getAttribute('data-cell'));

            if (!gameActive) {
                winsInfos.textContent = "Elija un modo y haga clic en \"Sorteo\" para comenzar!";
                winsInfos.style.transform = 'translateX(0%)';
                winsInfos.style.opacity = 1;
                return;
            }

            if (board[index] !== '') return;

            const activeSymbol = modeChoice === 'player' ? currentPlayer : humanSymbol;

            board[index] = activeSymbol;
            cell.textContent = activeSymbol;
            cell.disabled = true;
            cell.style.pointerEvents = 'none';
            cell.setAttribute('aria-label', `Caso ocupado por el jugador ${activeSymbol}, fila ${Math.floor(index / 5) + 1}, columna ${(index % 5) + 1}`);

            const result = verifyWinIA(board);
            if (result) {
                if (modeChoice === 'player') {
                    const playerNum = activeSymbol === humanSymbol ? '1' : '2';
                    highlightCombo(result.combo, '#00B400', '#2F2D2E');
                    endGame(`\ud83c\udfc6 El jugador ${playerNum} (${activeSymbol}) ganó!`)
                } else {
                    highlightCombo(result.combo, '#00B400', '#2F2D2E');
                    endGame("Felicitaciones, usted ganó \ud83c\udfc6!");
                }
                return;
            }

            if (board.every(c => c !== '')) {
                endGame("Sorteo... al menos no es la IA la que ganó \ud83d\ude10");
                return;
            }

            if (modeChoice === 'ia') {
                setTimeout(playAI, 400);
            } else {
                currentPlayer = currentPlayer === humanSymbol ? aiSymbol : humanSymbol;
                const playerNum = currentPlayer === humanSymbol ? '1' : '2';
                playerSymbolText.textContent = `Es el turno del jugador ${playerNum} (${currentPlayer})`;
            }
         });
    });

    iaChoice.addEventListener("click", () => {
        modeChoice = 'ia';
        titleGame.textContent = 'Modo: Jugador vs IA';
        iaChoice.disabled = true;
        iaChoice.style.pointerEvents = 'none';
        humanChoice.disabled = true;
        humanChoice.style.pointerEvents = 'none';
        startBtn.disabled = false;
        startBtn.style.pointerEvents = 'auto';
        restartButton.disabled = false;
        restartButton.style.pointerEvents = 'auto';
    });

    humanChoice.addEventListener("click", () => {
        modeChoice = 'player';
        titleGame.textContent = 'modo: Jugador vs Jugador';
        iaChoice.disabled = true;
        iaChoice.style.pointerEvents = 'none';
        humanChoice.disabled = true;
        humanChoice.style.pointerEvents = 'none';
        startBtn.disabled = false;
        startBtn.style.pointerEvents = 'auto';
        restartButton.disabled = false;
        restartButton.style.pointerEvents = 'auto';
    });

    startBtn.addEventListener("click", () => {
        humanSymbol = Math.random() < 0.5 ? 'X' : 'O';
        aiSymbol = humanSymbol === 'X' ? 'O' : 'X';
        currentPlayer = humanSymbol;
        gameActive = true;

        startBtn.disabled = true;
        startBtn.style.pointerEvents = 'none';
        restartButton.disabled = false;
        restartButton.style.pointerEvents = 'auto';

        if (modeChoice === 'ia') {
            playerSymbolText.textContent = `Juegas con el símbolo ${humanSymbol}, así que la IA juega con el símbolo ${aiSymbol}`;
        } else {
            playerSymbolText.textContent = `Jugador 1 juega con ${humanSymbol}, Jugador 2 juega con ${aiSymbol}. ¡Es el turno del Jugador 1!`;
        }
        playerSymbolText.style.transform = 'translateX(0%)';
        playerSymbolText.style.opacity = 1;

        if (modeChoice === 'ia' && aiSymbol === 'X') {
            setTimeout(playAI, 400);
        }
    });

    restartButton.addEventListener("click", resetGame);
});
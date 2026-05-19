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

        titleGame.textContent = 'Player Choice';

        cells.forEach(cell => {
            const idx = Number(cell.getAttribute('data-cell'));
            cell.textContent = '';
            cell.style.backgroundColor = '';
            cell.style.color = '';
            cell.disabled = false;
            cell.style.pointerEvents = 'auto';
            cell.setAttribute('aria-label', `Empty cell, row ${Math.floor(idx / 5) + 1}, column ${(idx % 5) + 1}`);
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
        cells[bestMove].setAttribute('aria-label', `Case occupied by the AI (${aiSymbol}), row ${Math.floor(bestMove / 5) + 1}, column ${(bestMove % 5) + 1}`);

        const result = verifyWinIA(board);
        if (result) {
            highlightCombo(result.combo, '#B40000', '#FFEFD3');
            endGame("Oh no, it's the AI that won \ud83d\ude26! We'll have to try again!");
            return;
        }
        if (board.every(cell => cell !== '')) {
            endGame("Draw... at least it's not the AI that won \ud83d\ude10")
        }
    }

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = Number(cell.getAttribute('data-cell'));

            if (!gameActive) {
                winsInfos.textContent = "Choose a mode and click on \"Draw\" to start!";
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
            cell.setAttribute('aria-label', `Case occupied by the player ${activeSymbol}, row ${Math.floor(index / 5) + 1}, column ${(index % 5) + 1}`);

            const result = verifyWinIA(board);
            if (result) {
                if (modeChoice === 'player') {
                    const playerNum = activeSymbol === humanSymbol ? '1' : '2';
                    highlightCombo(result.combo, '#00B400', '#2F2D2E');
                    endGame(`\ud83c\udfc6 The player ${playerNum} (${activeSymbol}) won!`)
                } else {
                    highlightCombo(result.combo, '#00B400', '#2F2D2E');
                    endGame("Congratulations, you won \ud83c\udfc6!");
                }
                return;
            }

            if (board.every(c => c !== '')) {
                endGame("Draw... at least it's not the AI that won \ud83d\ude10");
                return;
            }

            if (modeChoice === 'ia') {
                setTimeout(playAI, 400);
            } else {
                currentPlayer = currentPlayer === humanSymbol ? aiSymbol : humanSymbol;
                const playerNum = currentPlayer === humanSymbol ? '1' : '2';
                playerSymbolText.textContent = `It’s the player’s turn ${playerNum} (${currentPlayer})`;
            }
         });
    });

    iaChoice.addEventListener("click", () => {
        modeChoice = 'ia';
        titleGame.textContent = 'Mode: VS AI Player';
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
        titleGame.textContent = 'Mode: Player VS Player';
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
            playerSymbolText.textContent = `You play with the ${humanSymbol} symbol, so AI play with the ${aiSymbol} symbol`;
        } else {
            playerSymbolText.textContent = `Player 1 play with ${humanSymbol}, Player 2 play with ${aiSymbol}. It's the turn to Player 1!`;
        }
        playerSymbolText.style.transform = 'translateX(0%)';
        playerSymbolText.style.opacity = 1;

        if (modeChoice === 'ia' && aiSymbol === 'X') {
            setTimeout(playAI, 400);
        }
    });

    restartButton.addEventListener("click", resetGame);
});
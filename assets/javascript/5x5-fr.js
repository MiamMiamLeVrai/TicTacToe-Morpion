import { getBestMove, verifyWinIA } from './5x5_Player.js';

document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const iaChoice = document.getElementById('iaChoice');
    const humanChoice = document.getElementById('humanChoice');
    const startBtn = document.getElementById('startBtn');
    const restartButton = document.getElementById('restartButton');
    const winsInfos = document.getElementById('winsInfos');
    const playerSymbolText = document.getElementById('playerSymbol');
    const titleGame = document.getElementById('infos-title');

    // ✅ Toutes les variables d'état déclarées proprement
    let humanSymbol = null;   // Symbole du joueur 1 (ou humain en mode IA)
    let aiSymbol = null;      // Symbole de l'IA ou du joueur 2
    let currentPlayer = null; // Tour actif en mode Joueur VS Joueur
    let modeChoice = null;    // 'ia' ou 'player'
    let board = Array(25).fill('');
    let gameActive = false;

    // ✅ La liste des combos gagnants définie UNE SEULE FOIS, accessible partout
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

    // Colorie les cases du combo gagnant
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

        titleGame.textContent = 'Choix du joueur';

        cells.forEach(cell => {
            const idx = Number(cell.getAttribute('data-cell'));
            cell.textContent = '';
            cell.disabled = false;
            cell.style.backgroundColor = '';
            cell.style.color = '';
            cell.style.pointerEvents = 'auto';
            // ✅ Ligne et colonne recalculées correctement (1-indexé)
            cell.setAttribute('aria-label', `Case vide, ligne ${Math.floor(idx / 5) + 1}, colonne ${(idx % 5) + 1}`);
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
        cells[bestMove].setAttribute(
            'aria-label',
            `Case occupée par l'IA (${aiSymbol}), ligne ${Math.floor(bestMove / 5) + 1}, colonne ${(bestMove % 5) + 1}`
        );

        // ✅ verifyWinIA retourne { symbol, combo } ou null — plus de bug de variable undefined
        const result = verifyWinIA(board);
        if (result) {
            highlightCombo(result.combo, '#B40000', '#FFEFD3');
            endGame("Oh non, c'est l'IA qui a gagné 😦 ! Faudra retenter !");
            return;
        }
        if (board.every(cell => cell !== '')) {
            endGame("Match nul… au moins c'est pas l'IA qui a gagné 😐");
        }
        // Si rien, c'est au joueur de jouer — le click listener s'en occupe
    }

    // ✅ Un seul listener sur les cellules, qui gère les deux modes
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = Number(cell.getAttribute('data-cell'));

            if (!gameActive) {
                winsInfos.textContent = 'Choisis un mode et clique sur "Tire au sort" pour commencer !';
                winsInfos.style.transform = 'translateX(0%)';
                winsInfos.style.opacity = 1;
                return;
            }

            if (board[index] !== '') return;

            // ✅ Le symbole actif dépend du mode
            const activeSymbol = modeChoice === 'player' ? currentPlayer : humanSymbol;

            board[index] = activeSymbol;
            cell.textContent = activeSymbol;
            cell.disabled = true;
            cell.style.pointerEvents = 'none';
            cell.setAttribute(
                'aria-label',
                `Case occupée par ${activeSymbol}, ligne ${Math.floor(index / 5) + 1}, colonne ${(index % 5) + 1}`
            );

            const result = verifyWinIA(board);
            if (result) {
                if (modeChoice === 'player') {
                    // ✅ Mode 2 joueurs : on sait quel joueur a gagné grâce à activeSymbol
                    const playerNum = activeSymbol === humanSymbol ? '1' : '2';
                    highlightCombo(result.combo, '#00B400', '#2F2D2E');
                    endGame(`🏆 Le joueur ${playerNum} (${activeSymbol}) a gagné !`);
                } else {
                    highlightCombo(result.combo, '#00B400', '#2F2D2E');
                    endGame('Félicitations, tu as gagné 🏆 !');
                }
                return;
            }

            if (board.every(c => c !== '')) {
                endGame("Match nul… au moins c'est pas l'IA qui a gagné 😐");
                return;
            }

            if (modeChoice === 'ia') {
                // Mode IA : l'IA joue après le joueur
                setTimeout(playAI, 400);
            } else {
                // ✅ Mode 2 joueurs : on alterne les tours
                currentPlayer = currentPlayer === humanSymbol ? aiSymbol : humanSymbol;
                const playerNum = currentPlayer === humanSymbol ? '1' : '2';
                playerSymbolText.textContent = `C'est au tour du joueur ${playerNum} (${currentPlayer})`;
            }
        });
    });

    iaChoice.addEventListener('click', () => {
        modeChoice = 'ia';
        titleGame.textContent = 'Mode : Joueur VS IA';
        iaChoice.disabled = true;
        iaChoice.style.pointerEvents = 'none';
        humanChoice.disabled = true;
        humanChoice.style.pointerEvents = 'none';
        startBtn.disabled = false;
        startBtn.style.pointerEvents = 'auto';
        restartButton.disabled = false;
        restartButton.style.pointerEvents = 'auto';
    });

    humanChoice.addEventListener('click', () => {
        modeChoice = 'player';
        titleGame.textContent = 'Mode : Joueur VS Joueur';
        iaChoice.disabled = true;
        iaChoice.style.pointerEvents = 'none';
        humanChoice.disabled = true;
        humanChoice.style.pointerEvents = 'none';
        startBtn.disabled = false;
        startBtn.style.pointerEvents = 'auto';
        restartButton.disabled = false;
        restartButton.style.pointerEvents = 'auto';
    });

    startBtn.addEventListener('click', () => {
        // Tirage au sort du symbole pour le joueur 1
        humanSymbol = Math.random() < 0.5 ? 'X' : 'O';
        aiSymbol = humanSymbol === 'X' ? 'O' : 'X';
        currentPlayer = humanSymbol; // Le joueur 1 commence toujours
        gameActive = true;

        startBtn.disabled = true;
        startBtn.style.pointerEvents = 'none';
        restartButton.disabled = false;
        restartButton.style.pointerEvents = 'auto';

        if (modeChoice === 'ia') {
            playerSymbolText.textContent = `Tu joues avec le symbole ${humanSymbol}, donc l'IA joue avec le symbole ${aiSymbol}`;
        } else {
            playerSymbolText.textContent = `Joueur 1 joue avec ${humanSymbol}, Joueur 2 joue avec ${aiSymbol}. C'est au tour du Joueur 1 !`;
        }
        playerSymbolText.style.transform = 'translateX(0%)';
        playerSymbolText.style.opacity = 1;

        // Si l'IA a tiré X, elle commence
        if (modeChoice === 'ia' && aiSymbol === 'X') {
            setTimeout(playAI, 400);
        }
    });

    restartButton.addEventListener('click', resetGame);
});
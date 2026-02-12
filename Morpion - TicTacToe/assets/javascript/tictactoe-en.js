document.addEventListener('DOMContentLoaded', function () {
    let lastScroll = 0;
    let ticking = false;
    const NAVBAR = document.getElementById('navbarMove');

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                const CURRENT_SCROLL = window.scrollY;
                if (CURRENT_SCROLL > lastScroll) {
                    NAVBAR.classList.add('nav-hidden');
                } else {
                    NAVBAR.classList.remove('nav-hidden');
                }
                lastScroll = CURRENT_SCROLL;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    const btn = document.getElementById('playerChoice');
    const result = document.getElementById('playerResult');
    const turnInfos = document.getElementById('turnInfos');
    const resetBtn = document.getElementById('restartButton');
    const rechooseBtn = document.getElementById('rechoosePlayer');
    const rechoosePlayerText = document.getElementById('rechoosePlayerText');
    const winInfos = document.getElementById('winsInfos');
    const cells = document.querySelectorAll('.cell');

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
        turnInfos.textContent = "";
        winInfos.textContent = "";
        rechooseBtn.disabled = true;
        rechooseBtn.style.cursor = "not-allowed";
        rechoosePlayerText.textContent = "";
        btn.disabled = false;
        btn.style.cursor = "pointer";
        resetBtn.disabled = true;
        resetBtn.style.cursor = "not-allowed";
        cells.forEach(cell => {
            cell.textContent = "";
        });
    }

    rechooseBtn.addEventListener('click', () => {
        resetGame();
        currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
        rechoosePlayerText.textContent = `New player chosen: ${currentPlayer}`;
        result.textContent = `It's the turn of player ${currentPlayer} to start!`;
        gameActive = true;
        btn.disabled = true;
        btn.style.cursor = "not-allowed";
        resetBtn.disabled = false;
        resetBtn.style.cursor = "pointer";
        rechooseBtn.disabled = false;
        rechooseBtn.style.cursor = "pointer";
    })

    btn.addEventListener('click', () => {
        currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
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

    function verifyWin() {
        const winningCombos = [
            [0,1,2], [3,4,5], [6,7,8], // horizontales
            [0,3,6], [1,4,7], [2,5,8], // verticales
            [0,4,8], [2,4,6]           // diagonales
        ];

        for (const combo of winningCombos) {
            const [a,b,c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = Number(cell.getAttribute('data-cell'));
            if (!gameActive) {
                alert("Please choose a player to start the game.");
                return;
            }
            if (board[index] !== "") {
                // case déjà occupée
                return;
            }

            // placer le symbole du joueur actuel
            board[index] = currentPlayer;
            cell.textContent = currentPlayer;

            // activer boutons
            resetBtn.disabled = false;
            resetBtn.style.cursor = "pointer";
            rechooseBtn.disabled = false;
            rechooseBtn.style.cursor = "pointer";

            // vérifier victoire
            const winner = verifyWin();
            if (winner) {
                winInfos.textContent = `The player ${winner} has won!`;
                gameActive = false;
                turnInfos.textContent = "";
                result.textContent = "";
                return;
            }

            // vérifier match nul
            if (board.every(cellVal => cellVal !== "")) {
                winInfos.textContent = "Draw, you can restart a new game!";
                gameActive = false;
                result.textContent = "";
                turnInfos.textContent = "";
                return;
            }

            // passer au joueur suivant
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            turnInfos.textContent = `It's the turn of player ${currentPlayer} to play.`;
            result.textContent = "";
        });
    });

    resetBtn.addEventListener("click", resetGame)
});
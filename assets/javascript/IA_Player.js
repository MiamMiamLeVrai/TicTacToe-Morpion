function verifyWinIA(board) {
    const combos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of combos) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { symbol: board[a], combo: [a, b, c] };
        }
    }
    return null;
}

function miniMax(board, depth, isMaximizing, aiSymbol, humanSymbol) {
    const winner = verifyWinIA(board);
    if (winner?.symbol === aiSymbol) return 10 - depth;
    if (winner?.symbol === humanSymbol) return depth - 10;
    if (board.every(cell => cell !== "")) return 0; // match nul

    if (isMaximizing) {
        let best = -100;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = aiSymbol;
                best = Math.max(best, miniMax(board, depth + 1, false, aiSymbol, humanSymbol));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = 100;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = humanSymbol;
                best = Math.min(best, miniMax(board, depth + 1, true, aiSymbol, humanSymbol));
                board[i] = "";
            }
        }
        return best;
    }
}

function getBestMove(board, aiSymbol, humanSymbol) {
    let bestScore = -100;
    let bestMoves = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = aiSymbol;
            const score = miniMax(board, 0, false, aiSymbol, humanSymbol);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMoves = [i];
            } else if (score === bestScore) {
                bestMoves.push(i);
            }
        }
    }
    return bestMoves.length ? bestMoves[Math.floor(Math.random() * bestMoves.length)] : null;
}

function getRandomMove(board) {
    const free = board.map((cell, i) => (cell === "" ? i : -1)).filter(i => i !== -1);
    return free.length ? free[Math.floor(Math.random() * free.length)] : null;
}

function getMoveByDifficulty(board, aiSymbol, humanSymbol, difficulty = "hard") {
    const mistakeChance = { easy: 0.7, medium: 0.3, hard: 0 }[difficulty] ?? 0;
    if (Math.random() < mistakeChance) return getRandomMove(board);
    return getBestMove(board, aiSymbol, humanSymbol);
}

export { getBestMove, getMoveByDifficulty, verifyWinIA };
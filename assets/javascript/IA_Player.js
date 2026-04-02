function verifyWinIA(board) {
    const combos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of combos) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function miniMax(board, depth, isMaximizing, aiSymbol, humanSymbol) {
    const winner = verifyWinIA(board);
    if (winner === aiSymbol) return 10 - depth;
    if (winner === humanSymbol) return depth - 10;
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
    let bestMove = null;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = aiSymbol;
            const score = miniMax(board, 0, false, aiSymbol, humanSymbol);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

export { getBestMove, miniMax, verifyWinIA };
function verifyWinIA(board) { 
    const combos = [
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
    for (const combo of combos) {
        const first = board[combo[0]];
        if (first && combo.every(i => board[i] === first)) {
            return { symbol: first, combo };
        }
    }
    return null;
}

function miniMax(board, depth, isMaximizing, aiSymbol, humanSymbol, alpha, beta) {
    const result = verifyWinIA(board);
    if (result) { 
        if (result.symbol === aiSymbol) return 10 - depth;
        if (result.symbol === humanSymbol) return depth - 10;
    }
    if (board.every(cell => cell !== '')) return 0;
    if (depth >= 3) return 0;
    
    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 25; i++) {
            if (board[i] === '') {
                board[i] = aiSymbol;
                best = Math.max(best, miniMax(board, depth + 1, false, aiSymbol, humanSymbol, alpha, beta));
                board[i] = '';
                alpha = Math.max(alpha, best);
                if (beta <= alpha) break;
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 25; i++) {
            if (board[i] === '') {
                board[i] = humanSymbol;
                best = Math.min(best, miniMax(board, depth + 1, true, aiSymbol, humanSymbol, alpha, beta));
                board[i] = '';
                beta = Math.min(beta, best);
                if (beta <= alpha) break;
            }
        }
        return best;
    }
}

function getBestMove(board, aiSymbol, humanSymbol) {
    let bestScore = -Infinity;
    let bestMove = null;
    for (let i = 0; i < 25; i++) {
        if (board[i] === '') {
            board[i] = aiSymbol;
            const score = miniMax(board, 0, false, aiSymbol, humanSymbol, -Infinity, Infinity);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

export { getBestMove, verifyWinIA };
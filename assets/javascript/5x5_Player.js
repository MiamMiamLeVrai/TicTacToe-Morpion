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

const WIN = 100000;
const LINE_SCORES = [0, 1, 10, 100, 1000, WIN];

const MOVE_ORDER = [...Array(25).keys()].sort((a, b) => { 
    const d = i => [
        Math.max(Math.abs(Math.floor(i / 5) - 2), Math.abs((i % 5) - 2)),
        Math.abs(Math.floor(i / 5) - 2) + Math.abs((i % 5) - 2)
    ];
    const [a1, a2] = d(a), [b1, b2] = d(b);
    return a1 - b1 || a2 - b2;
});

function verifyWinIA(board) {
    for (const combo of COMBOS) { 
        const first = board[combo[0]];
        if (first && combo.every(i => board[i] === first)) {
            return { symbol: first, combo };
        }
    }
    return null;
}

// Pour chaque ligne qui n'appartient encore qu'à un seul camp : + pour l'IA, - pour l'humain
function evaluate(board, aiSymbol, humanSymbol) {
    let score = 0;
    for (const combo of COMBOS) { 
        let ai = 0, human = 0;
        for (const i of combo) {
            if (board[i] === aiSymbol) ai++;
            else if (board[i] === humanSymbol) human++;
        }
        if (ai > 0 && human === 0) score += LINE_SCORES[ai];
        else if (human > 0 && ai === 0) score -= LINE_SCORES[human];
    }
    return score;
}

function miniMax(board, depth, isMaximizing, aiSymbol, humanSymbol, alpha, beta) {
    const result = verifyWinIA(board);
    if (result) { 
        if (result.symbol === aiSymbol) return WIN - depth;
        if (result.symbol === humanSymbol) return depth - WIN;
    }
    if (board.every(cell => cell !== '')) return 0;
    if (depth >= 3) return evaluate(board, aiSymbol, humanSymbol);
    
    if (isMaximizing) {
        let best = -Infinity;
        for (const i of MOVE_ORDER) {
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
        for (const i of MOVE_ORDER) {
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
    let bestMoves = [];
    for (const i of MOVE_ORDER) {
        if (board[i] !== '') continue;
        board[i] = aiSymbol;
        const score = miniMax(board, 0, false, aiSymbol, humanSymbol, -Infinity, Infinity);
        board[i] = '';
        if (score > bestScore) {
            bestScore = score;
            bestMoves = [i];
        } else if (score === bestScore) {
            bestMoves.push(i);
        }
    }
    return bestMoves.length ? bestMoves[Math.floor(Math.random() * bestMoves.length)] : null;
}

export { getBestMove, verifyWinIA };
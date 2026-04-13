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
            cell.setAttribute("aria-label", "Case vide");
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
            const combos =
                [[0,1,2],[3,4,5],[6,7,8],
                [0,3,6],[1,4,7],[2,5,8],
                [0,4,8],[2,4,6]];
            for (const [a, b, c] of combos) {
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    [a, b, c].forEach(i => {
                        cells[i].style.backgroundColor = "#B40000";
                        cells[i].style.color = "#FFEFD3";
                    });
                    break;
                }
            }
            endGame("Oh non, c'est l'IA qui a gagné 😦 ! Faudra retenter !");
            return;
        }
        if (board.every(cell => cell !== "")) {
            endGame("Match nul… au moins c'est pas l'IA qui a gagné 😐");
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
                alert("Avant de commencer, clique sur \"Tire au sort\" pour choisir le symbole");
                return;
            }
            
            if (board[index] !== "") return;
            
            board[index] = humanSymbol;
            cell.textContent = humanSymbol;
            cell.disabled = true;
            cell.style.pointerEvents = "none";
            cell.setAttribute("aria-label", `Case occupé par toi ${humanSymbol}`);
            
            const winner = verifyWinIA(board);
            if (winner) {
                const combos =
                    [[0,1,2],[3,4,5],[6,7,8],
                    [0,3,6],[1,4,7],[2,5,8],
                    [0,4,8],[2,4,6]];
                for (const [a, b, c] of combos) { 
                    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                        [a, b, c].forEach(i => {
                            cells[i].style.backgroundColor = "#00B400";
                            cells[i].style.color = "#2F2D2E";
                        });
                        break;
                    }
                }
                endGame("Félicitations, tu as gagné 🏆 !");
                return;
            }
            
            if (board.every(cell => cell !== "")) {
                endGame("Match nul… au moins c'est pas l'IA qui a gagné 😐");
                return;
            }
            
            setTimeout(playAI, 400);
        });
    });
    restartBtn.addEventListener("click", resetGame);
});

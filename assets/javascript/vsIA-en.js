import { getBestMove, getMoveByDifficulty, verifyWinIA } from "./IA_Player.js?v=3.4.0";

document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll(".cell");
    const startBtn = document.getElementById("startBtn");
    const playerSymbolText = document.getElementById("playerSymbol");
    const winsInfos = document.getElementById("winsInfos");
    const restartBtn = document.getElementById("restartButton");
    const difficultySelect = document.getElementById("difficulty");
    
    let humanSymbol = null;
    let aiSymbol = null;
    let board = Array(9).fill("");
    let gameActive = false;
    let aiTimer = null;
    let aiThinking = false;

    restartBtn.style.pointerEvents = "none";

    function scheduleAI() {
        aiThinking = true;
        aiTimer = setTimeout(playAI, 400);
    }
    
    function resetGame() {
        clearTimeout(aiTimer);
        aiTimer = null;
        aiThinking = false;
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
        difficultySelect.disabled = false;
        difficultySelect.style.pointerEvents = "auto";
        cells.forEach((cell) => {
            cell.textContent = "";
            cell.disabled = false;
            cell.style.backgroundColor = "";
            cell.style.color = "";
            cell.style.pointerEvents = "auto";
            cell.setAttribute("aria-label", "Empty cell, row " + (Math.floor(cell.getAttribute("data-cell") / 3) + 1) + ", column " + (cell.getAttribute("data-cell") % 3 + 1));
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
        aiThinking = false;
        if (!gameActive) return;
        const difficulty = document.querySelector('input[name="difficulty"]:checked');
        const bestMove = getMoveByDifficulty(board, aiSymbol, humanSymbol, difficulty);
        if (bestMove === null) return;
        
        board[bestMove] = aiSymbol;
        cells[bestMove].textContent = aiSymbol;
        cells[bestMove].disabled = true;
        cells[bestMove].style.pointerEvents = "none";
        cells[bestMove].setAttribute("aria-label", `Space occupied by AI (${aiSymbol})`);
        
        const winner = verifyWinIA(board);
        if (winner) { 
            winner.combo.forEach(i => {
                cells[i].style.backgroundColor = "#B40000";
                cells[i].style.color = "#FFEFD3";
                cells[i].setAttribute("aria-label", `Winning cells occupied by the player ${winner.symbol}.`);
            });
            endGame("Oh no, the AI won \ud83d\ude26! We'll have to try again!");
            return;
        }
        if (board.every(cell => cell !== "")) {
            endGame("It's a draw… at least the AI didn't win \ud83d\ude10");
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
        difficultySelect.disabled = true;
        difficultySelect.style.pointerEvents = "none";
        
        playerSymbolText.textContent = `You play with the symbol ${humanSymbol}, so the AI plays with the symbol ${aiSymbol}`;
        playerSymbolText.style.transform = "translateX(0%)";
        playerSymbolText.style.opacity = 1;
        
        if (aiSymbol === "X") {
            scheduleAI();
        }
    });

    cells.forEach((cell) => {
        cell.addEventListener("click", () => {
            const index = Number(cell.getAttribute("data-cell"));
            
            if (!gameActive) { 
                winsInfos.textContent = "Before you begin, click on \"Draw a symbol\" to choose the symbol";
                winsInfos.style.transform = "translateX(0%)";
                winsInfos.style.opacity = 1;
                return;
            }
            if (aiThinking) return;            
            if (board[index] !== "") return;
            
            board[index] = humanSymbol;
            cell.textContent = humanSymbol;
            cell.disabled = true;
            cell.style.pointerEvents = "none";
            cell.setAttribute("aria-label", `You placed ${humanSymbol} in this cell, row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}`);
            
            const winner = verifyWinIA(board);
            if (winner) {
                winner.combo.forEach(i => {
                    cells[i].style.backgroundColor = "#00B400";
                    cells[i].style.color = "#2F2D2E";
                    cells[i].setAttribute("aria-label", `Winning cells occupied by the player ${winner.symbol}.`);
                });
                endGame("Congratulations, you won \ud83c\udfc6!");
                return;
            }
            if (board.every(cell => cell !== "")) {
                endGame("It's a draw… at least the AI didn't win \ud83d\ude10");
                return;
            }
            scheduleAI();
        });
    }); 
    restartBtn.addEventListener("click", resetGame);
});

// js/gameLogic.js

export class TicTacToeGameLogic {
    constructor(difficulty = null) {
        this.board = Array(3).fill(null).map(() => Array(3).fill(''));
        this.currentPlayer = "X";
        this.gameOver = false;
        this.winner = null;
        this.isDraw = false;
        this.difficulty = difficulty ? difficulty.toLowerCase() : "easy"; // Default to easy if null
    }

    resetGame(difficulty = null) {
        this.board = Array(3).fill(null).map(() => Array(3).fill(''));
        this.currentPlayer = "X";
        this.gameOver = false;
        this.winner = null;
        this.isDraw = false;
        if (difficulty) {
            this.difficulty = difficulty.toLowerCase();
        }
    }

    makeMove(r, c) {
        if (this.gameOver || r < 0 || r > 2 || c < 0 || c > 2 || this.board[r][c] !== '') {
            return false; // Invalid move
        }

        this.board[r][c] = this.currentPlayer;
        this._checkGameStatus();

        if (!this.gameOver) {
            this.currentPlayer = (this.currentPlayer === "X") ? "O" : "X";
        }
        return true;
    }

    _checkGameStatus() {
        const lines = [];
        // Rows
        for (let r = 0; r < 3; r++) {
            lines.push([this.board[r][0], this.board[r][1], this.board[r][2]]);
        }
        // Columns
        for (let c = 0; c < 3; c++) {
            lines.push([this.board[0][c], this.board[1][c], this.board[2][c]]);
        }
        // Diagonals
        lines.push([this.board[0][0], this.board[1][1], this.board[2][2]]);
        lines.push([this.board[0][2], this.board[1][1], this.board[2][0]]);

        for (const line of lines) {
            if (line[0] !== '' && line[0] === line[1] && line[1] === line[2]) {
                this.winner = line[0];
                this.gameOver = true;
                return;
            }
        }

        // Check for draw
        if (this.board.flat().every(cell => cell !== '')) {
            this.isDraw = true;
            this.gameOver = true;
            return;
        }
    }

    getBoard() {
        return this.board.map(row => [...row]); // Return a deep copy
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    getGameStatus() {
        return {
            gameOver: this.gameOver,
            winner: this.winner,
            isDraw: this.isDraw
        };
    }

    getEmptyCells() {
        const emptyCells = [];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (this.board[r][c] === '') {
                    emptyCells.push({ r, c });
                }
            }
        }
        return emptyCells;
    }

    makeAIMove() {
        if (this.gameOver) {
            return null;
        }

        const emptyCells = this.getEmptyCells();
        if (emptyCells.length === 0) {
            return null;
        }

        let move = null;
        if (this.difficulty === "easy") {
            move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        } else if (this.difficulty === "hard") {
            move = this._getHardAIMove();
        } else { // Fallback to easy
            move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }

        if (move) {
            this.makeMove(move.r, move.c);
            return move;
        }
        return null;
    }

    _getHardAIMove() {
        const aiPlayer = this.currentPlayer; // 'O'
        const humanPlayer = (aiPlayer === "O") ? "X" : "O";
        const emptyCells = this.getEmptyCells();

        // 1. Check for immediate winning move for AI
        for (const cell of emptyCells) {
            this.board[cell.r][cell.c] = aiPlayer;
            this._checkGameStatus();
            if (this.winner === aiPlayer) {
                this.board[cell.r][cell.c] = '';
                this.gameOver = false; this.winner = null; this.isDraw = false;
                return cell;
            }
            this.board[cell.r][cell.c] = '';
            this.gameOver = false; this.winner = null; this.isDraw = false;
        }

        // 2. Check for immediate blocking move for human opponent
        for (const cell of emptyCells) {
            this.board[cell.r][cell.c] = humanPlayer;
            this._checkGameStatus();
            if (this.winner === humanPlayer) {
                this.board[cell.r][cell.c] = '';
                this.gameOver = false; this.winner = null; this.isDraw = false;
                return cell;
            }
            this.board[cell.r][cell.c] = '';
            this.gameOver = false; this.winner = null; this.isDraw = false;
        }

        // 3. Take center if available
        if (this.board[1][1] === '') {
            return { r: 1, c: 1 };
        }

        // 4. Take a random corner if available
        const corners = [{ r: 0, c: 0 }, { r: 0, c: 2 }, { r: 2, c: 0 }, { r: 2, c: 2 }];
        const availableCorners = corners.filter(cell => this.board[cell.r][cell.c] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // 5. Take a random side if available
        const sides = [{ r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 2 }, { r: 2, c: 1 }];
        const availableSides = sides.filter(cell => this.board[cell.r][cell.c] === '');
        if (availableSides.length > 0) {
            return availableSides[Math.floor(Math.random() * availableSides.length)];
        }

        // Fallback: just pick any empty cell
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
}

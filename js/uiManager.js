// js/uiManager.js

import { TicTacToeGameLogic } from './gameLogic.js';

// FIX: Add 'export' keyword here
export class UIManager {
    constructor() {
        console.log("UIManager: Constructor called."); // DEBUG
        this.gameLogic = null;
        this.gameMode = null;
        this.playerNames = {};
        this.aiDifficulty = null;

        // Get DOM elements
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.statusLabel = document.getElementById('status-label');
        this.gameBoardDiv = document.getElementById('game-board');
        this.player1NameInput = document.getElementById('player1Name');
        this.player2NameInput = document.getElementById('player2Name');
        this.player2NameSection = document.getElementById('player2-name-section');
        this.difficultySection = document.getElementById('difficulty-section');

        // Get buttons for event listeners
        this.startGameBtn = document.getElementById('startGameBtn');
        this.resetGameBtn = document.getElementById('resetGameBtn');
        this.backToMenuBtn = document.getElementById('backToMenuBtn');
        this.gameModeRadios = document.querySelectorAll('input[name="gameMode"]');

        // Initial setup and attach event listeners
        this.attachEventListeners();
        this.updateFieldsVisibility(); // Call once on load to set initial state
    }

    attachEventListeners() {
        console.log("UIManager: Attaching event listeners."); // DEBUG
        // Start Game button
        if (this.startGameBtn) {
            this.startGameBtn.addEventListener('click', () => this.startGame());
            console.log("UIManager: Start Game button listener attached."); // DEBUG
        } else {
            console.error("UIManager: startGameBtn not found!"); // ERROR DEBUG
        }

        // Reset Game button
        if (this.resetGameBtn) {
            this.resetGameBtn.addEventListener('click', () => this.resetGameGUI());
            console.log("UIManager: Reset Game button listener attached."); // DEBUG
        } else {
            console.error("UIManager: resetGameBtn not found!"); // ERROR DEBUG
        }

        // Back to Main Menu button
        if (this.backToMenuBtn) {
            this.backToMenuBtn.addEventListener('click', () => this.showStartScreen());
            console.log("UIManager: Back to Menu button listener attached."); // DEBUG
        } else {
            console.error("UIManager: backToMenuBtn not found!"); // ERROR DEBUG
        }

        // Game mode radio buttons
        this.gameModeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateFieldsVisibility());
            console.log(`UIManager: Game mode radio listener attached for ${radio.value}.`); // DEBUG
        });
    }


    // Controls visibility of start screen fields based on game mode
    updateFieldsVisibility() {
        console.log("UIManager: updateFieldsVisibility called."); // DEBUG
        this.gameMode = document.querySelector('input[name="gameMode"]:checked').value;

        if (this.gameMode === "singleplayer") {
            this.player2NameSection.classList.add('hidden');
            this.player2NameInput.value = "AI";
            this.player2NameInput.disabled = true;
            this.difficultySection.classList.remove('hidden');
        } else {
            this.player2NameSection.classList.remove('hidden');
            this.player2NameInput.value = "Player O";
            this.player2NameInput.disabled = false;
            this.difficultySection.classList.add('hidden');
        }
    }

    // Shows the start screen and resets inputs
    showStartScreen() {
        console.log("UIManager: showStartScreen called."); // DEBUG
        this.startScreen.classList.remove('hidden');
        this.gameScreen.classList.add('hidden');
        document.querySelector('input[name="gameMode"][value="multiplayer"]').checked = true;
        this.updateFieldsVisibility();
        this.player1NameInput.value = "Player X";
        this.player2NameInput.value = "Player O";
        document.querySelector('input[name="aiDifficulty"][value="easy"]').checked = true;
    }

    // Starts the game based on user selections
    startGame() {
        console.log("UIManager: startGame called."); // DEBUG
        this.gameMode = document.querySelector('input[name="gameMode"]:checked').value;
        this.playerNames.X = this.player1NameInput.value.trim();
        this.playerNames.O = this.player2NameInput.value.trim();
        this.aiDifficulty = document.querySelector('input[name="aiDifficulty"]:checked').value;

        if (!this.playerNames.X) {
            alert("Player 1 name cannot be empty.");
            return;
        }
        if (this.gameMode === "multiplayer" && !this.playerNames.O) {
            alert("Player 2 name cannot be empty.");
            return;
        }

        this.gameLogic = new TicTacToeGameLogic(this.gameMode === "singleplayer" ? this.aiDifficulty : null);

        this.startScreen.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        this.renderGameBoard();
        this.updateStatusLabel();
        console.log("UIManager: Game started successfully (UI updated)."); // DEBUG
    }

    // Renders/updates the game board in the GUI
    renderGameBoard() {
        console.log("UIManager: renderGameBoard called."); // DEBUG
        this.gameBoardDiv.innerHTML = ''; // Clear existing buttons
        const board = this.gameLogic.getBoard();

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const button = document.createElement('button');
                button.classList.add('game-button', 'bg-gray-200', 'text-gray-800', 'shadow-md');
                button.dataset.row = r;
                button.dataset.col = c;
                button.addEventListener('click', () => this.onButtonClick(r, c)); // Attach click listener

                // Apply player-specific image/background if cell is occupied
                if (board[r][c] === 'X') {
                    button.classList.add('player-x-bg', 'filled');
                } else if (board[r][c] === 'O') {
                    button.classList.add('player-o-bg', 'filled');
                }

                // Disable button if cell is occupied or game is over
                const gameStatus = this.gameLogic.getGameStatus();
                if (board[r][c] !== '' || gameStatus.gameOver) {
                    button.disabled = true;
                    button.classList.remove('hover:bg-gray-300');
                    button.classList.add('cursor-not-allowed');
                }

                this.gameBoardDiv.appendChild(button);
            }
        }
    }

    // Updates the status label displaying current player or game outcome
    updateStatusLabel() {
        console.log("UIManager: updateStatusLabel called."); // DEBUG
        const status = this.gameLogic.getGameStatus();
        let labelText = "";
        let labelColorClass = "text-gray-800";

        if (status.gameOver) {
            if (status.winner) {
                labelText = `Winner: ${this.playerNames[status.winner]} (${status.winner})!`;
                labelColorClass = "text-green-600";
            } else if (status.isDraw) {
                labelText = "It's a Draw!";
                labelColorClass = "text-yellow-600";
            }
        } else {
            const currentPlayerSymbol = this.gameLogic.getCurrentPlayer();
            const currentPlayerName = this.playerNames[currentPlayerSymbol];
            labelText = `Turn: ${currentPlayerName} (${currentPlayerSymbol})`;
            labelColorClass = "text-blue-600";
        }
        this.statusLabel.textContent = labelText;
        this.statusLabel.className = `text-3xl font-bold mb-6 text-center ${labelColorClass}`;
    }

    // Event handler for a game board button click
    onButtonClick(r, c) {
        console.log(`UIManager: Button clicked at (${r}, ${c}).`); // DEBUG
        if (this.gameLogic.makeMove(r, c)) {
            this.renderGameBoard();
            this.updateStatusLabel();

            const status = this.gameLogic.getGameStatus();
            if (status.gameOver) {
                this.disableAllBoardButtons();
            } else if (this.gameMode === "singleplayer" && this.gameLogic.getCurrentPlayer() === "O") {
                console.log("UIManager: AI's turn, scheduling AI move."); // DEBUG
                setTimeout(() => this.makeAIMove(), 700); // Delay AI move
            }
        }
    }

    // Triggers AI move and updates UI
    makeAIMove() {
        console.log("UIManager: makeAIMove called."); // DEBUG
        const aiMoveCoords = this.gameLogic.makeAIMove();
        if (aiMoveCoords) {
            this.renderGameBoard();
            this.updateStatusLabel();

            const status = this.gameLogic.getGameStatus();
            if (status.gameOver) {
                this.disableAllBoardButtons();
            }
        }
    }

    // Disables all board buttons
    disableAllBoardButtons() {
        console.log("UIManager: Disabling all board buttons."); // DEBUG
        const buttons = this.gameBoardDiv.querySelectorAll('.game-button');
        buttons.forEach(button => {
            button.disabled = true;
            button.classList.remove('hover:bg-gray-300');
            button.classList.add('cursor-not-allowed');
        });
    }

    // Resets the game GUI and logic
    resetGameGUI() {
        console.log("UIManager: resetGameGUI called."); // DEBUG
        this.gameLogic.resetGame(this.gameMode === "singleplayer" ? this.aiDifficulty : null);
        this.renderGameBoard();
        this.updateStatusLabel();
    }
}

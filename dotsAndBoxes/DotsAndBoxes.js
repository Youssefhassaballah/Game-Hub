document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const statusDisplay = document.getElementById('status');
    const currentPlayerDisplay = document.getElementById('current-player');
    const score1Display = document.getElementById('score1');
    const score2Display = document.getElementById('score2');
    const resetBtn = document.getElementById('reset');
    const newGameBtn = document.getElementById('new-game');
    const backBtn = document.getElementById('back');
    const modeBtns = document.querySelectorAll('.mode-btn');
    
    // Game settings
    const ROWS = 4;
    const COLS = 4;
    const CELL_SIZE = 50;
    
    let currentPlayer = 1;
    let scores = [0, 0];
    let gameActive = true;
    let gameMode = '2player';
    let lines = [];
    let boxes = [];
    
    // Initialize the game
    function initGame() {
        board.innerHTML = '';
        
        currentPlayer = 1;
        scores = [0, 0];
        gameActive = true;
        lines = [];
        boxes = [];
        
        updateScores();
        updateCurrentPlayer();
        updateStatus();
        
        createGrid();
    }
    
    // Create the game grid
    function createGrid() {
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-container';
        gridContainer.style.width = `${COLS * CELL_SIZE}px`;
        gridContainer.style.height = `${ROWS * CELL_SIZE}px`;
        
        // Create dots
        for (let row = 0; row <= ROWS; row++) {
            for (let col = 0; col <= COLS; col++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                dot.style.left = `${col * CELL_SIZE - 4}px`;
                dot.style.top = `${row * CELL_SIZE - 4}px`;
                gridContainer.appendChild(dot);
            }
        }
        
        // Create horizontal lines
        for (let row = 0; row <= ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const line = document.createElement('div');
                line.className = 'line horizontal';
                line.style.left = `${col * CELL_SIZE + 4}px`;
                line.style.top = `${row * CELL_SIZE - 1.5}px`;
                line.addEventListener('click', () => handleLineClick(row, col, 'horizontal'));
                
                gridContainer.appendChild(line);
                lines.push({
                    row,
                    col,
                    direction: 'horizontal',
                    element: line,
                    claimed: false,
                    player: 0
                });
            }
        }
        
        // Create vertical lines
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col <= COLS; col++) {
                const line = document.createElement('div');
                line.className = 'line vertical';
                line.style.left = `${col * CELL_SIZE - 1.5}px`;
                line.style.top = `${row * CELL_SIZE + 4}px`;
                line.addEventListener('click', () => handleLineClick(row, col, 'vertical'));
                
                gridContainer.appendChild(line);
                lines.push({
                    row,
                    col,
                    direction: 'vertical',
                    element: line,
                    claimed: false,
                    player: 0
                });
            }
        }
        
        // Create boxes
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const box = document.createElement('div');
                box.className = 'box';
                box.style.left = `${col * CELL_SIZE + 4}px`;
                box.style.top = `${row * CELL_SIZE + 4}px`;
                
                gridContainer.appendChild(box);
                boxes.push({
                    row,
                    col,
                    element: box,
                    owner: 0
                });
            }
        }
        
        board.appendChild(gridContainer);
    }
    
    // Handle line click
    function handleLineClick(row, col, direction) {
        if (!gameActive) return;
        
        const line = lines.find(l => 
            l.row === row && l.col === col && l.direction === direction
        );
        
        if (!line || line.claimed) return;
        
        // Claim the line
        line.claimed = true;
        line.player = currentPlayer;
        line.element.classList.add(`player${currentPlayer}`);
        
        // Check for completed boxes
        const completedBoxes = checkCompletedBoxes();
        
        if (completedBoxes.length > 0) {
            // Player gets points and another turn
            scores[currentPlayer - 1] += completedBoxes.length;
            updateScores();
            
            statusDisplay.textContent = `Player ${currentPlayer} completed ${completedBoxes.length} box${completedBoxes.length > 1 ? 'es' : ''}!`;
            
            // Check if game is over
            if (scores[0] + scores[1] === ROWS * COLS) {
                endGame();
                return;
            }
            
            // If it's computer's turn and it completed boxes, make it move again
            if (gameMode === 'computer' && currentPlayer === 2) {
                setTimeout(computerMove, 800);
            }
        } else {
            // Switch players only if no boxes were completed
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateCurrentPlayer();
            updateStatus();
            
            // Computer's turn
            if (gameMode === 'computer' && currentPlayer === 2) {
                setTimeout(computerMove, 800);
            }
        }
    }
    
    // Check for completed boxes
    function checkCompletedBoxes() {
        const completedBoxes = [];
        
        boxes.forEach((box, index) => {
            if (box.owner !== 0) return;
            
            const { row, col } = box;
            
            // Get the four lines surrounding this box
            const topLine = lines.find(l => 
                l.row === row && l.col === col && l.direction === 'horizontal'
            );
            const bottomLine = lines.find(l => 
                l.row === row + 1 && l.col === col && l.direction === 'horizontal'
            );
            const leftLine = lines.find(l => 
                l.row === row && l.col === col && l.direction === 'vertical'
            );
            const rightLine = lines.find(l => 
                l.row === row && l.col === col + 1 && l.direction === 'vertical'
            );
            
            // Check if all four lines are claimed
            if (topLine?.claimed && bottomLine?.claimed && leftLine?.claimed && rightLine?.claimed) {
                box.owner = currentPlayer;
                box.element.classList.add(`player${currentPlayer}`);
                box.element.textContent = currentPlayer;
                completedBoxes.push(index);
            }
        });
        
        return completedBoxes;
    }
    
    // Computer AI
    function computerMove() {
        if (!gameActive) return;
        
        const availableLines = lines.filter(line => !line.claimed);
        if (availableLines.length === 0) return;
        
        // Simple strategy: try to complete boxes first, otherwise random
        let bestMove = null;
        
        // Look for moves that complete boxes
        for (const line of availableLines) {
            line.claimed = true;
            line.player = 2;
            
            const completedBoxes = checkCompletedBoxes();
            
            // Undo the test move
            line.claimed = false;
            line.player = 0;
            completedBoxes.forEach(boxIndex => {
                boxes[boxIndex].owner = 0;
                boxes[boxIndex].element.classList.remove('player2');
                boxes[boxIndex].element.textContent = '';
            });
            
            if (completedBoxes.length > 0) {
                bestMove = line;
                break;
            }
        }
        
        // If no box-completing move, choose randomly
        if (!bestMove) {
            bestMove = availableLines[Math.floor(Math.random() * availableLines.length)];
        }
        
        // Make the move
        handleLineClick(bestMove.row, bestMove.col, bestMove.direction);
    }
    
    // Update UI functions
    function updateScores() {
        score1Display.textContent = scores[0];
        score2Display.textContent = scores[1];
    }
    
    function updateCurrentPlayer() {
        currentPlayerDisplay.textContent = `Player ${currentPlayer}`;
        currentPlayerDisplay.className = `info-value player${currentPlayer}`;
    }
    
    function updateStatus() {
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        statusDisplay.style.color = currentPlayer === 1 ? 'var(--neon-blue)' : 'var(--neon-pink)';
    }
    
    // End game
    function endGame() {
        gameActive = false;
        
        let winner;
        if (scores[0] > scores[1]) {
            winner = 1;
        } else if (scores[1] > scores[0]) {
            winner = 2;
        } else {
            winner = 0;
        }
        
        if (winner === 0) {
            statusDisplay.textContent = "It's a tie!";
            statusDisplay.style.color = 'var(--light-text)';
        } else {
            statusDisplay.textContent = `Player ${winner} wins!`;
            statusDisplay.style.color = winner === 1 ? 'var(--neon-blue)' : 'var(--neon-pink)';
        }
    }
    
    // Set game mode
    function setMode(mode) {
        gameMode = mode;
        modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        initGame();
    }
    
    // Event listeners
    resetBtn.addEventListener('click', initGame);
    newGameBtn.addEventListener('click', () => setMode(gameMode));
    
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });
    
    backBtn.addEventListener('click', () => {
        console.log('Back button clicked');
    });
    
    // Initialize the game
    initGame();
});
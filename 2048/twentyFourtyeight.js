document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('reset');
    const newGameBtn = document.getElementById('new-game');
    const backBtn = document.getElementById('back');
    const scoreDisplay = document.getElementById('score');
    const highestTileDisplay = document.getElementById('highest-tile');
    const arrowUp = document.getElementById('arrow-up');
    const arrowDown = document.getElementById('arrow-down');
    const arrowLeft = document.getElementById('arrow-left');
    const arrowRight = document.getElementById('arrow-right');
    
    let grid = [];
    let score = 0;
    let highestTile = 0;
    let gameActive = true;
    const GRID_SIZE = 4;
    const TARGET = 2048;
    let isAnimating = false;

    // Touch handling variables
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    // Initialize the game
    function initGame() {
        // Clear the board
        board.innerHTML = '';
        grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
        score = 0;
        highestTile = 0;
        gameActive = true;
        
        // Create cells
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell empty';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.innerHTML = '<div class="cell-content"></div>';
                board.appendChild(cell);
            }
        }
        
        // Add initial tiles
        addRandomTile();
        addRandomTile();
        
        updateDisplay();
    }
    
    // Add a random tile (2 or 4)
    function addRandomTile() {
        const emptyCells = [];
        
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            grid[row][col] = value;
            
            // Create and animate new tile
            const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            const tile = document.createElement('div');
            tile.className = `tile new`;
            tile.dataset.value = value;
            tile.textContent = value;
            cell.querySelector('.cell-content').appendChild(tile);
            
            // Update highest tile
            if (value > highestTile) {
                highestTile = value;
                if (highestTile >= TARGET) {
                    gameActive = false;
                    status.textContent = `Congratulations! You reached ${TARGET}!`;
                    status.style.color = 'var(--neon-green)';
                }
            }
            
            return true;
        }
        return false;
    }
    
    // Update the entire display
    function updateDisplay() {
        scoreDisplay.textContent = score;
        highestTileDisplay.textContent = highestTile;
    }
    
    // Move tiles in a direction with animations
    function moveTiles(direction) {
        if (!gameActive || isAnimating) return false;
        
        isAnimating = true;
        let moved = false;
        const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
        const moves = [];
        const merges = [];
        
        // Process the grid based on direction
        if (direction === 'up') {
            for (let col = 0; col < GRID_SIZE; col++) {
                let newRow = 0;
                let prevValue = 0;
                let prevPos = -1;
                
                for (let row = 0; row < GRID_SIZE; row++) {
                    if (grid[row][col] !== 0) {
                        if (prevValue === grid[row][col]) {
                            // Merge tiles
                            const mergedValue = prevValue * 2;
                            newGrid[newRow-1][col] = mergedValue;
                            score += mergedValue;
                            merges.push({
                                fromRow: row,
                                fromCol: col,
                                toRow: newRow-1,
                                toCol: col,
                                value: mergedValue
                            });
                            prevValue = 0;
                            moved = true;
                        } else {
                            // Move tile
                            newGrid[newRow][col] = grid[row][col];
                            if (newRow !== row) {
                                moves.push({
                                    fromRow: row,
                                    fromCol: col,
                                    toRow: newRow,
                                    toCol: col,
                                    value: grid[row][col]
                                });
                                moved = true;
                            }
                            prevValue = grid[row][col];
                            prevPos = row;
                            newRow++;
                        }
                    }
                }
            }
        } 
        else if (direction === 'down') {
            for (let col = 0; col < GRID_SIZE; col++) {
                let newRow = GRID_SIZE - 1;
                let prevValue = 0;
                
                for (let row = GRID_SIZE - 1; row >= 0; row--) {
                    if (grid[row][col] !== 0) {
                        if (prevValue === grid[row][col]) {
                            // Merge tiles
                            const mergedValue = prevValue * 2;
                            newGrid[newRow+1][col] = mergedValue;
                            score += mergedValue;
                            merges.push({
                                fromRow: row,
                                fromCol: col,
                                toRow: newRow+1,
                                toCol: col,
                                value: mergedValue
                            });
                            prevValue = 0;
                            moved = true;
                        } else {
                            // Move tile
                            newGrid[newRow][col] = grid[row][col];
                            if (newRow !== row) {
                                moves.push({
                                    fromRow: row,
                                    fromCol: col,
                                    toRow: newRow,
                                    toCol: col,
                                    value: grid[row][col]
                                });
                                moved = true;
                            }
                            prevValue = grid[row][col];
                            newRow--;
                        }
                    }
                }
            }
        }
        else if (direction === 'left') {
            for (let row = 0; row < GRID_SIZE; row++) {
                let newCol = 0;
                let prevValue = 0;
                
                for (let col = 0; col < GRID_SIZE; col++) {
                    if (grid[row][col] !== 0) {
                        if (prevValue === grid[row][col]) {
                            // Merge tiles
                            const mergedValue = prevValue * 2;
                            newGrid[row][newCol-1] = mergedValue;
                            score += mergedValue;
                            merges.push({
                                fromRow: row,
                                fromCol: col,
                                toRow: row,
                                toCol: newCol-1,
                                value: mergedValue
                            });
                            prevValue = 0;
                            moved = true;
                        } else {
                            // Move tile
                            newGrid[row][newCol] = grid[row][col];
                            if (newCol !== col) {
                                moves.push({
                                    fromRow: row,
                                    fromCol: col,
                                    toRow: row,
                                    toCol: newCol,
                                    value: grid[row][col]
                                });
                                moved = true;
                            }
                            prevValue = grid[row][col];
                            newCol++;
                        }
                    }
                }
            }
        }
        else if (direction === 'right') {
            for (let row = 0; row < GRID_SIZE; row++) {
                let newCol = GRID_SIZE - 1;
                let prevValue = 0;
                
                for (let col = GRID_SIZE - 1; col >= 0; col--) {
                    if (grid[row][col] !== 0) {
                        if (prevValue === grid[row][col]) {
                            // Merge tiles
                            const mergedValue = prevValue * 2;
                            newGrid[row][newCol+1] = mergedValue;
                            score += mergedValue;
                            merges.push({
                                fromRow: row,
                                fromCol: col,
                                toRow: row,
                                toCol: newCol+1,
                                value: mergedValue
                            });
                            prevValue = 0;
                            moved = true;
                        } else {
                            // Move tile
                            newGrid[row][newCol] = grid[row][col];
                            if (newCol !== col) {
                                moves.push({
                                    fromRow: row,
                                    fromCol: col,
                                    toRow: row,
                                    toCol: newCol,
                                    value: grid[row][col]
                                });
                                moved = true;
                            }
                            prevValue = grid[row][col];
                            newCol--;
                        }
                    }
                }
            }
        }
        
        if (moved) {
            // Animate moves and merges
            animateMoves(moves, merges, () => {
                // After animation completes
                grid = newGrid;
                updateDisplay();
                
                // Add new tile after a short delay
                setTimeout(() => {
                    addRandomTile();
                    checkGameOver();
                    isAnimating = false;
                }, 150);
            });
        } else {
            isAnimating = false;
        }
        
        return moved;
    }
    
    // Animate tile movements and merges
    function animateMoves(moves, merges, callback) {
        // First animate all moves
        moves.forEach(move => {
            const fromCell = document.querySelector(`.cell[data-row="${move.fromRow}"][data-col="${move.fromCol}"]`);
            const toCell = document.querySelector(`.cell[data-row="${move.toRow}"][data-col="${move.toCol}"]`);
            const tile = fromCell.querySelector('.tile');
            
            if (tile) {
                // Calculate position difference
                const dx = move.toCol - move.fromCol;
                const dy = move.toRow - move.fromRow;
                
                // Apply transform for smooth movement
                tile.style.transform = `translate(${dx * 100}%, ${dy * 100}%)`;
                
                // After animation completes
                setTimeout(() => {
                    tile.style.transform = '';
                    toCell.querySelector('.cell-content').appendChild(tile);
                }, 150);
            }
        });
        
        // Then animate merges (with slight delay)
        setTimeout(() => {
            merges.forEach(merge => {
                const fromCell = document.querySelector(`.cell[data-row="${merge.fromRow}"][data-col="${merge.fromCol}"]`);
                const toCell = document.querySelector(`.cell[data-row="${merge.toRow}"][data-col="${merge.toCol}"]`);
                const fromTile = fromCell.querySelector('.tile');
                const toTile = toCell.querySelector('.tile');
                
                if (fromTile && toTile) {
                    // Create a new tile for the merge
                    const newTile = document.createElement('div');
                    newTile.className = `tile merged`;
                    newTile.dataset.value = merge.value;
                    newTile.textContent = merge.value;
                    toCell.querySelector('.cell-content').appendChild(newTile);
                    
                    // Remove old tiles
                    setTimeout(() => {
                        fromTile.remove();
                        toTile.remove();
                    }, 150);
                    
                    // Update highest tile
                    if (merge.value > highestTile) {
                        highestTile = merge.value;
                        if (highestTile >= TARGET) {
                            gameActive = false;
                            status.textContent = `Congratulations! You reached ${TARGET}!`;
                            status.style.color = 'var(--neon-green)';
                        }
                    }
                }
            });
            
            // Execute callback after all animations
            setTimeout(callback, 150);
        }, 150);
    }
    
    // Check if game is over (no more moves)
    function checkGameOver() {
        let hasMoves = false;
        
        // Check for empty cells
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (grid[row][col] === 0) {
                    hasMoves = true;
                    break;
                }
            }
            if (hasMoves) break;
        }
        
        // Check for possible merges
        if (!hasMoves) {
            for (let row = 0; row < GRID_SIZE; row++) {
                for (let col = 0; col < GRID_SIZE; col++) {
                    const value = grid[row][col];
                    const directions = [
                        { dr: -1, dc: 0 }, { dr: 1, dc: 0 },
                        { dr: 0, dc: -1 }, { dr: 0, dc: 1 }
                    ];
                    
                    for (const dir of directions) {
                        const newRow = row + dir.dr;
                        const newCol = col + dir.dc;
                        
                        if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE && 
                            grid[newRow][newCol] === value) {
                            hasMoves = true;
                            break;
                        }
                    }
                    if (hasMoves) break;
                }
                if (hasMoves) break;
            }
        }
        
        if (!hasMoves) {
            gameActive = false;
            status.textContent = 'Game Over! No more moves.';
            status.style.color = 'var(--neon-pink)';
        }
    }
    
    // Reset current game
    function resetGame() {
        initGame();
        status.textContent = 'Combine numbers to reach 2048!';
        status.style.color = 'var(--neon-green)';
    }
    
    // Start a new game (reset scores)
    function newGame() {
        initGame();
        status.textContent = 'Combine numbers to reach 2048!';
        status.style.color = 'var(--neon-green)';
    }
    
    // Handle keyboard events
    function handleKeyDown(e) {
        if (!gameActive) return;
        
        let moved = false;
        switch(e.key) {
            case 'ArrowUp':
                moved = moveTiles('up');
                break;
            case 'ArrowDown':
                moved = moveTiles('down');
                break;
            case 'ArrowLeft':
                moved = moveTiles('left');
                break;
            case 'ArrowRight':
                moved = moveTiles('right');
                break;
            default:
                return;
        }
        
        if (moved) {
            e.preventDefault();
        }
    }
    
    // Handle touch events for mobile
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
    
    function handleTouchEnd(e) {
        if (!gameActive) return;
        
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        
        // Determine the primary direction
        if (Math.max(absDx, absDy) > 30) { // Minimum swipe distance
            if (absDx > absDy) {
                // Horizontal swipe
                if (dx > 0) {
                    moveTiles('right');
                } else {
                    moveTiles('left');
                }
            } else {
                // Vertical swipe
                if (dy > 0) {
                    moveTiles('down');
                } else {
                    moveTiles('up');
                }
            }
        }
    }
    
    // Event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    
    // Arrow key buttons
    arrowUp.addEventListener('click', () => moveTiles('up'));
    arrowDown.addEventListener('click', () => moveTiles('down'));
    arrowLeft.addEventListener('click', () => moveTiles('left'));
    arrowRight.addEventListener('click', () => moveTiles('right'));
    
    resetBtn.addEventListener('click', resetGame);
    newGameBtn.addEventListener('click', newGame);
    
    // Back button (does nothing for now)
    backBtn.addEventListener('click', () => {
        console.log('Back button clicked');
    });
    
    // Initialize the game
    initGame();
});

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('reset');
    const newGameBtn = document.getElementById('new-game');
    const backBtn = document.getElementById('back');
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scores = { X: 0, O: 0 };
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Initialize the game
    function initGame() {
        cells.forEach(cell => {
            cell.classList.remove('x', 'o', 'winner');
            cell.querySelector('.cell-content').textContent = '';
        });
        
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
        status.style.color = 'var(--neon-blue)';
    }
    
    // Handle cell click
    function handleCellClick(e) {
        const clickedCell = e.target.closest('.cell');
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // If cell already filled or game not active, ignore click
        if (gameState[clickedCellIndex] !== '' || !gameActive) return;
        
        // Update game state and UI
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.querySelector('.cell-content').textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Check for win or draw
        checkResult();
    }
    
    // Check for win or draw
    function checkResult() {
        let roundWon = false;
        
        // Check all winning conditions
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                
                // Highlight winning cells
                cells[a].classList.add('winner');
                cells[b].classList.add('winner');
                cells[c].classList.add('winner');
                break;
            }
        }
        
        // If won
        if (roundWon) {
            status.textContent = `Player ${currentPlayer} wins!`;
            status.style.color = currentPlayer === 'X' ? 'var(--neon-blue)' : 'var(--neon-pink)';
            gameActive = false;
            
            // Update score
            scores[currentPlayer]++;
            updateScore();
            return;
        }
        
        // If draw
        if (!gameState.includes('')) {
            status.textContent = 'Game ended in a draw!';
            status.style.color = 'var(--light-text)';
            gameActive = false;
            return;
        }
        
        // Change player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
        status.style.color = currentPlayer === 'X' ? 'var(--neon-blue)' : 'var(--neon-pink)';
    }
    
    // Update score display
    function updateScore() {
        scoreX.textContent = scores.X;
        scoreO.textContent = scores.O;
    }
    
    // Reset current game
    function resetGame() {
        initGame();
    }
    
    // Start a new game (reset scores)
    function newGame() {
        scores = { X: 0, O: 0 };
        updateScore();
        initGame();
    }
    
    // Event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);
    newGameBtn.addEventListener('click', newGame);
    
    // Back button (does nothing for now)
    backBtn.addEventListener('click', () => {
        console.log('Back button clicked');
    });
    
    // Initialize the game
    initGame();
});
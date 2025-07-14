document.addEventListener('DOMContentLoaded', () => {
    const memoryBoard = document.getElementById('memory-board');
    const movesDisplay = document.getElementById('moves');
    const pairsDisplay = document.getElementById('pairs');
    const timeDisplay = document.getElementById('time');
    const statusDisplay = document.getElementById('status');
    const newGameBtn = document.getElementById('new-game');
    const backBtn = document.getElementById('back');
    const easyBtn = document.getElementById('easy');
    const mediumBtn = document.getElementById('medium');
    const hardBtn = document.getElementById('hard');
    
    // Game variables
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer = null;
    let seconds = 0;
    let difficulty = 'medium';
    let gameActive = false;
    
    // Emoji symbols for cards
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', 
                    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'];
    
    // Difficulty settings
    const difficultySettings = {
        easy: { pairs: 6, cols: 4 },
        medium: { pairs: 8, cols: 4 },
        hard: { pairs: 10, cols: 5 }
    };
    
    // Initialize game
    function initGame() {
        resetGame();
        createBoard();
        startTimer();
        gameActive = true;
        statusDisplay.textContent = "Game started! Find all the pairs.";
        statusDisplay.style.color = 'var(--neon-green)';
    }
    
    // Create game board based on difficulty
    function createBoard() {
        memoryBoard.innerHTML = '';
        const settings = difficultySettings[difficulty];
        const pairs = settings.pairs;
        
        // Select emojis for this game
        const selectedEmojis = emojis.slice(0, pairs);
        const cardValues = [...selectedEmojis, ...selectedEmojis];
        
        // Shuffle cards
        cardValues.sort(() => Math.random() - 0.5);
        
        // Create cards
        cards = [];
        cardValues.forEach((value, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">${value}</div>
                    <div class="card-back"></div>
                </div>
            `;
            
            card.addEventListener('click', () => flipCard(card, index));
            memoryBoard.appendChild(card);
            cards.push({
                element: card,
                value: value,
                flipped: false,
                matched: false
            });
        });
        
        // Set grid columns based on difficulty
        memoryBoard.style.gridTemplateColumns = `repeat(${settings.cols}, 1fr)`;
    }
    
    // Flip a card
    function flipCard(card, index) {
        if (!gameActive || cards[index].flipped || cards[index].matched) return;
        if (flippedCards.length >= 2) return;
        
        // Flip the card
        card.classList.add('flipped');
        cards[index].flipped = true;
        flippedCards.push(index);
        
        // Play sound
        playFlipSound();
        
        // Check for match when two cards are flipped
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            
            const [firstIdx, secondIdx] = flippedCards;
            if (cards[firstIdx].value === cards[secondIdx].value) {
                // Match found
                cards[firstIdx].matched = true;
                cards[secondIdx].matched = true;
                cards[firstIdx].element.classList.add('matched');
                cards[secondIdx].element.classList.add('matched');
                
                matchedPairs++;
                pairsDisplay.textContent = matchedPairs;
                
                // Play success sound
                playMatchSound();
                
                // Check if game is won
                if (matchedPairs === difficultySettings[difficulty].pairs) {
                    endGame(true);
                }
                
                flippedCards = [];
            } else {
                // No match - flip back after delay
                setTimeout(() => {
                    cards[firstIdx].flipped = false;
                    cards[secondIdx].flipped = false;
                    cards[firstIdx].element.classList.remove('flipped');
                    cards[secondIdx].element.classList.remove('flipped');
                    flippedCards = [];
                }, 1000);
            }
        }
    }
    
    // Start timer
    function startTimer() {
        seconds = 0;
        timeDisplay.textContent = seconds;
        clearInterval(timer);
        timer = setInterval(() => {
            seconds++;
            timeDisplay.textContent = seconds;
        }, 1000);
    }
    
    // End game
    function endGame(win) {
        gameActive = false;
        clearInterval(timer);
        
        if (win) {
            statusDisplay.textContent = `You won in ${seconds} seconds with ${moves} moves!`;
            statusDisplay.style.color = 'var(--neon-green)';
            playWinSound();
        } else {
            statusDisplay.textContent = "Game reset";
            statusDisplay.style.color = 'var(--neon-pink)';
        }
    }
    
    // Reset game
    function resetGame() {
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        seconds = 0;
        movesDisplay.textContent = '0';
        pairsDisplay.textContent = '0';
        timeDisplay.textContent = '0';
        clearInterval(timer);
    }
    
    // Set difficulty
    function setDifficulty(level) {
        difficulty = level;
        
        // Update active button
        easyBtn.classList.remove('active');
        mediumBtn.classList.remove('active');
        hardBtn.classList.remove('active');
        
        if (level === 'easy') {
            easyBtn.classList.add('active');
        } else if (level === 'medium') {
            mediumBtn.classList.add('active');
        } else {
            hardBtn.classList.add('active');
        }
        
        statusDisplay.textContent = `Difficulty set to ${level}`;
        statusDisplay.style.color = 'var(--neon-green)';
    }
    
    // Sound effects
    function playFlipSound() {
        const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...');
        audio.volume = 0.2;
        audio.play().catch(e => console.log("Audio play failed:", e));
    }
    
    function playMatchSound() {
        const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...');
        audio.volume = 0.3;
        audio.play().catch(e => console.log("Audio play failed:", e));
    }
    
    function playWinSound() {
        const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...');
        audio.volume = 0.3;
        audio.play().catch(e => console.log("Audio play failed:", e));
    }
    
    // Event listeners
    easyBtn.addEventListener('click', () => setDifficulty('easy'));
    mediumBtn.addEventListener('click', () => setDifficulty('medium'));
    hardBtn.addEventListener('click', () => setDifficulty('hard'));
    
    newGameBtn.addEventListener('click', initGame);
    
    // Back button (does nothing for now)
    backBtn.addEventListener('click', () => {
        console.log('Back button clicked');
    });
    
    // Set default difficulty
    setDifficulty('medium');
});
document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guess');
    const submitBtn = document.getElementById('submit');
    const resetBtn = document.getElementById('reset');
    const newGameBtn = document.getElementById('new-game');
    const backBtn = document.getElementById('back');
    const timerDisplay = document.getElementById('timer');
    const attemptsDisplay = document.getElementById('attempts');
    const rangeDisplay = document.getElementById('range');
    const messageDisplay = document.getElementById('message');
    const historyDisplay = document.getElementById('history');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    
    let targetNumber;
    let attempts = 0;
    let timerInterval;
    let seconds = 0;
    let gameActive = false;
    let maxNumber = 100;
    let difficulty = 'easy';
    let guessHistory = [];
    
    // Difficulty settings
    const difficultySettings = {
        easy: { range: 100, timeLimit: 0 },
        medium: { range: 200, timeLimit: 60 },
        hard: { range: 500, timeLimit: 45 },
        expert: { range: 1000, timeLimit: 30 }
    };
    
    // Initialize the game
    function initGame() {
        // Generate random number based on difficulty
        maxNumber = difficultySettings[difficulty].range;
        targetNumber = Math.floor(Math.random() * (maxNumber + 1));
        
        // Reset game state
        attempts = 0;
        seconds = 0;
        guessHistory = [];
        gameActive = true;
        
        // Update UI
        updateTimer();
        attemptsDisplay.textContent = attempts;
        rangeDisplay.textContent = `0-${maxNumber}`;
        messageDisplay.textContent = '';
        historyDisplay.innerHTML = '<div>Guess history will appear here</div>';
        guessInput.value = '';
        guessInput.focus();
        
        // Start timer
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        
        console.log(`Target number: ${targetNumber}`); // For debugging
    }
    
    // Update timer display
    function updateTimer() {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${mins}:${secs}`;
        
        // Check time limit if applicable
        if (difficultySettings[difficulty].timeLimit > 0 && 
            seconds >= difficultySettings[difficulty].timeLimit) {
            endGame(false, `Time's up! The number was ${targetNumber}.`);
        }
    }
    
    // Handle guess submission
    function handleGuess() {
        if (!gameActive) return;
        
        const guess = parseInt(guessInput.value);
        
        // Validate input
        if (isNaN(guess) ){
            messageDisplay.textContent = 'Please enter a valid number!';
            messageDisplay.style.color = 'var(--neon-pink)';
            return;
        }
        
        if (guess < 0 || guess > maxNumber) {
            messageDisplay.textContent = `Please enter a number between 0 and ${maxNumber}!`;
            messageDisplay.style.color = 'var(--neon-pink)';
            return;
        }
        
        // Process valid guess
        attempts++;
        attemptsDisplay.textContent = attempts;
        guessHistory.push(guess);
        
        // Add to history
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        if (guess === targetNumber) {
            // Correct guess
            endGame(true, `Congratulations! You found the number ${targetNumber} in ${attempts} attempts and ${formatTime(seconds)}!`);
            historyItem.textContent = `✅ ${guess} - Correct!`;
            historyItem.style.color = 'var(--neon-green)';
        } else {
            // Incorrect guess
            const hint = guess < targetNumber ? 'Too low!' : 'Too high!';
            messageDisplay.textContent = hint;
            messageDisplay.style.color = guess < targetNumber ? 'var(--neon-blue)' : 'var(--neon-pink)';
            historyItem.textContent = `➡ ${guess} - ${hint}`;
            historyItem.style.color = guess < targetNumber ? 'var(--neon-blue)' : 'var(--neon-pink)';
        }
        
        // Update history display
        if (historyDisplay.firstChild.textContent === 'Guess history will appear here') {
            historyDisplay.innerHTML = '';
        }
        historyDisplay.prepend(historyItem);
        guessInput.value = '';
    }
    
    // Format time as MM:SS
    function formatTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}m ${secs}s`;
    }
    
    // End the game
    function endGame(won, message) {
        gameActive = false;
        clearInterval(timerInterval);
        messageDisplay.textContent = message;
        messageDisplay.style.color = won ? 'var(--neon-green)' : 'var(--neon-pink)';
    }
    
    // Set difficulty
    function setDifficulty(selectedDifficulty) {
        difficulty = selectedDifficulty;
        difficultyBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === selectedDifficulty) {
                btn.classList.add('active');
            }
        });
        initGame();
    }
    
    // Event listeners
    submitBtn.addEventListener('click', handleGuess);
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGuess();
    });
    
    resetBtn.addEventListener('click', initGame);
    newGameBtn.addEventListener('click', () => {
        setDifficulty(difficulty);
    });
    
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setDifficulty(btn.dataset.difficulty);
        });
    });
    
    // Back button (does nothing for now)
    backBtn.addEventListener('click', () => {
        console.log('Back button clicked');
    });
    
    // Initialize the game
    setDifficulty('easy');
});
document.addEventListener('DOMContentLoaded', () => {
    const quadrants = document.querySelectorAll('.quadrant');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const speedDisplay = document.getElementById('speed');
    const statusDisplay = document.getElementById('status');
    const startBtn = document.getElementById('start');
    const strictBtn = document.getElementById('strict');
    const resetBtn = document.getElementById('reset');
    const speedUpBtn = document.getElementById('speed-up');
    const speedDownBtn = document.getElementById('speed-down');
    
    let sequence = [];
    let playerSequence = [];
    let level = 0;
    let strictMode = false;
    let gameActive = false;
    let computerPlaying = false;
    let gameSpeed = 1;
    let bestScore = parseInt(localStorage.getItem('simon-best-score')) || 0;
    
    bestScoreDisplay.textContent = bestScore;
    
    // Sound frequencies for each quadrant
    const sounds = {
        0: 261.63,  // C (green)
        1: 293.66,  // D (pink)
        2: 329.63,  // E (blue)
        3: 349.23,  // F (yellow)
        4: 392.00,  // G (purple)
        5: 440.00,  // A (red)
        6: 493.88,  // B (cyan)
        7: 523.25,  // C (orange)
        8: 587.33   // D (coral)
    };
    
    // Initialize audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    
    // Play sound for a quadrant
    function playSound(quadrantIndex) {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = sounds[quadrantIndex];
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(
            0.1, audioContext.currentTime + 0.5 / gameSpeed
        );
        oscillator.stop(audioContext.currentTime + 0.5 / gameSpeed);
    }
    
    // Light up a quadrant
    function activateQuadrant(index) {
        const quadrant = quadrants[index];
        quadrant.classList.add('active');
        playSound(index);
        
        setTimeout(() => {
            quadrant.classList.remove('active');
        }, 500 / gameSpeed);
    }
    
    // Play the sequence
    function playSequence() {
        computerPlaying = true;
        statusDisplay.textContent = "Watch carefully...";
        
        let i = 0;
        const interval = setInterval(() => {
            activateQuadrant(sequence[i]);
            i++;
            
            if (i >= sequence.length) {
                clearInterval(interval);
                setTimeout(() => {
                    computerPlaying = false;
                    statusDisplay.textContent = "Your turn!";
                    playerSequence = [];
                }, 500 / gameSpeed);
            }
        }, 800 / gameSpeed);
    }
    
    // Generate next step in sequence
    function nextStep() {
        if (!gameActive) return;
        
        sequence.push(Math.floor(Math.random() * 9));
        level++;
        scoreDisplay.textContent = level;
        
        if (level > bestScore) {
            bestScore = level;
            bestScoreDisplay.textContent = bestScore;
            localStorage.setItem('simon-best-score', bestScore);
        }
        
        playerSequence = [];
        
        playSequence();
    }
    
    // Check player's sequence
    function checkSequence(index) {
        if (computerPlaying) return;
        
        playerSequence.push(index);
        activateQuadrant(index);
        
        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            // Wrong sequence
            statusDisplay.textContent = "Wrong! Try again.";
            statusDisplay.style.color = 'var(--neon-pink)';
            
            if (strictMode) {
                // Strict mode - start over
                setTimeout(() => {
                    resetGame();
                    startGame();
                }, 1000);
            } else {
                // Normal mode - replay sequence
                setTimeout(() => {
                    statusDisplay.style.color = 'var(--neon-green)';
                    playSequence();
                }, 1000);
            }
        } else if (playerSequence.length === sequence.length) {
            // Correct sequence
            if (level === 30) {
                // Win game
                statusDisplay.textContent = "You won! Congratulations!";
                statusDisplay.style.color = 'var(--neon-green)';
                gameActive = false;
                startBtn.textContent = "Start";
            } else {
                // Next level
                statusDisplay.textContent = "Correct! Next level...";
                statusDisplay.style.color = 'var(--neon-green)';
                setTimeout(() => {
                    nextStep();
                }, 1000);
            }
        }
    }
    
    // Start new game
    function startGame() {
        if (gameActive) return;
        
        sequence = [];
        level = 0;
        gameActive = true;
        scoreDisplay.textContent = level;
        statusDisplay.textContent = "Game started!";
        statusDisplay.style.color = 'var(--neon-green)';
        startBtn.textContent = "Playing...";
        
        nextStep();
    }
    
    // Reset game
    function resetGame() {
        sequence = [];
        playerSequence = [];
        level = 0;
        gameActive = false;
        computerPlaying = false;
        scoreDisplay.textContent = level;
        statusDisplay.textContent = "Press START to play";
        statusDisplay.style.color = 'var(--neon-green)';
        startBtn.textContent = "Start";
    }
    
    // Pause game
    function pauseGame() {
        if (!gameActive) return;
        
        gamePaused = !gamePaused;
        if (gamePaused) {
            statusDisplay.textContent = "Game paused";
            pauseBtn.textContent = "Resume";
        } else {
            statusDisplay.textContent = "Game resumed!";
            pauseBtn.textContent = "Pause";
            if (computerPlaying) {
                playSequence();
            } else {
                statusDisplay.textContent = "Your turn!";
            }
        }
    }
    
    // Toggle strict mode
    function toggleStrictMode() {
        strictMode = !strictMode;
        strictBtn.classList.toggle('active', strictMode);
        statusDisplay.textContent = strictMode ? "Strict mode ON" : "Strict mode OFF";
    }
    
    // Speed controls
    function speedUp() {
        if (gameSpeed < 3) {
            gameSpeed += 0.25;
            speedDisplay.textContent = gameSpeed.toFixed(2) + 'x';
            statusDisplay.textContent = `Speed: ${gameSpeed.toFixed(2)}x`;
        }
    }
    
    function speedDown() {
        if (gameSpeed > 0.5) {
            gameSpeed -= 0.25;
            speedDisplay.textContent = gameSpeed.toFixed(2) + 'x';
            statusDisplay.textContent = `Speed: ${gameSpeed.toFixed(2)}x`;
        }
    }
    
    // Event listeners
    quadrants.forEach((quadrant, index) => {
        quadrant.addEventListener('click', () => {
            if (gameActive && !computerPlaying) {
                checkSequence(index);
            }
        });
    });
    
    startBtn.addEventListener('click', startGame);
    strictBtn.addEventListener('click', toggleStrictMode);
    resetBtn.addEventListener('click', resetGame);
    speedUpBtn.addEventListener('click', speedUp);
    speedDownBtn.addEventListener('click', speedDown);
    
    // Initialize game
    resetGame();
});
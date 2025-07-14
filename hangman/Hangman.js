document.addEventListener('DOMContentLoaded', () => {
    const hangmanDisplay = document.getElementById('hangman-display');
    const wordDisplay = document.getElementById('word-display');
    const keyboard = document.getElementById('keyboard');
    const statusDisplay = document.getElementById('status');
    const newGameBtn = document.getElementById('new-game');
    const backBtn = document.getElementById('back');
    
    // Hangman parts in order
    const hangmanParts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];
    
    // Word categories and words
    const wordCategories = {
        animals: ['ELEPHANT', 'GIRAFFE', 'KANGAROO', 'DOLPHIN', 'CHEETAH', 'PENGUIN', 'BUTTERFLY', 'CROCODILE'],
        countries: ['CANADA', 'BRAZIL', 'JAPAN', 'GERMANY', 'AUSTRALIA', 'FRANCE', 'EGYPT', 'THAILAND'],
        fruits: ['PINEAPPLE', 'WATERMELON', 'STRAWBERRY', 'BLUEBERRY', 'RASPBERRY', 'MANGO', 'BANANA', 'ORANGE'],
        technology: ['COMPUTER', 'INTERNET', 'SMARTPHONE', 'KEYBOARD', 'MONITOR', 'SOFTWARE', 'HARDWARE', 'ALGORITHM'],
        space: ['GALAXY', 'PLANET', 'ASTEROID', 'SATELLITE', 'UNIVERSE', 'NEBULA', 'ROCKET', 'TELESCOPE']
    };
    
    let currentWord = '';
    let currentCategory = '';
    let guessedLetters = [];
    let incorrectGuesses = 0;
    let gameActive = true;
    
    // Create floating particles
    function createParticles() {
        const colors = ['#08f', '#f0f', '#90f', '#0f8', '#ff0'];
        setInterval(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
            particle.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 8000);
        }, 2000);
    }
    
    // Initialize the game
    function initGame() {
        // Select a random category and word
        const categories = Object.keys(wordCategories);
        currentCategory = categories[Math.floor(Math.random() * categories.length)];
        const words = wordCategories[currentCategory];
        currentWord = words[Math.floor(Math.random() * words.length)];
        
        // Reset game state
        guessedLetters = [];
        incorrectGuesses = 0;
        gameActive = true;
        
        // Hide all hangman parts
        hangmanParts.forEach(part => {
            document.getElementById(part).classList.remove('visible');
        });
        
        // Update displays
        updateWordDisplay();
        createKeyboard();
        
        // Set status
        statusDisplay.textContent = `Category: ${currentCategory.toUpperCase()}. Guess the word!`;
        statusDisplay.className = 'status';
    }
    
    // Update hangman display by showing parts
    function updateHangmanDisplay() {
        if (incorrectGuesses > 0 && incorrectGuesses <= hangmanParts.length) {
            const partToShow = hangmanParts[incorrectGuesses - 1];
            document.getElementById(partToShow).classList.add('visible');
        }
    }
    
    // Update word display with guessed letters
    function updateWordDisplay() {
        wordDisplay.innerHTML = '';
        
        for (const letter of currentWord) {
            const letterElement = document.createElement('div');
            letterElement.className = 'letter';
            
            if (guessedLetters.includes(letter)) {
                letterElement.textContent = letter;
                letterElement.classList.add('guessed');
            } else {
                letterElement.textContent = '';
            }
            
            wordDisplay.appendChild(letterElement);
        }
        
        // Check if player won
        if (isWordGuessed()) {
            gameActive = false;
            statusDisplay.textContent = '🎉 Congratulations! You won! 🎉';
            statusDisplay.className = 'status';
            disableAllKeys();
            createCelebrationEffect();
        }
    }
    
    // Create keyboard buttons
    function createKeyboard() {
        keyboard.innerHTML = '';
        
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const key = document.createElement('button');
            key.className = 'key';
            key.textContent = letter;
            key.dataset.letter = letter;
            
            if (guessedLetters.includes(letter)) {
                key.disabled = true;
                if (currentWord.includes(letter)) {
                    key.classList.add('correct');
                } else {
                    key.classList.add('incorrect');
                }
            }
            
            key.addEventListener('click', () => handleGuess(letter));
            keyboard.appendChild(key);
        }
    }
    
    // Handle letter guess
    function handleGuess(letter) {
        if (!gameActive || guessedLetters.includes(letter)) return;
        
        guessedLetters.push(letter);
        
        if (!currentWord.includes(letter)) {
            incorrectGuesses++;
            updateHangmanDisplay();
            
            // Check if player lost
            if (incorrectGuesses >= hangmanParts.length) {
                gameActive = false;
                statusDisplay.textContent = `💀 Game Over! The word was: ${currentWord} 💀`;
                statusDisplay.className = 'status error';
                disableAllKeys();
                
                // Reveal the word
                const letterElements = wordDisplay.querySelectorAll('.letter');
                for (let i = 0; i < currentWord.length; i++) {
                    letterElements[i].textContent = currentWord[i];
                    letterElements[i].classList.add('guessed');
                }
            } else {
                const remaining = hangmanParts.length - incorrectGuesses;
                statusDisplay.textContent = `❌ Incorrect guess! ${remaining} attempts remaining.`;
                statusDisplay.className = 'status warning';
            }
        } else {
            statusDisplay.textContent = '✅ Correct guess!';
            statusDisplay.className = 'status';
        }
        
        updateWordDisplay();
        createKeyboard();
    }
    
    // Check if the whole word has been guessed
    function isWordGuessed() {
        return currentWord.split('').every(letter => guessedLetters.includes(letter));
    }
    
    // Disable all keyboard keys
    function disableAllKeys() {
        const keys = keyboard.querySelectorAll('.key');
        keys.forEach(key => {
            key.disabled = true;
        });
    }
    
    // Create celebration effect
    function createCelebrationEffect() {
        const colors = ['#08f', '#f0f', '#90f', '#0f8', '#ff0'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.width = '8px';
                confetti.style.height = '8px';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '0';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '1000';
                confetti.style.animation = 'confetti 3s linear forwards';
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }
    }
    
    // Add confetti animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confetti {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Event listeners
    newGameBtn.addEventListener('click', initGame);
    
    backBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to go back? Your progress will be lost.')) {
            console.log('Back button clicked');
        }
    });
    
    // Keyboard event listener
    document.addEventListener('keydown', (e) => {
        if (!gameActive) return;
        
        const key = e.key.toUpperCase();
        if (/^[A-Z]$/.test(key) && !guessedLetters.includes(key)) {
            handleGuess(key);
        }
    });
    
    // Initialize the game and particles
    initGame();
    createParticles();
});
document.addEventListener('DOMContentLoaded', () => {
    const playerChoices = document.querySelectorAll('.choice');
    const playerChoiceDisplay = document.getElementById('player-choice');
    const computerChoiceDisplay = document.getElementById('computer-choice');
    const statusDisplay = document.getElementById('status');
    const playerScoreDisplay = document.getElementById('player-score');
    const computerScoreDisplay = document.getElementById('computer-score');
    const resetBtn = document.getElementById('reset');
    const backBtn = document.getElementById('back');
    
    let playerScore = 0;
    let computerScore = 0;
    let gameActive = true;
    
    // Emoji mapping
    const emojiMap = {
        rock: '✊',
        paper: '✋',
        scissors: '✌️'
    };
    
    // Game logic
    function playGame(playerChoice) {
        if (!gameActive) return;
        
        // Computer random choice
        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
        
        // Update displays
        playerChoiceDisplay.textContent = emojiMap[playerChoice];
        computerChoiceDisplay.textContent = emojiMap[computerChoice];
        
        // Highlight player's choice
        playerChoices.forEach(choice => {
            choice.classList.remove('selected', 'pulse-glow');
            if (choice.dataset.choice === playerChoice) {
                choice.classList.add('selected', 'pulse-glow');
            }
        });
        
        // Add shake animation to computer choice
        computerChoiceDisplay.classList.add('shake');
        setTimeout(() => {
            computerChoiceDisplay.classList.remove('shake');
        }, 500);
        
        // Determine winner
        let result;
        if (playerChoice === computerChoice) {
            result = "It's a tie!";
            statusDisplay.style.color = 'var(--neon-blue)';
        } else if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            result = "You win!";
            playerScore++;
            statusDisplay.style.color = 'var(--neon-green)';
            
            // Add celebration effect to player choice
            const playerChoiceElement = document.querySelector(`.choice[data-choice="${playerChoice}"]`);
            playerChoiceElement.classList.add('pulse-glow');
        } else {
            result = "Computer wins!";
            computerScore++;
            statusDisplay.style.color = 'var(--neon-pink)';
            
            // Add effect to computer choice
            computerChoiceDisplay.classList.add('pulse-glow');
        }
        
        // Update scores immediately
        playerScoreDisplay.textContent = playerScore;
        computerScoreDisplay.textContent = computerScore;
        
        statusDisplay.textContent = result;
        
        // Disable further choices temporarily
        gameActive = false;
        setTimeout(() => {
            gameActive = true;
            statusDisplay.textContent = "Choose your weapon!";
            statusDisplay.style.color = 'var(--neon-green)';
            
            // Clear all choices and effects
            playerChoices.forEach(choice => {
                choice.classList.remove('selected', 'pulse-glow');
            });
            
            // Clear displays
            playerChoiceDisplay.textContent = '?';
            computerChoiceDisplay.textContent = '?';
            computerChoiceDisplay.classList.remove('pulse-glow');
        }, 2000);
    }
    
    // Reset game
    function resetGame() {
        playerScore = 0;
        computerScore = 0;
        playerScoreDisplay.textContent = '0';
        computerScoreDisplay.textContent = '0';
        playerChoiceDisplay.textContent = '?';
        computerChoiceDisplay.textContent = '?';
        statusDisplay.textContent = 'Choose your weapon!';
        statusDisplay.style.color = 'var(--neon-green)';
        
        playerChoices.forEach(choice => {
            choice.classList.remove('selected', 'pulse-glow');
        });
        
        computerChoiceDisplay.classList.remove('pulse-glow');
        gameActive = true;
    }
    
    // Event listeners
    playerChoices.forEach(choice => {
        choice.addEventListener('click', () => {
            if (gameActive) {
                playGame(choice.dataset.choice);
            }
        });
    });
    
    resetBtn.addEventListener('click', resetGame);
    
    // Back button (placeholder functionality)
    backBtn.addEventListener('click', () => {
        console.log('Back button clicked');
    });
});
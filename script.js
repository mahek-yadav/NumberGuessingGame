class NumberGuessingGame {
            constructor() {
                this.secretNumber = 0;
                this.maxAttempts = 10;
                this.attempts = 0;
                this.bestScore = localStorage.getItem('bestScore') || 0;
                this.gameActive = false;
                this.previousGuesses = [];
                
                this.initializeElements();
                this.bindEvents();
                this.updateDisplay();
                this.newGame();
            }

            initializeElements() {
                this.guessField = document.getElementById('guessField');
                this.submitBtn = document.getElementById('submitBtn');
                this.newGameBtn = document.getElementById('newGameBtn');
                this.messageEl = document.getElementById('message');
                this.remainingEl = document.getElementById('remaining');
                this.attemptsUsedEl = document.getElementById('attemptsUsed');
                this.bestScoreEl = document.getElementById('bestScore');
                this.previousGuessesEl = document.getElementById('previousGuesses');
                this.minNumEl = document.getElementById('minNum');
                this.maxNumEl = document.getElementById('maxNum');
            }

            bindEvents() {
                this.submitBtn.addEventListener('click', () => this.checkGuess());
                this.newGameBtn.addEventListener('click', () => this.newGame());
                this.guessField.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.checkGuess();
                });
            }

            newGame() {
                this.secretNumber = Math.floor(Math.random() * 100) + 1;
                this.attempts = 0;
                this.gameActive = true;
                this.previousGuesses = [];
                this.guessField.value = '';
                this.guessField.disabled = false;
                this.submitBtn.style.display = 'inline-block';
                this.newGameBtn.style.display = 'none';
                this.showMessage('', '');
                
                this.updateDisplay();
                this.updatePreviousGuesses();
            }

            checkGuess() {
                if (!this.gameActive) return;

                const guess = parseInt(this.guessField.value);
                
                if (isNaN(guess) || guess < 1 || guess > 100) {
                    this.showMessage('Please enter a number between 1 and 100!', 'error');
                    return;
                }

                this.attempts++;
                this.previousGuesses.push(guess);
                this.guessField.value = '';

                if (guess === this.secretNumber) {
                    this.gameWon();
                } else if (this.attempts >= this.maxAttempts) {
                    this.gameLost();
                } else {
                    const message = guess < this.secretNumber ? 'Too low! Try higher.' : 'Too high! Try lower.';
                    this.showMessage(message, 'info');
                    this.updateDisplay();
                    this.updatePreviousGuesses();
                }
            }

            gameWon() {
                this.gameActive = false;
                this.guessField.disabled = true;
                this.submitBtn.style.display = 'none';
                this.newGameBtn.style.display = 'inline-block';
                
                const score = this.maxAttempts - this.attempts + 1;
                if (score > this.bestScore) {
                    this.bestScore = score;
                    localStorage.setItem('bestScore', this.bestScore);
                }
                
                this.showMessage(`Correct! The number was ${this.secretNumber}. You scored ${score} points!`, 'success');
                this.updateDisplay();
            }

            gameLost() {
                this.gameActive = false;
                this.guessField.disabled = true;
                this.submitBtn.style.display = 'none';
                this.newGameBtn.style.display = 'inline-block';
                this.showMessage(`Game Over! The number was ${this.secretNumber}. Better luck next time!`, 'error');
                this.updateDisplay();
            }

            showMessage(text, type) {
                this.messageEl.textContent = text;
                this.messageEl.className = `message ${type} show`;
                setTimeout(() => {
                    this.messageEl.classList.remove('show');
                }, 4000);
            }

            updateDisplay() {
                this.remainingEl.textContent = this.maxAttempts - this.attempts;
                this.attemptsUsedEl.textContent = this.attempts;
                this.bestScoreEl.textContent = this.bestScore;
            }

            updatePreviousGuesses() {
                if (this.previousGuesses.length === 0) {
                    this.previousGuessesEl.innerHTML = '<strong>Your previous guesses:</strong>';
                    return;
                }
                
                this.previousGuessesEl.innerHTML = '<strong>Your previous guesses:</strong> ' + 
                    this.previousGuesses.map(g => `<span class="guess-item">${g}</span>`).join(' ');
            }
        }

        // Initialize game when page loads
        document.addEventListener('DOMContentLoaded', () => {
            new NumberGuessingGame();
        });
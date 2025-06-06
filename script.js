// Elementos del DOM
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startButton = document.getElementById('start-button');
const playAgainButton = document.getElementById('play-again-button');
const gameBoard = document.getElementById('game-board');
const timeDisplay = document.getElementById('time');
const movesDisplay = document.getElementById('moves');
const resultMessage = document.getElementById('result-message');
const finalMovesDisplay = document.getElementById('final-moves');
const timerProgress = document.querySelector('.timer-progress');

// Variables del juego
let timeLeft = 40;
let moves = 0;
let timer;
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;

// Imágenes de productos Coca-Cola para las cartas
const cardImages = [
    'botella-clasica',
    'coca-zero',
    'sprite',
    'fanta',
    'vaso-hielo',
    'logo-vintage',
    'lata-clasica',
    'botella-vidrio'
];

// Función para cambiar entre pantallas
function showScreen(screen) {
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen) {
        currentScreen.style.opacity = '0';
        setTimeout(() => {
            [welcomeScreen, gameScreen, resultScreen].forEach(s => s.classList.remove('active'));
            screen.classList.add('active');
            screen.style.opacity = '1';
        }, 500);
    } else {
        screen.classList.add('active');
        screen.style.opacity = '1';
    }
}

// Función para crear las cartas
function createCards() {
    const cards = [...cardImages, ...cardImages];
    const shuffledCards = cards.sort(() => Math.random() - 0.5);
    
    gameBoard.innerHTML = '';
    shuffledCards.forEach((image, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.card = image;
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        const imagePath = `../assets/img/products/${image}.png`;
        console.log('Cargando imagen:', imagePath);
        cardFront.style.backgroundImage = `url(${imagePath})`;
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        card.addEventListener('click', () => flipCard(card));
        
        gameBoard.appendChild(card);
    });
}

// Función para voltear una carta
function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) return;
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        canFlip = false;
        checkMatch();
    }
}

// Función para verificar si las cartas coinciden
function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.card === card2.dataset.card;
    
    if (match) {
        matchedPairs++;
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        setTimeout(() => {
            card1.classList.remove('matched');
            card2.classList.remove('matched');
        }, 500);
        
        flippedCards = [];
        canFlip = true;
        
        if (matchedPairs === cardImages.length) {
            setTimeout(() => {
                endGame(true);
            }, 1000);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

// Función para iniciar el temporizador
function startTimer() {
    const totalTime = 40;
    timeLeft = totalTime;
    timerProgress.style.width = '100%';
    
    timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        timerProgress.style.width = `${(timeLeft / totalTime) * 100}%`;
        
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// Función para terminar el juego
function endGame(won) {
    clearInterval(timer);
    if (won) {
        resultMessage.textContent = '¡FELICIDADES, CAMPEÓN DE LA MEMORIA! Has ganado una gaseosa de tu preferencia y una remera del merchandising de Coca - Cola';
    } else {
        resultMessage.textContent = '¡Se acabó el tiempo! ¿Quieres intentarlo de nuevo?';
    }
    finalMovesDisplay.textContent = moves;
    showScreen(resultScreen);
}

// Event Listeners
startButton.addEventListener('click', () => {
    timeLeft = 40;
    moves = 0;
    matchedPairs = 0;
    flippedCards = [];
    canFlip = true;
    
    timeDisplay.textContent = timeLeft;
    movesDisplay.textContent = moves;
    
    createCards();
    showScreen(gameScreen);
    startTimer();
});

playAgainButton.addEventListener('click', () => {
    showScreen(welcomeScreen);
});

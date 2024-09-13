const pads = document.querySelectorAll(".pad");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("startBtn");
let score = 0;
let gameSequence = [];
let playerSequence = [];
let intervalId;
let playing = false;
let audioContext;

// Crear y reproducir un sonido
function playSound(frequency) {
  if (!audioContext) return; // Asegura que el contexto de audio esté inicializado
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();

  gainNode.gain.setValueAtTime(1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + 0.5
  );

  oscillator.stop(audioContext.currentTime + 0.5); // Detiene el oscilador después de 0.5s
}

// Comenzar el juego
function startGame() {
  if (!playing) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Inicializar contexto de audio aquí
    playing = true;
    score = 0;
    scoreDisplay.textContent = score;
    gameSequence = [];
    playerSequence = [];
    nextRound();
  }
}

// Generar secuencia aleatoria
function nextRound() {
  gameSequence.push(Math.floor(Math.random() * 4));
  playerSequence = [];
  playSequence();
}

// Reproducir secuencia del juego
function playSequence() {
  let i = 0;
  intervalId = setInterval(() => {
    const padIndex = gameSequence[i];
    pads[padIndex].classList.add("active");
    playSound(200 + padIndex * 100); // Reproducir sonido correspondiente
    setTimeout(() => pads[padIndex].classList.remove("active"), 300);
    i++;
    if (i >= gameSequence.length) {
      clearInterval(intervalId);
    }
  }, 800);
}

// Manejar la entrada del jugador
pads.forEach((pad, index) => {
  pad.addEventListener("click", () => {
    if (playing) {
      playSound(200 + index * 100); // Reproducir sonido del pad presionado
      playerSequence.push(index);
      pads[index].classList.add("active");
      setTimeout(() => pads[index].classList.remove("active"), 300);
      checkPlayerInput();
    }
  });
});

// Verificar la entrada del jugador
function checkPlayerInput() {
  const currentStep = playerSequence.length - 1;
  if (playerSequence[currentStep] !== gameSequence[currentStep]) {
    alert("¡Te equivocaste! Fin del juego.");
    playing = false;
    return;
  }

  if (playerSequence.length === gameSequence.length) {
    score++;
    scoreDisplay.textContent = score;
    setTimeout(nextRound, 1000);
  }
}

// Agregar event listener al botón de comenzar
startButton.addEventListener("click", startGame);

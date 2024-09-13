const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const circles = [];
const scale = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88]; // Escala de Do mayor
const tempo = 120;
const beatDuration = 60 / tempo;
const noteDurations = [1, 0.5, 0.25, 1.5];
const colorPalettes = [
  ["#FF6F61", "#6B5B95", "#88B04B", "#F7C6C7"],
  ["#D0E1F9", "#F1A5A6", "#F4B9B2", "#C0E4F8"],
  ["#C5E1A5", "#F7E0B3", "#FFAB91", "#CE93D8"],
];
let currentPalette = 0;
let colorShift = 0;

function createCircle(x, y, radius, color, alpha = 1) {
  return { x, y, radius, color, alpha };
}

function generateCircle() {
  const noteIndex = Math.floor(Math.random() * scale.length);
  const frequency = scale[noteIndex];
  const duration =
    noteDurations[Math.floor(Math.random() * noteDurations.length)];
  const radius = 40 + frequency / 20;
  const x = (canvas.width / scale.length) * noteIndex + Math.random() * 50;
  const intensity = Math.random();
  const y = canvas.height * (1 - intensity);
  const adjustedIntensity = Math.pow(intensity, 0.5);
  const volume = adjustedIntensity * 0.5 + 0.1;
  const colorIndex = Math.floor(
    (colorShift + Math.random() * colorPalettes[currentPalette].length) %
      colorPalettes[currentPalette].length
  );
  const color = colorPalettes[currentPalette][colorIndex];
  colorShift = (colorShift + 1) % colorPalettes[currentPalette].length;
  const circle = createCircle(x, y, radius, color);
  circles.push(circle);
  drawCircles();
  playSound(frequency, duration, volume);
  fadeOutCircle(circle);
}

function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach((circle) => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color
      .replace(")", `, ${circle.alpha})`)
      .replace("hsl", "hsla");
    ctx.fill();
  });
}

function playSound(frequency, duration, volume) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + duration
  );
  oscillator.stop(audioContext.currentTime + duration);
}

function fadeOutCircle(circle) {
  const fadeOutDuration = 1000;
  const fadeOutSteps = 30;
  const stepDuration = fadeOutDuration / fadeOutSteps;
  let alpha = 1;
  const fadeOutInterval = setInterval(() => {
    alpha -= 1 / fadeOutSteps;
    if (alpha <= 0) {
      alpha = 0;
      clearInterval(fadeOutInterval);
      const index = circles.indexOf(circle);
      if (index > -1) circles.splice(index, 1);
    }
    circle.alpha = alpha;
    drawCircles();
  }, stepDuration);
}

function autoGenerateCircles() {
  function generateRandomCircle() {
    generateCircle();
    const duration =
      noteDurations[Math.floor(Math.random() * noteDurations.length)];
    const interval = beatDuration * 1000 * duration;
    setTimeout(generateRandomCircle, interval);
  }
  generateRandomCircle();
}

function changeColorPalette() {
  setInterval(() => {
    currentPalette = (currentPalette + 1) % colorPalettes.length;
    colorShift = 0;
  }, 10000);
}

autoGenerateCircles();
changeColorPalette();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Configuración del canvas
canvas.width = 600;
canvas.height = 600;

// Tamaño de cada celda en la cuadrícula
const cellSize = 50;
const cols = canvas.width / cellSize;
const rows = canvas.height / cellSize;

// Array para almacenar celdas ocupadas
let grid = Array.from({ length: rows }, () => Array(cols).fill(false));

// Array para almacenar las formas
let shapes = [];

// Paletas de colores armoniosas
const colorPalettes = [
  ["#D4A5A5", "#FFB085", "#FFCB69", "#8FCB9B", "#62A9A0"],
  ["#D4F1F4", "#75E6DA", "#05445E", "#189AB4", "#05445E"],
  ["#6B4226", "#D9BF77", "#F3DFA2", "#FFF1CE", "#C99E10"],
  ["#B6D0E2", "#F7C6C7", "#FFB6B9", "#FAA4A1", "#8C3F5D"],
  ["#023E8A", "#0077B6", "#0096C7", "#00B4D8", "#48CAE4"],
];

// Seleccionar una paleta de colores al azar
const currentPalette =
  colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

// Función para obtener un color aleatorio de la paleta seleccionada
function getRandomColor() {
  return currentPalette[Math.floor(Math.random() * currentPalette.length)];
}

// Función para crear un objeto de forma con propiedades de animación
function createShape(x, y, width, height, type) {
  return {
    x,
    y,
    width,
    height,
    type,
    color: getRandomColor(),
    hoverColor: getRandomColor(),
    isHovered: false,
    scale: 1,
    angle: 0,
    rotationSpeed: Math.random() * 0.05 - 0.025, // Velocidad de rotación aleatoria
    pulseSpeed: Math.random() * 0.005 + 0.002, // Velocidad de pulsación aleatoria
  };
}

// Función para dibujar un cuadrado
function drawSquare(shape) {
  ctx.save();
  ctx.translate(shape.x + shape.width / 2, shape.y + shape.width / 2); // Centrar el contexto
  ctx.rotate(shape.angle); // Rotar el contexto
  ctx.scale(shape.scale, shape.scale); // Escalar el contexto
  ctx.fillStyle = shape.isHovered ? shape.hoverColor : shape.color;
  ctx.fillRect(-shape.width / 2, -shape.width / 2, shape.width, shape.width); // Dibujar cuadrado centrado
  ctx.restore();
}

// Función para dibujar un círculo
function drawCircle(shape) {
  ctx.save();
  ctx.translate(shape.x + shape.width / 2, shape.y + shape.width / 2);
  ctx.rotate(shape.angle);
  ctx.scale(shape.scale, shape.scale);
  ctx.beginPath();
  ctx.arc(0, 0, shape.width / 2, 0, Math.PI * 2);
  ctx.fillStyle = shape.isHovered ? shape.hoverColor : shape.color;
  ctx.fill();
  ctx.restore();
}

// Función para dibujar un rectángulo
function drawRectangle(shape) {
  ctx.save();
  ctx.translate(shape.x + shape.width / 2, shape.y + shape.height / 2);
  ctx.rotate(shape.angle);
  ctx.scale(shape.scale, shape.scale);
  ctx.fillStyle = shape.isHovered ? shape.hoverColor : shape.color;
  ctx.fillRect(-shape.width / 2, -shape.height / 2, shape.width, shape.height);
  ctx.restore();
}

// Función para actualizar las animaciones de las formas
function updateAnimations() {
  shapes.forEach((shape) => {
    // Animación de rotación
    shape.angle += shape.rotationSpeed;

    // Animación de pulsación
    shape.scale = 1 + 0.1 * Math.sin(Date.now() * shape.pulseSpeed);
  });
}

// Función para dibujar formas geométricas
function drawShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
  shapes.forEach((shape) => {
    switch (shape.type) {
      case "square":
        drawSquare(shape);
        break;
      case "circle":
        drawCircle(shape);
        break;
      case "rectangle":
        drawRectangle(shape);
        break;
    }
  });
}

// Función para verificar si una forma cabe en la cuadrícula
function canPlaceShape(x, y, width, height) {
  if (x + width > cols || y + height > rows) return false;
  for (let i = y; i < y + height; i++) {
    for (let j = x; j < x + width; j++) {
      if (grid[i][j]) return false;
    }
  }
  return true;
}

// Función para marcar las celdas ocupadas
function markCells(x, y, width, height) {
  for (let i = y; i < y + height; i++) {
    for (let j = x; j < x + width; j++) {
      grid[i][j] = true;
    }
  }
}

// Función para dibujar formas geométricas aleatorias de varios tamaños
function drawRandomShape(x, y) {
  const shapeType = Math.floor(Math.random() * 3); // 0: Cuadrado, 1: Círculo, 2: Rectángulo

  const sizeOptions = [1, 2, 3]; // Tamaños posibles en términos de celdas
  const size =
    sizeOptions[Math.floor(Math.random() * sizeOptions.length)] * cellSize;

  const width = size;
  const height =
    sizeOptions[Math.floor(Math.random() * sizeOptions.length)] * cellSize;

  if (canPlaceShape(x, y, width / cellSize, height / cellSize)) {
    let shape;
    switch (shapeType) {
      case 0: // Cuadrado
        shape = createShape(x * cellSize, y * cellSize, size, size, "square");
        break;
      case 1: // Círculo
        shape = createShape(x * cellSize, y * cellSize, size, size, "circle");
        break;
      case 2: // Rectángulo
        shape = createShape(
          x * cellSize,
          y * cellSize,
          width,
          height,
          "rectangle"
        );
        break;
    }
    shapes.push(shape);
    markCells(x, y, width / cellSize, height / cellSize);
  }
}

// Función para dibujar la cuadrícula con formas grandes
function drawGrid() {
  // Reiniciar la cuadrícula de ocupación y las formas
  grid = Array.from({ length: rows }, () => Array(cols).fill(false));
  shapes = [];

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (!grid[j][i]) {
        drawRandomShape(i, j);
      }
    }
  }
  drawShapes();
}

// Función para manejar el hover sobre las formas
function handleHover(x, y) {
  shapes.forEach((shape) => {
    shape.isHovered =
      x >= shape.x &&
      x <= shape.x + shape.width &&
      y >= shape.y &&
      y <= shape.y + shape.height;
  });
  drawShapes();
}

// Dibujar la cuadrícula inicial
drawGrid();

// Evento de movimiento del ratón
canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  handleHover(mouseX, mouseY);
});

// Bucle de animación
function animate() {
  updateAnimations();
  drawShapes();
  requestAnimationFrame(animate);
}
animate();

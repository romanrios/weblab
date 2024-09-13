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
  ["#D4A5A5", "#FFB085", "#FFCB69", "#8FCB9B", "#62A9A0"], // Paleta 1
  ["#D4F1F4", "#75E6DA", "#05445E", "#189AB4", "#05445E"], // Paleta 2
  ["#6B4226", "#D9BF77", "#F3DFA2", "#FFF1CE", "#C99E10"], // Paleta 3
  ["#B6D0E2", "#F7C6C7", "#FFB6B9", "#FAA4A1", "#8C3F5D"], // Paleta 4
  ["#023E8A", "#0077B6", "#0096C7", "#00B4D8", "#48CAE4"], // Paleta 5
];

// Seleccionar una paleta de colores al azar
const currentPalette =
  colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

// Función para obtener un color aleatorio de la paleta seleccionada
function getRandomColor() {
  return currentPalette[Math.floor(Math.random() * currentPalette.length)];
}

// Función para crear un objeto de forma
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
    animation: {
      scale: 1,
      direction: 1, // 1 para aumentar, -1 para disminuir
    },
  };
}

// Función para dibujar un cuadrado
function drawSquare(shape) {
  ctx.fillStyle = shape.isHovered ? shape.hoverColor : shape.color;
  ctx.fillRect(
    shape.x,
    shape.y,
    shape.width * shape.animation.scale,
    shape.width * shape.animation.scale
  );
}

// Función para dibujar un círculo
function drawCircle(shape) {
  ctx.beginPath();
  ctx.arc(
    shape.x + shape.width / 2,
    shape.y + shape.width / 2,
    (shape.width / 2) * shape.animation.scale,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = shape.isHovered ? shape.hoverColor : shape.color;
  ctx.fill();
}

// Función para dibujar un rectángulo
function drawRectangle(shape) {
  ctx.fillStyle = shape.isHovered ? shape.hoverColor : shape.color;
  ctx.fillRect(
    shape.x,
    shape.y,
    shape.width * shape.animation.scale,
    shape.height * shape.animation.scale
  );
}

// Función para dibujar formas geométricas
function drawShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
}

// Función para manejar el clic en las formas
function handleClick(x, y) {
  shapes.forEach((shape) => {
    if (
      x >= shape.x &&
      x <= shape.x + shape.width &&
      y >= shape.y &&
      y <= shape.y + shape.height
    ) {
      // Anima la forma al hacer clic
      shape.color = getRandomColor();
    }
  });
  drawGrid();
}

// Evento de clic del mouse para generar una nueva cuadrícula
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / cellSize) * cellSize;
  const y = Math.floor((event.clientY - rect.top) / cellSize) * cellSize;
  handleClick(x, y);
});

// Evento de movimiento del mouse para detectar el hover
canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  handleHover(x, y);
  drawShapes();
});

// Animación automática para cambiar el color y tamaño de las formas
function animateShapes() {
  shapes.forEach((shape) => {
    // Cambiar color aleatoriamente
    if (Math.random() < 0.01) {
      // Pequeña probabilidad de cambio de color
      shape.color = getRandomColor();
    }

    // Animación de escala de tamaño
    shape.animation.scale += 0.01 * shape.animation.direction;
    if (shape.animation.scale >= 1.5 || shape.animation.scale <= 0.5) {
      shape.animation.direction *= -1; // Cambiar la dirección de la escala
    }
  });
  drawShapes();
}

// Función que llama a la animación en un bucle
function loop() {
  animateShapes();
  requestAnimationFrame(loop);
}

// Dibuja la cuadrícula inicial al cargar la página
drawGrid();
loop();

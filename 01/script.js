const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Configuración del canvas
canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 150;

// Función para obtener un color aleatorio
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Función para dibujar círculos en una posición aleatoria
function drawCircle(x, y) {
  const radius = Math.random() * 30 + 5;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = getRandomColor();
  ctx.fill();
}

// Evento de movimiento del mouse
canvas.addEventListener("mousemove", (event) => {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  drawCircle(x, y);
});

// Evento de clic del mouse
canvas.addEventListener("click", (event) => {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;

  for (let i = 0; i < 10; i++) {
    drawCircle(x + Math.random() * 100 - 50, y + Math.random() * 100 - 50);
  }
});

// Función para limpiar el canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Botón para limpiar el canvas
const clearButton = document.createElement("button");
clearButton.textContent = "Limpiar Lienzo";
clearButton.style.marginTop = "20px";
clearButton.onclick = clearCanvas;
document.body.appendChild(clearButton);

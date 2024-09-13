const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Configuración del lienzo
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables para almacenar los círculos y la gravedad
const circles = [];
const gravity = 0.05;
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 100,
};

// Generar un número aleatorio en un rango
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Generar un color aleatorio
function randomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r},${g},${b},0.8)`;
}

// Clase para definir un Círculo
class Circle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.opacity = 1;
    this.exploded = false; // Flag para verificar si ha explotado
  }

  // Método para dibujar el círculo
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1; // Resetear la opacidad para otros dibujos
  }

  // Método para actualizar la posición del círculo
  update() {
    this.draw();

    // Detectar colisión con el mouse y repeler
    const distX = mouse.x - this.x;
    const distY = mouse.y - this.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < mouse.radius + this.radius) {
      const angle = Math.atan2(distY, distX);
      const repulsionForce = (mouse.radius + this.radius - distance) / 10;
      this.velocity.x -= Math.cos(angle) * repulsionForce;
      this.velocity.y -= Math.sin(angle) * repulsionForce;
    }

    // Movimiento de los círculos
    this.velocity.y += gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Rebote en los bordes del lienzo
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.velocity.x = -this.velocity.x * 0.8;
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.velocity.y = -this.velocity.y * 0.8;
    }
  }

  // Método para explotar el círculo en círculos más pequeños
  explode() {
    if (!this.exploded) {
      this.exploded = true;
      for (let i = 0; i < 5; i++) {
        const newRadius = this.radius / 3;
        const newVelocity = {
          x: randomInRange(-2, 2),
          y: randomInRange(-2, 2),
        };
        circles.push(
          new Circle(this.x, this.y, newRadius, randomColor(), newVelocity)
        );
      }
    }
  }
}

// Crear círculos iniciales
function init() {
  for (let i = 0; i < 30; i++) {
    const radius = randomInRange(20, 50);
    const x = randomInRange(radius, canvas.width - radius);
    const y = randomInRange(radius, canvas.height - radius);
    const color = randomColor();
    const velocity = {
      x: randomInRange(-2, 2),
      y: randomInRange(-2, 2),
    };

    circles.push(new Circle(x, y, radius, color, velocity));
  }
}

// Animar los círculos
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach((circle) => circle.update());
  requestAnimationFrame(animate);
}

// Detectar movimiento del mouse
canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// Detectar clic en el círculo
canvas.addEventListener("click", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  circles.forEach((circle) => {
    const distX = mouse.x - circle.x;
    const distY = mouse.y - circle.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < circle.radius) {
      circle.explode();
    }
  });
});

// Redimensionar el lienzo cuando se cambia el tamaño de la ventana
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  mouse.x = canvas.width / 2;
  mouse.y = canvas.height / 2;
});

init();
animate();

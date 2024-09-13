const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const mouse = {
  x: null,
  y: null,
  radius: 150,
};

// Actualizar posición del mouse
window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Crear clase Partícula
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  // Dibujar partícula
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  // Actualizar posición de la partícula
  update() {
    // Colisión con el mouse
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 10;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 10;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 10;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 10;
      }
    }

    // Mover partícula
    this.x += this.directionX;
    this.y += this.directionY;

    // Rebotar en los bordes
    if (this.x <= 0 || this.x >= canvas.width) {
      this.directionX = -this.directionX;
    }
    if (this.y <= 0 || this.y >= canvas.height) {
      this.directionY = -this.directionY;
    }

    // Dibujar la partícula
    this.draw();
  }
}

// Crear un array de partículas
function init() {
  particlesArray.length = 0;
  const numberOfParticles = (canvas.width * canvas.height) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    const size = Math.random() * 5 + 1;
    const x = Math.random() * (innerWidth - size * 2);
    const y = Math.random() * (innerHeight - size * 2);
    const directionX = Math.random() * 0.4 - 0.2;
    const directionY = Math.random() * 0.4 - 0.2;
    const color = "rgba(255, 255, 255, 0.8)"; // Blanco translúcido
    particlesArray.push(
      new Particle(x, y, directionX, directionY, size, color)
    );
  }
}

// Animar partículas
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach((particle) => particle.update());
  connectParticles();
  requestAnimationFrame(animate);
}

// Conectar partículas con líneas para crear una "nebulosa"
function connectParticles() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        opacityValue = 1 - distance / 100;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// Manejar clics para crear un "vórtice"
canvas.addEventListener("click", () => {
  particlesArray.forEach((particle) => {
    particle.directionX = Math.random() * 4 - 2;
    particle.directionY = Math.random() * 4 - 2;
  });
});

// Ajustar tamaño del lienzo si la ventana cambia de tamaño
window.addEventListener("resize", function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  mouse.radius = (canvas.height / 80) * (canvas.width / 80);
  init();
});

// Iniciar animación
init();
animate();

// --- Interactive Particle Canvas Background with Mouse Interaction ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 75;

// Mouse tracking object
const mouse = {
    x: null,
    y: null,
    radius: 150 // Connection radius for mouse hover
};

// Set Canvas Dimensions
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();

// Mouse Event Listeners for Interaction
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Object blueprints
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off canvas boundary edges
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 122, 255, 0.35)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Generate all particle vectors
function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}
initParticles();

// Animation frame updating thread
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections and update positions
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // 1. Connect particles to nearby particles
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 229, 255, ${0.12 - (distance / 120) * 0.12})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }

        // 2. Connect particles to mouse pointer dynamically
        if (mouse.x !== null && mouse.y !== null) {
            const mDx = particlesArray[i].x - mouse.x;
            const mDy = particlesArray[i].y - mouse.y;
            const mDistance = Math.sqrt(mDx * mDx + mDy * mDy);

            if (mDistance < mouse.radius) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 229, 255, ${0.25 - (mDistance / mouse.radius) * 0.25})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// --- Responsive Window Resizing ---
window.addEventListener('resize', () => {
    setCanvasSize();
    initParticles();
});

// --- Modern Intersection Observer for Fade-In Effects ---
const observerOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: "0px"
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(section => {
    sectionObserver.observe(section);
});

// --- Contact Form Submission Handler (Triggers Mailto Client) ---
function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const message = document.getElementById('userMessage').value;

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    // Opens default mail application with pre-filled content
    window.location.href = `mailto:thaminduofficial5@gmail.com?subject=${subject}&body=${body}`;
}

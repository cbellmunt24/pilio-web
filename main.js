/* ============================================
   PILIO - JavaScript para Animaciones
   ============================================ */

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Para animaciones que solo deben ejecutarse una vez
            if (entry.target.dataset.animateOnce === 'true') {
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Observar todos los elementos con clases de animación
const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .slide-in-up');
animatedElements.forEach(el => {
    observer.observe(el);
});

// Parallax effect para elementos con clase parallax-bg
const parallaxElements = document.querySelectorAll('.parallax-bg');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    parallaxElements.forEach(element => {
        const rate = scrolled * 0.5;
        element.style.transform = `translateY(${rate}px)`;
    });
});

// Counter animation para números en beneficios
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// Observar números para animación
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

const benefitNumbers = document.querySelectorAll('.beneficio-number');
benefitNumbers.forEach(num => {
    counterObserver.observe(num);
});

// Chart bar animation
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const bars = entry.target.querySelectorAll('.chart-bar');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    const height = bar.getAttribute('data-height');
                    const barFill = bar.querySelector('.bar-fill');
                    if (barFill) {
                        barFill.style.height = `${height}%`;
                    }
                }, index * 200);
            });
        }
    });
}, { threshold: 0.3 });

const growthChart = document.querySelector('.growth-chart');
if (growthChart) {
    chartObserver.observe(growthChart);
}


// Transformation circles animation
const transformCircles = document.querySelectorAll('.transform-circle');
transformCircles.forEach((circle, index) => {
    circle.style.animationDelay = `${index * 1}s`;
});

// Form validation and submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Aquí puedes agregar la lógica de envío del formulario
        // Por ejemplo, usando Fetch API o un servicio de formularios
        
        // Feedback visual
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        // Simulación de envío (reemplazar con lógica real)
        setTimeout(() => {
            submitButton.textContent = '¡Mensaje Enviado!';
            submitButton.style.background = '#10b981';
            contactForm.reset();
            
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// Microinteracciones para cards
const cards = document.querySelectorAll('.problema-card, .beneficio-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Smooth reveal para secciones
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transition = 'opacity 0.6s ease';
    sectionObserver.observe(section);
});

// Scroll progress indicator (opcional)
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #3B44B0, #5a64d0);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
};

// Inicializar scroll progress
createScrollProgress();

// Performance optimization: Lazy load images (si se añaden imágenes)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback para navegadores que no soportan lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Hero text animation on load - Mejorado
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Las animaciones CSS ya manejan esto, pero añadimos efectos adicionales
        const titleLines = heroTitle.querySelectorAll('.title-line');
        const titleAccent = heroTitle.querySelector('.title-accent');
        
        // Efecto de brillo en el título accent después de la animación
        if (titleAccent) {
            setTimeout(() => {
                titleAccent.style.animation = 'title-accent-reveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, title-glow 3s ease-in-out 2s infinite';
            }, 100);
        }
    }
    
    // Cursor personalizado removido
});

// Estilos adicionales removidos

// Add stagger animation to problem cards
const problemaCards = document.querySelectorAll('.problema-card');
problemaCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Add stagger animation to benefit cards
const beneficioCards = document.querySelectorAll('.beneficio-card');
beneficioCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.15}s`;
});

// Timeline items stagger animation
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.2}s`;
});

// Inicializar video de mariposa con chroma key
function initButterflyVideo() {
    const container = document.getElementById('butterfly-video-container');
    if (container) {
        const butterflyVideo = new ButterflyVideo(
            container,
            'assets/videos/BUTTERFLY 2.webm'
        );
        
        window.butterflyVideo = butterflyVideo;
    }
}

// Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButterflyVideo);
    } else {
    initButterflyVideo();
    }

console.log('Pilio - Renacer Digital Web & SEO - Cargado correctamente');
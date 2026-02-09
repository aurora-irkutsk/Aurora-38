// =============================================================================
// ПРОДВИНУТЫЕ АНИМАЦИИ ДЛЯ САЙТА AURORA 38
// =============================================================================

// =============================================================================
// 1. CURSOR TRAIL - След за курсором
// =============================================================================
class CursorTrail {
    constructor() {
        this.particles = [];
        this.maxParticles = 15;
        this.init();
    }

    init() {
        // Создаем контейнер для частиц
        this.container = document.createElement('div');
        this.container.className = 'cursor-trail-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(this.container);

        // Отслеживаем движение мыши
        document.addEventListener('mousemove', (e) => this.createParticle(e));
    }

    createParticle(e) {
        // Создаем частицу
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        
        const size = Math.random() * 8 + 4;
        const hue = Math.random() * 30 + 25; // Оранжевые оттенки
        
        particle.style.cssText = `
            position: absolute;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, hsla(${hue}, 100%, 60%, 0.8), hsla(${hue}, 100%, 50%, 0));
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: particleFade 0.8s ease-out forwards;
        `;

        this.container.appendChild(particle);
        this.particles.push(particle);

        // Удаляем старые частицы
        if (this.particles.length > this.maxParticles) {
            const oldParticle = this.particles.shift();
            oldParticle.remove();
        }

        // Удаляем частицу после анимации
        setTimeout(() => {
            particle.remove();
            const index = this.particles.indexOf(particle);
            if (index > -1) this.particles.splice(index, 1);
        }, 800);
    }
}

// =============================================================================
// 2. TEXT SCRAMBLE - Эффект перемешивания текста
// =============================================================================
class TextScramble {
    constructor(element) {
        this.element = element;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.element.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.element.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// =============================================================================
// 3. MORPHING SVG - Анимация морфинга для SVG иконок
// =============================================================================
function initSVGMorphing() {
    const svgIcons = document.querySelectorAll('.advantage-cards__item svg, .step svg');
    
    svgIcons.forEach(svg => {
        svg.addEventListener('mouseenter', () => {
            gsap.to(svg, {
                scale: 1.2,
                rotation: 360,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)'
            });
        });

        svg.addEventListener('mouseleave', () => {
            gsap.to(svg, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
}

// =============================================================================
// 4. GSAP SCROLL ANIMATIONS - Профессиональные scroll-анимации
// =============================================================================
function initGSAPScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Анимация для карточек услуг
    gsap.utils.toArray('.service').forEach((service, i) => {
        gsap.from(service, {
            scrollTrigger: {
                trigger: service,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            x: i % 2 === 0 ? -100 : 100,
            opacity: 0,
            rotation: i % 2 === 0 ? -5 : 5,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Анимация для преимуществ
    gsap.utils.toArray('.advantage-cards__item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 80,
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'back.out(1.4)'
        });
    });

    // Анимация для этапов работы
    gsap.utils.toArray('.step').forEach((step, i) => {
        gsap.from(step, {
            scrollTrigger: {
                trigger: step,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            y: 80,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out'
        });

        // Анимация для номера этапа
        const stepNumber = step.querySelector('.step__number');
        if (stepNumber) {
            gsap.from(stepNumber, {
                scrollTrigger: {
                    trigger: step,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0,
                rotation: 360,
                duration: 0.7,
                delay: i * 0.1 + 0.2,
                ease: 'back.out(1.7)'
            });
        }
    });

    // Анимация для отзывов
    gsap.utils.toArray('.review').forEach((review, i) => {
        gsap.from(review, {
            scrollTrigger: {
                trigger: review,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            rotationY: 90,
            duration: 0.9,
            delay: i * 0.15,
            ease: 'power2.out'
        });
    });

    // Анимация для портфолио
    gsap.utils.toArray('.portfolio__item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            scale: 0,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.08,
            ease: 'back.out(1.7)'
        });
    });

    // Анимация заголовков секций
    gsap.utils.toArray('.services__title, .advantages-cards__title, .steps__title, .portfolio__title, .reviews__title, .contacts__title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Параллакс для Hero фона
    gsap.to('.hero__bg', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 200,
        scale: 1.2,
        ease: 'none'
    });
}

// =============================================================================
// 5. PARTICLE BACKGROUND - Частицы на фоне
// =============================================================================
class ParticleBackground {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        
        this.init();
    }

    init() {
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        
        this.container.style.position = 'relative';
        this.container.insertBefore(this.canvas, this.container.firstChild);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 140, 0, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        // Рисуем линии между близкими частицами
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(255, 140, 0, ${0.2 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// =============================================================================
// 6. MAGNETIC BUTTONS - Магнитный эффект для кнопок
// =============================================================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.hero__button, .header__button, .request__button, .modal__button');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// =============================================================================
// 7. PULSING CTA BUTTON - Пульсирующая кнопка призыва к действию
// =============================================================================
function initPulsingCTA() {
    const ctaButtons = document.querySelectorAll('.header__button, #openCallModal');
    
    ctaButtons.forEach(button => {
        gsap.to(button, {
            boxShadow: '0 0 30px rgba(255, 140, 0, 0.8), 0 0 60px rgba(255, 140, 0, 0.4)',
            scale: 1.05,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    });
}

// =============================================================================
// 8. HERO TEXT TYPING EFFECT - Эффект печатной машинки для Hero
// =============================================================================
function initHeroTypingEffect() {
    const heroTitle = document.querySelector('.hero__title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '3px solid #ff8c00';
    
    let charIndex = 0;
    
    function type() {
        if (charIndex < originalText.length) {
            heroTitle.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(type, 80);
        } else {
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 500);
        }
    }
    
    // Запускаем через небольшую задержку после загрузки
    setTimeout(type, 500);
}

// =============================================================================
// 9. 3D TILT EFFECT - 3D наклон для карточек
// =============================================================================
function init3DTilt() {
    const cards = document.querySelectorAll('.service, .advantage-cards__item, .review, .portfolio__item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// =============================================================================
// 10. CONFETTI EFFECT - Конфетти при отправке формы
// =============================================================================
class ConfettiEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.confetti = [];
        this.confettiCount = 150;
        this.gravity = 0.5;
        this.terminalVelocity = 5;
        this.drag = 0.075;
    }

    create() {
        // Создаем canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 99999;
        `;
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Создаем частицы конфетти
        for (let i = 0; i < this.confettiCount; i++) {
            this.confetti.push({
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                x: Math.random() * this.canvas.width,
                y: -20,
                diameter: Math.random() * 10 + 5,
                tilt: Math.random() * 10 - 10,
                tiltAngleIncrement: Math.random() * 0.07 + 0.05,
                tiltAngle: 0,
                particleSpeed: Math.random() * 10 + 5,
                velocityX: Math.random() * 4 - 2
            });
        }
        
        this.animate();
        
        // Удаляем через 5 секунд
        setTimeout(() => {
            this.canvas.remove();
        }, 5000);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.confetti.forEach((particle, index) => {
            particle.tiltAngle += particle.tiltAngleIncrement;
            particle.y += (Math.cos(particle.tiltAngle) + particle.diameter + particle.particleSpeed) * 0.5;
            particle.x += Math.sin(particle.tiltAngle);
            particle.tilt = Math.sin(particle.tiltAngle) * 15;
            
            if (particle.y > this.canvas.height) {
                this.confetti.splice(index, 1);
            }
            
            this.ctx.beginPath();
            this.ctx.lineWidth = particle.diameter;
            this.ctx.strokeStyle = particle.color;
            this.ctx.moveTo(particle.x + particle.tilt + particle.diameter / 4, particle.y);
            this.ctx.lineTo(particle.x + particle.tilt, particle.y + particle.tilt + particle.diameter / 4);
            this.ctx.stroke();
        });
        
        if (this.confetti.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// =============================================================================
// ИНИЦИАЛИЗАЦИЯ ВСЕХ ЭФФЕКТОВ
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация продвинутых анимаций...');
    
    // Проверяем, что это не мобильное устройство для некоторых эффектов
    const isMobile = window.innerWidth <= 768;
    
    // 1. Cursor Trail (только для десктопа) - ОТКЛЮЧЕНО
    // if (!isMobile) {
    //     new CursorTrail();
    //     console.log('✓ Cursor Trail активирован');
    // }
    console.log('⚠️ Cursor Trail отключен');
    
    // 2. GSAP Scroll Animations
    initGSAPScrollAnimations();
    console.log('✓ GSAP Scroll Animations активированы');
    
    // 3. Text Scramble для заголовков секций
    const sectionTitles = document.querySelectorAll('.services__title, .advantages-cards__title, .steps__title');
    sectionTitles.forEach(title => {
        const scramble = new TextScramble(title);
        const originalText = title.textContent;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scramble.setText(originalText);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(title);
    });
    console.log('✓ Text Scramble активирован');
    
    // 4. SVG Morphing
    initSVGMorphing();
    console.log('✓ SVG Morphing активирован');
    
    // 5. Particle Background для секций
    setTimeout(() => {
        const contactsSection = document.querySelector('.contacts');
        if (contactsSection) {
            contactsSection.id = 'contacts-particles';
            new ParticleBackground('contacts-particles');
            console.log('✓ Particle Background активирован');
        }
    }, 1000);
    
    // 6. Magnetic Buttons (только для десктопа)
    if (!isMobile) {
        initMagneticButtons();
        console.log('✓ Magnetic Buttons активированы');
    }
    
    // 7. Pulsing CTA
    initPulsingCTA();
    console.log('✓ Pulsing CTA активирован');
    
    // 8. Hero Typing Effect
    // initHeroTypingEffect(); // Закомментировано, т.к. может конфликтовать с существующим текстом
    
    // 9. 3D Tilt (только для десктопа)
    if (!isMobile) {
        init3DTilt();
        console.log('✓ 3D Tilt активирован');
    }
    
    // 10. Confetti при успешной отправке формы
    const forms = document.querySelectorAll('#requestForm, #callForm');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            setTimeout(() => {
                const confetti = new ConfettiEffect();
                confetti.create();
                console.log('🎉 Confetti запущено!');
            }, 500);
        });
    });
    console.log('✓ Confetti Effect настроен');
    
    console.log('✨ Все продвинутые анимации успешно инициализированы!');
});

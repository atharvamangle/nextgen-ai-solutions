/* script.js - Dynamic interactivity for NextGen AI Solutions */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Preloader ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 500); // Small delay for visual pleasure
    });
    
    // Fallback if load event already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 500);
    }
  }

  // --- 2. Initialize Lucide Icons ---
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- 3. Interactive Hero Canvas Particles ---
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = {
      x: null,
      y: null,
      radius: 150
    };

    // Resize canvas
    function setCanvasSize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', () => {
      setCanvasSize();
      initParticles();
    });

    // Track mouse
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle class
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Bounce off canvas edges
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;

        // Interaction with mouse
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            // Push away
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = forceDirectionX * force * 2;
            const directionY = forceDirectionY * force * 2;
            
            this.x -= directionX;
            this.y -= directionY;
          }
        }

        this.draw();
      }
    }

    // Populate particles
    function initParticles() {
      particlesArray = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 9000);
      const colors = ['rgba(6, 182, 212, 0.45)', 'rgba(139, 92, 246, 0.4)', 'rgba(236, 72, 153, 0.35)'];
      
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = colors[Math.floor(Math.random() * colors.length)];
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    // Link particles with lines
    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 110) {
            opacityValue = 1 - (distance / 110);
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    initParticles();
    animate();
  }

  // --- 4. Sticky Header & Active Nav Links ---
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Sticky Nav background change
    if (window.scrollY > 50) {
      header.classList.add('glass-nav', 'py-3', 'shadow-lg');
      header.classList.remove('py-5', 'bg-transparent');
    } else {
      header.classList.remove('glass-nav', 'py-3', 'shadow-lg');
      header.classList.add('py-5', 'bg-transparent');
    }

    // Active nav link highlight
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120; // offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active', 'text-cyan-400');
      link.classList.add('text-gray-300');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active', 'text-cyan-400');
        link.classList.remove('text-gray-300');
      }
    });
  });

  // --- 5. Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('translate-x-0');
      if (isOpen) {
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('translate-x-full');
        // Reset burger icon states
        mobileMenuBtn.querySelector('.icon-menu').classList.remove('hidden');
        mobileMenuBtn.querySelector('.icon-close').classList.add('hidden');
      } else {
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        // Toggle burger icon states
        mobileMenuBtn.querySelector('.icon-menu').classList.add('hidden');
        mobileMenuBtn.querySelector('.icon-close').classList.remove('hidden');
      }
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        mobileMenu.classList.remove('translate-x-0');
        mobileMenuBtn.querySelector('.icon-menu').classList.remove('hidden');
        mobileMenuBtn.querySelector('.icon-close').classList.add('hidden');
      });
    });
  }

  // --- 6. Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- 7. Stats Counter Animation ---
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statsSection && statNumbers.length > 0) {
    let started = false;

    const startCounting = (entries, observer) => {
      const [entry] = entries;
      if (entry.isIntersecting && !started) {
        started = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1800; // 1.8 seconds total
          const increment = target / (duration / 16); // ~60fps
          
          const updateCounter = () => {
            count += increment;
            if (count < target) {
              stat.innerText = Math.ceil(count) + suffix;
              requestAnimationFrame(updateCounter);
            } else {
              stat.innerText = target + suffix;
            }
          };
          updateCounter();
        });
        observer.unobserve(statsSection);
      }
    };

    const statsObserver = new IntersectionObserver(startCounting, {
      threshold: 0.2
    });
    statsObserver.observe(statsSection);
  }

  // --- 8. Testimonials Interactive Slider ---
  const testCards = document.querySelectorAll('.testimonial-card');
  const testDots = document.querySelectorAll('.testimonial-dot');
  let currentTestIndex = 0;
  let testInterval;

  function showTestimonial(index) {
    testCards.forEach((card, idx) => {
      card.classList.add('hidden', 'opacity-0', 'scale-95');
      card.classList.remove('block', 'opacity-100', 'scale-100');
      testDots[idx].classList.remove('bg-cyan-400', 'w-8');
      testDots[idx].classList.add('bg-gray-600', 'w-3');
    });

    testCards[index].classList.remove('hidden');
    // Simple micro-delay to let the display block resolve before opacity transition
    setTimeout(() => {
      testCards[index].classList.remove('opacity-0', 'scale-95');
      testCards[index].classList.add('opacity-100', 'scale-100');
    }, 20);

    testDots[index].classList.add('bg-cyan-400', 'w-8');
    testDots[index].classList.remove('bg-gray-600', 'w-3');
    currentTestIndex = index;
  }

  if (testCards.length > 0 && testDots.length > 0) {
    testDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        clearInterval(testInterval);
        showTestimonial(idx);
        startAutoTestimonial();
      });
    });

    function startAutoTestimonial() {
      testInterval = setInterval(() => {
        let nextIndex = (currentTestIndex + 1) % testCards.length;
        showTestimonial(nextIndex);
      }, 6000);
    }

    // Initialize first testimonial
    showTestimonial(0);
    startAutoTestimonial();
  }

  // --- 9. Interactive Contact Form ---
  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close');

  if (contactForm && successModal) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Loading State in Button
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Designing response...
      `;

      // Simulate API response delay
      setTimeout(() => {
        // Reset Button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Show Success Modal with scale animation
        successModal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        successModal.classList.add('flex', 'opacity-100');
        
        // Clear Inputs
        contactForm.reset();
      }, 1500);
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        successModal.classList.remove('flex', 'opacity-100');
        successModal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
      });
    }

    // Close modal on escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !successModal.classList.contains('hidden')) {
        successModal.classList.remove('flex', 'opacity-100');
        successModal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
      }
    });
  }

  // --- 10. Scroll to Top Button ---
  const scrollToTopBtn = document.getElementById('scroll-top-btn');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollToTopBtn.classList.remove('opacity-0', 'translate-y-8', 'pointer-events-none');
        scrollToTopBtn.classList.add('opacity-100', 'translate-y-0');
      } else {
        scrollToTopBtn.classList.add('opacity-0', 'translate-y-8', 'pointer-events-none');
        scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');
      }
    });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

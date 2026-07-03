/* script.js - Purva Dobariya Portfolio Functionality */

document.addEventListener('DOMContentLoaded', () => {
  // --- THEME TOGGLE (LIGHT / DARK) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`Switched to ${newTheme} mode!`, 'success');
  });

  // --- MOBILE NAVIGATION DRAWER ---
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');
  
  mobileNavToggle.addEventListener('click', () => {
    const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
    mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
    mobileNavToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });
  
  // Close menu when links are clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      mobileNavToggle.classList.remove('active');
      navLinksContainer.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileNavToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      mobileNavToggle.classList.remove('active');
      navLinksContainer.classList.remove('active');
    }
  });

  // --- SCROLL ANIMATIONS & INTERSECTION OBSERVER ---
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const scrollObserverOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const elementObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        
        // Trigger specific animations if the container enters the viewport
        if (entry.target.classList.contains('stats-banner') || entry.target.contains(statNumbers[0])) {
          animateStats();
        }
        
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, scrollObserverOptions);
  
  animateElements.forEach(el => elementObserver.observe(el));
  
  // Also observe specific containers for safety
  const skillsSection = document.getElementById('skills');
  if (skillsSection) elementObserver.observe(skillsSection);
  
  const achievementsSection = document.getElementById('achievements');
  if (achievementsSection) elementObserver.observe(achievementsSection);



  // --- STATS COUNTER ANIMATION ---
  let statsAnimated = false;
  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds
      const startTime = performance.now();
      
      function updateCount(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function outQuad
        const easeProgress = progress * (2 - progress);
        const currentCount = Math.floor(easeProgress * target);
        
        stat.textContent = currentCount + '+';
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target + '+';
        }
      }
      
      requestAnimationFrame(updateCount);
    });
  }

  // --- SCROLLSPY (ACTIVE NAV MONITORING) ---
  const sections = document.querySelectorAll('section');
  
  function scrollSpy() {
    const scrollPosition = window.scrollY + 150; // offset
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', scrollSpy);

  // --- 3D TILT EFFECT ON CARDS (MICRO-INTERACTIONS) ---
  const tiltCards = document.querySelectorAll('.cert-card, .dev-graphic-card, .edu-card, .achievement-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation strength (max 10 degrees)
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });
    
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none'; // Instant response on hover
    });
  });

  // Flip cards toggle on mobile click
  const flipCardInners = document.querySelectorAll('.flip-card-inner');
  flipCardInners.forEach(inner => {
    inner.addEventListener('click', () => {
      inner.classList.toggle('flipped');
    });
  });

  // --- CERTIFICATE LIGHTBOX ---
  const certCards = document.querySelectorAll('.cert-card');
  const lightbox = document.getElementById('cert-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxPdf = document.getElementById('lightbox-pdf');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close');

  certCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const imgSrc = card.getAttribute('data-src');
      if (!imgSrc) return;
      
      const titleText = card.querySelector('.cert-title') ? card.querySelector('.cert-title').textContent : card.querySelector('h3').textContent;
      
      if (imgSrc.toLowerCase().endsWith('.pdf')) {
        if (lightboxImg) lightboxImg.style.display = 'none';
        if (lightboxPdf) {
          lightboxPdf.style.display = 'block';
          lightboxPdf.src = imgSrc + '#toolbar=0&navpanes=0&scrollbar=0';
        }
      } else {
        if (lightboxPdf) lightboxPdf.style.display = 'none';
        if (lightboxImg) {
          lightboxImg.style.display = 'block';
          lightboxImg.src = imgSrc;
        }
      }
      
      lightboxTitle.textContent = titleText;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      if (lightboxImg) lightboxImg.src = '';
      if (lightboxPdf) lightboxPdf.src = '';
    }, 300);
  }
  
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });


  // --- CONTACT FORM SUBMISSION WITH EMAIL REDIRECT ---
  const contactForm = document.getElementById('contact-form');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();
    
    if (!name || !email || !subject || !message) {
      showToast('Please fill in all details.', 'error');
      return;
    }
    
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    
    showToast('Sending message...', 'success');

    // Web3Forms Implementation
    const formData = new FormData();
    formData.append("access_key", "fe7125b1-ccd8-47a7-9bc5-f465c33d2843"); 
    formData.append("name", name);
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("message", message);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status === 200) {
        showToast('Message sent successfully!', 'success');
        contactForm.reset();
      } else {
        showToast('Error sending message. Please try again later.', 'error');
      }
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      showToast('Something went wrong! Please try again.', 'error');
    });
  });

  // --- DYNAMIC TOAST ALERT SYSTEM ---
  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    
    // Custom style overrides for toast-error dynamically
    if (type === 'error') {
      toast.style.borderLeftColor = '#EF4444';
    }
    
    const icon = type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check';
    const iconColor = type === 'error' ? '#EF4444' : '#10B981';
    
    toast.innerHTML = `
      <i class="fa-solid ${icon}" style="color: ${iconColor};"></i>
      <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger entrance animation
    setTimeout(() => {
      toast.classList.add('active');
    }, 10);
    
    // Automatic removal
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3500);
  }
});

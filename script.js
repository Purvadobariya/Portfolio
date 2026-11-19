/* ==========================================================================
   script.js - Purva Dobariya Portfolio Interactivity & Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. THEME MANAGEMENT (Dark / Light) ---
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const target = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', target);
      localStorage.setItem('theme', target);
      showToast(`Switched to ${target} mode`);
    });
  }

  // --- 2. HERO TYPING ANIMATION ---
  const typedTextEl = document.getElementById('typed-text');
  const roles = [
    'Python Developer',
    'Backend Engineer',
    'FastAPI & SQL Specialist',
    'Computer Engineering Student'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeRole() {
    if (!typedTextEl) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 95;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400; // Pause before typing next
    }

    setTimeout(typeRole, typeSpeed);
  }

  setTimeout(typeRole, 600);

  // --- 3. SCROLL PROGRESS & BACK TO TOP BUTTON ---
  const scrollProgressBar = document.getElementById('scroll-progress');
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const progressCircle = document.querySelector('.progress-ring-circle');
  const circleRadius = 20;
  const circumference = 2 * Math.PI * circleRadius; // ~125.66

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) : 0;

    // Linear progress bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress * 100}%`;
    }

    // Circular progress button
    if (scrollTopBtn && progressCircle) {
      if (scrollTop > 300) {
        scrollTopBtn.classList.add('visible');
        const offset = circumference - (progress * circumference);
        progressCircle.style.strokeDashoffset = `${offset}`;
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 4. NAVBAR SCROLLSPY ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    root: null,
    threshold: 0,
    rootMargin: '-20% 0px -60% 0px'
  });

  sections.forEach(sec => navObserver.observe(sec));

  // --- 5. MOBILE DRAWER NAVIGATION ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.toggle('open');
      mobileDrawer.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        mobileDrawer.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !mobileDrawer.contains(e.target)) {
        mobileToggle.classList.remove('open');
        mobileDrawer.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 6. SCROLL REVEAL ANIMATIONS (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 7. RESUME MODAL & PRINT/DOWNLOAD ---
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('btn-open-resume');
  const heroResumeTrigger = document.getElementById('hero-resume-trigger');
  const mobileResumeBtn = document.getElementById('mobile-resume-btn');
  const closeResumeBtn = document.getElementById('resume-modal-close');
  const printResumeBtn = document.getElementById('btn-print-resume');

  function openResume() {
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openResumeBtn) openResumeBtn.addEventListener('click', openResume);
  if (heroResumeTrigger) heroResumeTrigger.addEventListener('click', openResume);
  if (mobileResumeBtn) mobileResumeBtn.addEventListener('click', () => {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (mobileToggle) mobileToggle.classList.remove('open');
    openResume();
  });

  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResume();
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --- 8. CERTIFICATE LIGHTBOX VIEWER ---
  const certCards = document.querySelectorAll('.cert-card, .achievement-card');
  const lightbox = document.getElementById('cert-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close');

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-src');
      if (!src) return;

      const titleEl = card.querySelector('.cert-name') || card.querySelector('.ach-title') || card.querySelector('h3');
      const title = titleEl ? titleEl.textContent : 'Certificate';

      if (lightboxImg) lightboxImg.src = src;
      if (lightboxTitle) lightboxTitle.textContent = title;

      if (lightbox) {
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (lightboxImg) lightboxImg.src = '';
    }, 200);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResume();
      closeLightbox();
    }
  });

  // --- 9. ONE-CLICK CLIPBOARD COPY (EMAIL & PHONE) ---
  const copyTriggers = document.querySelectorAll('.copy-trigger');

  copyTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const textToCopy = trigger.getAttribute('data-copy');
      if (!textToCopy) return;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied ${textToCopy} to clipboard!`);
        }).catch(() => {
          // Fallback
        });
      }
    });
  });

  // --- 10. WORKING CONTACT FORM (Web3Forms API) ---
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();
      const submitBtn = document.getElementById('btn-submit-form');

      if (!name || !email || !subject || !message) {
        showToast('Please fill in all form fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';

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
        if (response.status === 200) {
          showToast('Thank you! Your message was sent successfully.');
          contactForm.reset();
        } else {
          showToast('Could not deliver message. Please email directly.', 'error');
        }
      })
      .catch((error) => {
        console.error('Error submitting contact form:', error);
        showToast('Network error. Please email directly.', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      });
    });
  }

  // --- 11. TOAST NOTIFICATION SYSTEM ---
  function showToast(message, type = 'success') {
    const shelf = document.getElementById('toast-shelf');
    if (!shelf) return;

    const item = document.createElement('div');
    item.className = `toast-item ${type === 'error' ? 'error' : ''}`;

    const icon = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
    item.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    shelf.appendChild(item);

    setTimeout(() => {
      item.classList.add('show');
    }, 10);

    setTimeout(() => {
      item.classList.remove('show');
      setTimeout(() => {
        item.remove();
      }, 300);
    }, 3500);
  }

});

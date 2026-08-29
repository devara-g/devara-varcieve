/**
 * DEVARRA.SYS - Main JavaScript
 * Cyberpunk Portfolio Interactions
 */

document.addEventListener("DOMContentLoaded", function () {
  // ========================================
  // Elements
  // ========================================
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const skillBars = document.querySelectorAll(".skill-progress");
  const contactForm = document.getElementById("contactForm");
  const transition = document.getElementById("pageTransition");

  // Vinyl player elements
  const vinylPlayer = document.getElementById("vinylPlayer");
  const vinylDisc = document.getElementById("vinylDisc");
  const vinylTitle = document.getElementById("vinylTitle");
  const vinylIcon = document.getElementById("vinylIcon");
  const bgMusic = document.getElementById("bgMusic");
  const nextMusicBtn = document.getElementById("nextMusicBtn");

  // ========================================
  // VINYL MUSIC PLAYER (Multi-track)
  // ========================================
  const playlist = [
    { name: "Love Me Not — Ravyn Lenae", src: "assets/lovemenot.mp3" },
    { name: "Tante — Unknown", src: "assets/tante.mp3" },
  ];
  let currentTrack = 0;
  let isPlaying = false;

  if (vinylPlayer && bgMusic) {
    function loadTrack(index) {
      currentTrack = index;
      const track = playlist[currentTrack];
      bgMusic.src = track.src;
      if (isPlaying) {
        vinylTitle.textContent = track.name;
        bgMusic.play().catch(() => {});
      }
    }

    function setPlaying(state) {
      isPlaying = state;
      const track = playlist[currentTrack];
      if (state) {
        vinylDisc.classList.add("playing");
        vinylPlayer.classList.add("playing");
        vinylIcon.className = "fas fa-pause";
        vinylTitle.textContent = track.name;
        bgMusic.play().catch(() => {});
      } else {
        vinylDisc.classList.remove("playing");
        vinylPlayer.classList.remove("playing");
        vinylIcon.className = "fas fa-music";
        vinylTitle.textContent = "SONGS — PLAY";
        bgMusic.pause();
      }
    }

    // Toggle play/pause (hanya jika element yang diklik bukan tombol next)
    vinylPlayer.addEventListener("click", (e) => {
      if (e.target.closest("#nextMusicBtn")) return;
      setPlaying(!isPlaying);
    });

    // Next Music
    if (nextMusicBtn) {
      nextMusicBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentTrack = (currentTrack + 1) % playlist.length;
        loadTrack(currentTrack);
        if (!isPlaying) setPlaying(true);
      });
    }

    // Keyboard shortcut: M to toggle music
    document.addEventListener("keydown", (e) => {
      if (e.key === "m" || e.key === "M") {
        if (
          document.activeElement.tagName !== "INPUT" &&
          document.activeElement.tagName !== "TEXTAREA"
        ) {
          setPlaying(!isPlaying);
        }
      }
    });
  }

  // ========================================
  // PAGE TRANSITION – boot-screen → content
  // ========================================
  function bootTransition() {
    // A short delay so the boot screen is visible for impact
    setTimeout(() => {
      if (transition) transition.classList.add("loaded");
      // After overlay fades out, reveal hero content
      setTimeout(() => {
        document.body.classList.add("site-loaded");
        if (transition) {
          transition.style.display = "none";
        }
        // Start typewriter after page appears
        startTypewriter();
      }, 700); // matches CSS transition duration
    }, 900);
  }

  bootTransition();

  // ========================================
  // LOOPING TYPEWRITER for Hero Role
  // ========================================
  const typewriterEl = document.getElementById("typewriterText");
  const phrases = [
    "Backend Architect",
    "API Caller",
    "System Designer",
    "Database Craftsman",
    "Web Developer",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeTimer = null;

  function startTypewriter() {
    if (!typewriterEl) return;
    typeLoop();
  }

  function typeLoop() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typewriterEl.textContent = current.substring(0, charIndex);

    let speed = isDeleting ? 55 : 95;

    if (!isDeleting && charIndex === current.length) {
      // Pause at full word
      speed = 1600;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }

    typeTimer = setTimeout(typeLoop, speed);
  }

  // ========================================
  // Hamburger Menu Toggle
  // ========================================
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "";
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  mobileMenu.addEventListener("click", function (e) {
    if (e.target === mobileMenu) {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // ========================================
  // Navbar Scroll Effect
  // ========================================
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // ========================================
  // Smooth Scroll for Navigation Links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    });
  });

  // ========================================
  // IntersectionObserver – Scroll Reveal
  // ========================================
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children within groups
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, Number(delay));
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  // Apply reveal classes + stagger delays automatically
  const revealSelectors = [
    ".about-card",
    ".tech-item",
    ".project-card",
    ".social-link",
    ".skill-item",
    ".section-title",
    ".about-text",
    ".contact-text",
    ".projects-subtitle",
  ];

  revealSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, idx) => {
      el.classList.add("reveal");
      el.dataset.delay = idx * 80;
      revealObserver.observe(el);
    });
  });

  // Skill bars observer
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute("data-width");
          entry.target.style.width = width + "%";
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));

  // ========================================
  // Contact Form Handling
  // ========================================
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector(".form-submit");
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> TRANSMITTING...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> DATA TRANSMITTED!';
        submitBtn.style.background = "var(--green)";
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // ========================================
  // Glitch Effect for Hero Name
  // ========================================
  function glitchEffect() {
    const nameSolid = document.querySelector(".name-solid");
    if (!nameSolid) return;

    const originalText = nameSolid.textContent;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    let iterations = 0;

    const interval = setInterval(() => {
      nameSolid.textContent = originalText
        .split("")
        .map((char, index) => {
          if (index < iterations) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iterations >= originalText.length) {
        clearInterval(interval);
        nameSolid.textContent = originalText;
      }
      iterations += 1 / 3;
    }, 30);
  }

  // Trigger glitch after boot transition completes
  setTimeout(glitchEffect, 1200);

  // ========================================
  // Parallax – Hero Glow follows cursor
  // ========================================
  const heroGlow = document.querySelector(".hero-glow");

  if (heroGlow && !window.matchMedia("(pointer: coarse)").matches) {
    document.addEventListener("mousemove", function (e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      heroGlow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  }

  // ========================================
  // Hero Image – 3D Mouse Parallax Tilt
  // ========================================
  const heroImageContainer = document.querySelector(".image-container");
  const heroImageFrame = document.querySelector(".image-frame");
  const heroImageGlow = document.querySelector(".image-overlay");

  if (heroImageContainer && !window.matchMedia("(pointer: coarse)").matches) {
    let tiltRaf = null;
    let currentRotX = 0,
      currentRotY = 0;
    let targetRotX = 0,
      targetRotY = 0;

    // Smooth spring interpolation
    function lerpTilt() {
      currentRotX += (targetRotX - currentRotX) * 0.1;
      currentRotY += (targetRotY - currentRotY) * 0.1;

      heroImageContainer.style.transform = `perspective(900px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg) scale(1.04)`;

      // Moving border glow to follow mouse direction
      if (heroImageFrame) {
        const gx = 50 + currentRotY * 2.5;
        const gy = 50 - currentRotX * 2.5;
        heroImageFrame.style.boxShadow = `0 0 0 2px var(--cyan),
                     ${currentRotY * -1}px ${currentRotX}px 40px rgba(0,212,255,0.35),
                     inset 0 0 60px rgba(0,212,255,0.06)`;
        if (heroImageGlow) {
          heroImageGlow.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(0,212,255,0.18) 0%, transparent 70%)`;
        }
      }

      // Keep animating if not settled
      if (
        Math.abs(targetRotX - currentRotX) > 0.01 ||
        Math.abs(targetRotY - currentRotY) > 0.01
      ) {
        tiltRaf = requestAnimationFrame(lerpTilt);
      } else {
        tiltRaf = null;
      }
    }

    heroImageContainer.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Max ±15 degrees
      targetRotX = ((y - cy) / cy) * -12;
      targetRotY = ((x - cx) / cx) * 15;

      if (!tiltRaf) tiltRaf = requestAnimationFrame(lerpTilt);
    });

    heroImageContainer.addEventListener("mouseleave", function () {
      // Spring back to zero
      targetRotX = 0;
      targetRotY = 0;
      if (!tiltRaf) tiltRaf = requestAnimationFrame(lerpTilt);

      setTimeout(() => {
        if (heroImageFrame) heroImageFrame.style.boxShadow = "";
        if (heroImageGlow) heroImageGlow.style.background = "";
      }, 500);
    });
  }

  // ========================================
  // Tech Icons Hover Effect
  // ========================================
  document.querySelectorAll(".tech-item").forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.03)";
    });
    item.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });

  // ========================================
  // Project Cards 3D Tilt Effect
  // ========================================
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });

  // ========================================
  // Console Easter Egg
  // ========================================
  console.log(
    "%c DEVARRA.SYS ",
    "background: #00d4ff; color: #0a0a0a; font-size: 20px; font-weight: bold; padding: 10px;",
  );
  console.log(
    "%c System Online - Welcome to my portfolio! ",
    "color: #00d4ff; font-size: 14px;",
  );
  console.log(
    "%c Looking for a backend developer? Let's connect! ",
    "color: #00ff88; font-size: 12px;",
  );
});

// ========================================
// Mark page as loaded
// ========================================
window.addEventListener("load", function () {
  document.body.classList.add("loaded");
});

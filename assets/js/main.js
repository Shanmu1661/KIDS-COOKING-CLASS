/**
 * Little Chefs Academy - Main JavaScript
 * Version: 1.0.0
 * Features: Dark/Light Mode, RTL Toggle, Form Validation, Interactive Filters,
 * Animated Counters, Cook-Along Timer, Toast Notification System & Skeleton Loaders
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. THEME SWITCHER (DARK / LIGHT / SYSTEM PREFERENCE)
  // -------------------------------------------------------------------------
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('littleChefsTheme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('littleChefsTheme', theme);

    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'fa-solid fa-sun';
          icon.style.color = '#FBBF24';
          btn.setAttribute('aria-label', 'Switch to light mode');
          btn.title = 'Switch to light mode';
        } else {
          icon.className = 'fa-solid fa-moon';
          icon.style.color = '';
          btn.setAttribute('aria-label', 'Switch to dark mode');
          btn.title = 'Switch to dark mode';
        }
      }
    });
  }

  // Initialize theme
  if (storedTheme) {
    applyTheme(storedTheme);
  } else if (systemPrefersDark.matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  // Listen for system theme changes
  systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('littleChefsTheme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Toggle button click
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      const icon = btn.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(0.7) rotate(90deg)';
        setTimeout(() => {
          icon.style.transform = '';
        }, 200);
      }
      
      applyTheme(newTheme);
      showToast(
        newTheme === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated',
        `Theme switched to ${newTheme} mode for optimal reading comfort.`,
        'info'
      );
    });
  });

  // -------------------------------------------------------------------------
  // 2. RTL (RIGHT-TO-LEFT) TOGGLE
  // -------------------------------------------------------------------------
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const storedDir = localStorage.getItem('littleChefsDir') || 'ltr';

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('littleChefsDir', dir);

    rtlToggleBtns.forEach(btn => {
      const textSpan = btn.querySelector('.rtl-text');
      if (textSpan) {
        textSpan.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
    });
  }

  applyDirection(storedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      showToast(
        newDir === 'rtl' ? '🌐 RTL Mode Enabled' : '🌐 LTR Mode Restored',
        `Layout direction updated to ${newDir.toUpperCase()}. Fully styled for Arabic and Hebrew text.`,
        'info'
      );
    });
  });

  // -------------------------------------------------------------------------


  // -------------------------------------------------------------------------
  // 4. HEADER STICKY & SCROLL EFFECTS
  // -------------------------------------------------------------------------
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Auto-close mobile navbar menu on navigation link click
  const navCollapses = document.querySelectorAll('.navbar-collapse');
  navCollapses.forEach(navCollapse => {
    const navLinks = navCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992 && navCollapse.classList.contains('show')) {
          if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse, { toggle: false });
            bsCollapse.hide();
          }
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 5. TOAST NOTIFICATION UTILITY
  // -------------------------------------------------------------------------
  let toastContainer = document.querySelector('.toast-container-custom');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container-custom';
    document.body.appendChild(toastContainer);
  }

  window.showToast = function(title, message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast-custom ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');

    let iconClass = 'fa-circle-info text-primary';
    if (type === 'success') iconClass = 'fa-circle-check text-success';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation text-warning';
    if (type === 'error') iconClass = 'fa-circle-xmark text-danger';

    toast.innerHTML = `
      <div class="fs-4"><i class="fa-solid ${iconClass}"></i></div>
      <div class="flex-grow-1">
        <h6 class="mb-1 font-heading fw-bold">${title}</h6>
        <p class="mb-0 text-muted small">${message}</p>
      </div>
      <button type="button" class="btn-close ms-2" aria-label="Close"></button>
    `;

    toastContainer.appendChild(toast);

    // Trigger enter animation
    setTimeout(() => toast.classList.add('show'), 50);

    const closeBtn = toast.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    const autoDismiss = setTimeout(() => removeToast(toast), duration);

    function removeToast(elem) {
      clearTimeout(autoDismiss);
      elem.classList.remove('show');
      setTimeout(() => elem.remove(), 400);
    }
  };

  // -------------------------------------------------------------------------
  // 6. CLIENT-SIDE FORM VALIDATION ENGINE
  // -------------------------------------------------------------------------
  const forms = document.querySelectorAll('.needs-validation-custom');

  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, select, textarea');

    // Realtime field validation on blur and input
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid-custom')) {
          validateField(input);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        showToast('Form Incomplete', 'Please check highlighted fields and try again.', 'error');
        return;
      }

      // Submit state animation
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Submitting...`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
        form.reset();
        inputs.forEach(inp => inp.classList.remove('is-valid-custom'));

        const successModal = document.getElementById('successModal');
        if (successModal && typeof bootstrap !== 'undefined') {
          const bsModal = new bootstrap.Modal(successModal);
          bsModal.show();
        } else {
          showToast('Success!', 'Thank you! Your submission has been received. Our team will reach out shortly.', 'success');
        }
      }, 1200);
    });
  });

  function validateField(input) {
    if (input.disabled || input.type === 'hidden') return true;

    let valid = true;
    const value = input.value.trim();

    if (input.hasAttribute('required') && !value) {
      valid = false;
    } else if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      valid = emailRegex.test(value);
    } else if (input.type === 'tel' && value) {
      const phoneRegex = /^[0-9\-\+\(\)\s]{7,20}$/;
      valid = phoneRegex.test(value);
    } else if (input.minLength && value.length < input.minLength) {
      valid = false;
    }

    if (valid) {
      input.classList.remove('is-invalid-custom');
      input.classList.add('is-valid-custom');
    } else {
      input.classList.remove('is-valid-custom');
      input.classList.add('is-invalid-custom');
    }

    return valid;
  }

  // -------------------------------------------------------------------------
  // 7. PASSWORD STRENGTH METER
  // -------------------------------------------------------------------------
  const passwordInputs = document.querySelectorAll('.password-meter-input');
  passwordInputs.forEach(input => {
    const parent = input.closest('.password-group');
    if (!parent) return;
    const fill = parent.querySelector('.password-strength-fill');

    input.addEventListener('input', () => {
      const val = input.value;
      let score = 0;
      if (val.length >= 8) score += 25;
      if (/[A-Z]/.test(val)) score += 25;
      if (/[0-9]/.test(val)) score += 25;
      if (/[^A-Za-z0-9]/.test(val)) score += 25;

      if (fill) {
        fill.style.width = `${score}%`;
        if (score <= 25) fill.style.backgroundColor = '#EF4444';
        else if (score <= 50) fill.style.backgroundColor = '#F59E0B';
        else if (score <= 75) fill.style.backgroundColor = '#3B82F6';
        else fill.style.backgroundColor = '#10B981';
      }
    });
  });

  // Password visibility toggle
  const pwdToggles = document.querySelectorAll('.toggle-password-visibility');
  pwdToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetId = toggle.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      if (targetInput) {
        const isPassword = targetInput.type === 'password';
        targetInput.type = isPassword ? 'text' : 'password';
        const icon = toggle.querySelector('i');
        if (icon) {
          icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // 8. ANIMATED RUNNING NUMBER COUNTERS (SMOOTH EASING & INTERSECTION OBSERVER)
  // -------------------------------------------------------------------------
  const counterElements = document.querySelectorAll('.stat-counter');

  function runCounter(elem) {
    if (elem.dataset.counterStarted === 'true') return;
    elem.dataset.counterStarted = 'true';

    const target = parseFloat(elem.getAttribute('data-target')) || 0;
    const prefix = elem.getAttribute('data-prefix') || '';
    const suffix = elem.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds smooth running animation
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic function: decelerates gracefully as it reaches target
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);

      elem.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        elem.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
      }
    }

    requestAnimationFrame(step);
  }

  if (counterElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      counterElements.forEach(el => counterObserver.observe(el));
    } else {
      counterElements.forEach(el => runCounter(el));
    }
  }

  // -------------------------------------------------------------------------
  // 9. INTERACTIVE CLASS & GALLERY FILTERING
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const filterItems = document.querySelectorAll('.filter-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary-custom'));
      btn.classList.add('active', 'btn-primary-custom');

      const filterValue = btn.getAttribute('data-filter');

      filterItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue || item.getAttribute('data-age') === filterValue) {
          item.style.display = '';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 10. INTERACTIVE RECIPE COOK-ALONG TIMER
  // -------------------------------------------------------------------------
  const timerDisplay = document.getElementById('recipeTimerDisplay');
  const timerStartBtn = document.getElementById('timerStartBtn');
  const timerPauseBtn = document.getElementById('timerPauseBtn');
  const timerResetBtn = document.getElementById('timerResetBtn');

  if (timerDisplay && timerStartBtn) {
    let timerDuration = parseInt(timerDisplay.getAttribute('data-minutes') || '15', 10) * 60;
    let remainingTime = timerDuration;
    let timerInterval = null;

    function formatTime(seconds) {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    timerDisplay.textContent = formatTime(remainingTime);

    timerStartBtn.addEventListener('click', () => {
      if (timerInterval) return;
      timerStartBtn.classList.add('d-none');
      timerPauseBtn.classList.remove('d-none');

      timerInterval = setInterval(() => {
        if (remainingTime > 0) {
          remainingTime--;
          timerDisplay.textContent = formatTime(remainingTime);
        } else {
          clearInterval(timerInterval);
          timerInterval = null;
          showToast('🔔 Timer Finished!', 'Baking step complete! Smells delicious in here!', 'success', 6000);
          timerStartBtn.classList.remove('d-none');
          timerPauseBtn.classList.add('d-none');
        }
      }, 1000);
    });

    if (timerPauseBtn) {
      timerPauseBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        timerStartBtn.classList.remove('d-none');
        timerPauseBtn.classList.add('d-none');
      });
    }

    if (timerResetBtn) {
      timerResetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        remainingTime = timerDuration;
        timerDisplay.textContent = formatTime(remainingTime);
        timerStartBtn.classList.remove('d-none');
        if (timerPauseBtn) timerPauseBtn.classList.add('d-none');
      });
    }
  }

  // -------------------------------------------------------------------------
  // 11. SKELETON LOADER DEMO TOGGLE
  // -------------------------------------------------------------------------
  const skeletonToggleBtn = document.getElementById('skeletonToggleBtn');
  if (skeletonToggleBtn) {
    skeletonToggleBtn.addEventListener('click', () => {
      const liveCards = document.querySelectorAll('.live-content-box');
      const skeletonBoxes = document.querySelectorAll('.skeleton-demo-box');

      skeletonBoxes.forEach(el => el.classList.toggle('d-none'));
      liveCards.forEach(el => el.classList.toggle('d-none'));

      const isSkeleton = !skeletonBoxes[0]?.classList.contains('d-none');
      showToast('Skeleton Loader Preview', isSkeleton ? 'Displaying skeleton placeholder states' : 'Restored live cards', 'info');
    });
  }

  // -------------------------------------------------------------------------
  // 12. NEWSLETTER SUBSCRIPTION FORM HANDLER
  // -------------------------------------------------------------------------
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(nForm => {
    nForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = nForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast('🎉 Welcome to the Chef Club!', `Check ${emailInput.value} for your free 10-Recipe Kid Starter Pack.`, 'success');
        nForm.reset();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 13. SERVICES INTERACTIVE PROGRAM ADVISOR / MATCHER
  // -------------------------------------------------------------------------
  const ageBtns = document.querySelectorAll('#advisorAgeGroup .advisor-choice-btn');
  const goalBtns = document.querySelectorAll('#advisorGoalGroup .advisor-choice-btn');
  const advisorTag = document.getElementById('advisorTag');
  const advisorTitle = document.getElementById('advisorTitle');
  const advisorDesc = document.getElementById('advisorDesc');
  const advisorPrice = document.getElementById('advisorPrice');
  const advisorLink = document.getElementById('advisorLink');

  if (ageBtns.length > 0 && goalBtns.length > 0 && advisorTitle) {
    let selectedAge = '3-5';
    let selectedGoal = 'weekly';

    const recommendations = {
      '3-5': {
        weekly: {
          tag: 'Parent & Me Sensory',
          title: 'Tiny Tasters Kitchen Discovery',
          desc: 'Gentle sensory exploration with fruit shapes, mini flatbreads, soft dough kneading, and cheerful kitchen safety songs.',
          price: '$45 / session',
          link: 'classes.html#tiny-tasters'
        },
        camp: {
          tag: 'Half-Day Summer Mini',
          title: 'Little Sprout Sensory Camp (Ages 3–5)',
          desc: 'Morning 9am–12pm tactile food fun with storybook recipes, fruit smoothies, and vegetable stamp crafting.',
          price: '$240 / week',
          link: 'camps.html'
        },
        party: {
          tag: 'Toddler Celebration',
          title: 'Tiny Chef Cupcake & Cookie Bash',
          desc: 'Fun sensory cookie decorating party with pre-baked treats, colorful sprinkles, and chef hats for all little guests.',
          price: 'From $380',
          link: 'contact.html?service=party'
        },
        workshop: {
          tag: 'Weekend Workshop',
          title: 'Parent & Me Sweet Pretzel Rolling',
          desc: 'Spend a joyful Sunday morning rolling soft cinnamon-sugar pretzels side-by-side with your toddler.',
          price: '$50 / pair',
          link: 'classes.html#tiny-tasters'
        }
      },
      '6-9': {
        weekly: {
          tag: 'Fundamental Skills',
          title: 'Little Chefs Foundation Class',
          desc: 'Individual workstation cooking where kids learn safe knife pinch-grips, measure wet & dry ingredients, and prepare balanced meals.',
          price: '$55 / session',
          link: 'classes.html#little-chefs'
        },
        camp: {
          tag: '5-Day Camp',
          title: 'Global Gastronomy Summer Camp',
          desc: 'Passport to 5 international cuisines! Homemade pasta, Mexican tacos, and Japanese hand rolls with daily hot lunch.',
          price: '$395 / week',
          link: 'camps.html'
        },
        party: {
          tag: 'Birthday Party',
          title: 'Handmade Pizza & Cupcake Wars',
          desc: 'Kids stretch their own pizza dough, ladle scratch marinara, grate cheese, and compete in a frosting face-off!',
          price: 'From $450',
          link: 'contact.html?service=party'
        },
        workshop: {
          tag: 'Weekend Workshop',
          title: 'Handmade Gnocchi & Marinara Lab',
          desc: 'Boiling, ricing, and shaping pillowy potato gnocchi with classic slow-simmered tomato basil sauce.',
          price: '$65 / chef',
          link: 'classes.html'
        }
      },
      '10-13': {
        weekly: {
          tag: 'Intermediate Cooking',
          title: 'Junior Gourmet Sauté & Emulsions',
          desc: 'Master induction sautéing, culinary chemistry, vinaigrette emulsions, yeast sandwich breads, and professional plating.',
          price: '$65 / session',
          link: 'classes.html#junior-gourmet'
        },
        camp: {
          tag: '5-Day Camp',
          title: 'Junior Iron Chef Mystery Basket Camp',
          desc: 'High-energy team cooking challenges with daily secret ingredients, time management, and presentation judging.',
          price: '$420 / week',
          link: 'camps.html'
        },
        party: {
          tag: 'Birthday Party',
          title: 'Gourmet Slider & Macaron Party',
          desc: 'Teens and tweens craft custom mini burgers on brioche buns, truffle parmesan fries, and pipe colorful macarons.',
          price: 'From $495',
          link: 'contact.html?service=party'
        },
        workshop: {
          tag: 'Weekend Workshop',
          title: 'French Boulangerie & Pastry Intensive',
          desc: '3-hour masterclass mastering flaky tart dough, laminated butter blocks, and chocolate choux puffs.',
          price: '$75 / chef',
          link: 'classes.html'
        }
      },
      '14-17': {
        weekly: {
          tag: 'Advanced Academy',
          title: 'Teen Masterclass Culinary Track',
          desc: 'Professional culinary pre-college preparation: mother sauces, precise julienne & brunoise cuts, handmade pasta, and sushi craftsmanship.',
          price: '$75 / session',
          link: 'classes.html#teen-master'
        },
        camp: {
          tag: '5-Day Camp',
          title: 'Master Pastry & Baking Arts Camp',
          desc: 'Full-day pastry immersion covering croissants, multi-layer tortes, mirror glazes, and artisan sourdough starters.',
          price: '$440 / week',
          link: 'camps.html'
        },
        party: {
          tag: 'Private Hire',
          title: 'Teen Chef Kitchen Takeover',
          desc: 'Exclusive evening studio rental for friends to prepare a 3-course sit-down gourmet dinner under private chef mentorship.',
          price: 'From $550',
          link: 'contact.html?service=party'
        },
        workshop: {
          tag: 'Weekend Workshop',
          title: 'Asian Street Food & Dumpling Masterclass',
          desc: 'Folding soup dumplings, balancing umami dipping broths, and hand-pulling savory noodles.',
          price: '$75 / chef',
          link: 'classes.html'
        }
      }
    };

    function updateAdvisor() {
      const match = recommendations[selectedAge]?.[selectedGoal];
      if (match) {
        advisorTag.textContent = match.tag;
        advisorTitle.textContent = match.title;
        advisorDesc.textContent = match.desc;
        advisorPrice.textContent = match.price;
        advisorLink.href = match.link;
      }
    }

    ageBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        ageBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedAge = btn.dataset.age;
        updateAdvisor();
      });
    });

    goalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        goalBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedGoal = btn.dataset.goal;
        updateAdvisor();
      });
    });
  }


  // -------------------------------------------------------------------------
  // 14. INTERACTIVE PARENT PORTAL SIMULATOR (DASHBOARD PREVIEW SECTION)
  // -------------------------------------------------------------------------
  const portalChildTabs = document.querySelectorAll('.portal-child-tab');
  const portalCardBody = document.getElementById('portalCardBody');

  if (portalChildTabs.length > 0 && portalCardBody) {
    const portalData = {
      leo: {
        name: 'Leo Miller',
        age: 8,
        group: 'Little Chefs (Ages 6-9)',
        avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=150&q=80',
        allergyBadge: '<span class="text-danger fw-bold"><i class="fa-solid fa-shield-virus me-1"></i>Peanut-Free Sanitized Station</span>',
        passType: 'Semester Pass Active',
        passBadgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
        milestoneTitle: 'Level 2: Junior Sous Chef',
        milestoneHours: '18 / 25 Hours',
        milestonePercent: 72,
        milestoneAward: 'Silver Chef Whisk Award',
        nextClassTitle: 'Handmade Gnocchi & Fresh Herb Pesto',
        nextClassDate: 'Sat, Oct 24 • 10:00 AM – 12:30 PM',
        nextClassChef: 'Chef Marco Rossi',
        nextClassStation: 'Station Island #3 (Nut-Free Zone)',
        badges: [
          { icon: 'fa-shield-heart', text: 'Knife Safety 101' },
          { icon: 'fa-wheat-awn', text: 'Dough Roller' },
          { icon: 'fa-carrot', text: 'Rainbow Salad Star' }
        ],
        photosCount: 18,
        photoThumbs: [
          { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', caption: 'Rolling dough' },
          { img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80', caption: 'Sauce tasting' },
          { img: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=300&q=80', caption: 'Fresh pizza' }
        ]
      },
      mia: {
        name: 'Mia Miller',
        age: 11,
        group: 'Junior Gourmet (Ages 10-13)',
        avatar: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=150&q=80',
        allergyBadge: '<span class="text-emerald-600 fw-bold"><i class="fa-solid fa-circle-check me-1"></i>No Allergies • All Stations Cleared</span>',
        passType: 'Masterclass Pass Active',
        passBadgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
        milestoneTitle: 'Level 3: Pastry Artisan',
        milestoneHours: '26 / 35 Hours',
        milestonePercent: 74,
        milestoneAward: 'Gold Chef Toque Award',
        nextClassTitle: 'French Macarons & Buttercream Piping',
        nextClassDate: 'Sun, Oct 25 • 01:30 PM – 04:00 PM',
        nextClassChef: 'Chef Maya Vance',
        nextClassStation: 'Pastry Lab #1 (Marble Counter)',
        badges: [
          { icon: 'fa-bowl-rice', text: 'Fresh Pasta Artisan' },
          { icon: 'fa-fire-burner', text: 'Sauté Captain' },
          { icon: 'fa-cake-candles', text: 'Pastry Puffer' },
          { icon: 'fa-flask', text: 'Kitchen Chemist' }
        ],
        photosCount: 24,
        photoThumbs: [
          { img: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?auto=format&fit=crop&w=300&q=80', caption: 'Triple berry tart' },
          { img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80', caption: 'French macarons' },
          { img: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=300&q=80', caption: 'Piping skills' }
        ]
      }
    };

    function renderPortalChild(key) {
      const data = portalData[key];
      if (!data) return;

      portalCardBody.style.opacity = '0';
      portalCardBody.style.transform = 'translateY(6px)';

      setTimeout(() => {
        portalCardBody.innerHTML = `
          <!-- Child Profile Bar -->
          <div class="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
            <div class="d-flex align-items-center gap-3">
              <div class="position-relative">
                <img src="${data.avatar}" alt="${data.name}" class="w-14 h-14 rounded-full border-3 border-orange-500 object-cover shadow-sm">
                <span class="position-absolute bottom-0 end-0 p-1 bg-emerald-500 border border-white rounded-full" title="Active Account"></span>
              </div>
              <div>
                <h5 class="mb-0 fw-bold font-heading text-slate-900 dark:text-white">${data.name} <span class="text-muted fs-6 fw-normal">(${data.group})</span></h5>
                <div class="d-flex align-items-center gap-2 mt-1">
                  <small class="d-flex align-items-center gap-1">${data.allergyBadge}</small>
                </div>
              </div>
            </div>
            <span class="badge ${data.passBadgeClass} px-3 py-1.5 rounded-pill font-heading text-xs">
              ${data.passType}
            </span>
          </div>

          <!-- Milestone Progress Bar -->
          <div class="p-3 bg-subtle rounded-2xl mb-3 border">
            <div class="d-flex justify-content-between align-items-center mb-1 text-xs">
              <span class="fw-bold font-heading text-slate-900 dark:text-white"><i class="fa-solid fa-award text-warning me-1"></i> ${data.milestoneTitle}</span>
              <span class="text-muted fw-bold">${data.milestoneHours}</span>
            </div>
            <div class="milestone-progress mb-1.5">
              <div class="milestone-progress-bar" style="width: ${data.milestonePercent}%;"></div>
            </div>
            <div class="d-flex justify-content-between text-xs text-muted">
              <span>Target: <strong>${data.milestoneAward}</strong></span>
              <span class="text-primary fw-bold">${data.milestonePercent}% Completed</span>
            </div>
          </div>

          <!-- Upcoming Session Ticket Card -->
          <div class="session-ticket-box p-3.5 bg-subtle rounded-2xl mb-3 border">
            <div class="d-flex justify-content-between align-items-center text-xs mb-1.5">
              <span class="text-muted fw-semibold"><i class="fa-regular fa-calendar-check text-primary me-1"></i> Upcoming Session:</span>
              <span class="fw-bold text-primary"><i class="fa-regular fa-clock me-1"></i> ${data.nextClassDate}</span>
            </div>
            <h5 class="font-heading fw-bold mb-1.5 text-slate-900 dark:text-white fs-6">${data.nextClassTitle}</h5>
            <div class="d-flex flex-wrap align-items-center gap-2 text-muted small text-xs">
              <span><i class="fa-solid fa-user-tie text-secondary me-1"></i> ${data.nextClassChef}</span>
              <span>•</span>
              <span class="text-warning fw-bold"><i class="fa-solid fa-kitchen-set me-1"></i> ${data.nextClassStation}</span>
            </div>
          </div>

          <!-- Badges Earned Strip -->
          <div class="mb-3">
            <label class="text-xs fw-bold text-muted d-block mb-1.5">Earned Skill Badges:</label>
            <div class="d-flex flex-wrap gap-1.5">
              ${data.badges.map(b => `<span class="badge-mini-pill"><i class="fa-solid ${b.icon} text-primary"></i> ${b.text}</span>`).join('')}
            </div>
          </div>

          <!-- Photo Strip Preview -->
          <div class="pt-3 border-top d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
              <div class="d-flex -space-x-2 overflow-hidden">
                ${data.photoThumbs.map(p => `<img class="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="${p.img}" alt="${p.caption}">`).join('')}
              </div>
              <span class="text-xs text-muted"><strong>${data.photosCount} High-Res Photos</strong> in Gallery</span>
            </div>
            <a href="dashboard.html" class="fw-bold text-primary hover:underline text-xs d-inline-flex align-items-center gap-1">
              Access Portal <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        `;
        portalCardBody.style.opacity = '1';
        portalCardBody.style.transform = 'translateY(0)';
      }, 150);
    }

    portalChildTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        portalChildTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderPortalChild(tab.getAttribute('data-child'));
      });
    });

    // Render default Leo child
    renderPortalChild('leo');
  }

});


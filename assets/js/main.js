/**
 * Little Chefs Academy - Main JavaScript
 * Version: 1.0.0
 * Features: Dark/Light Mode, RTL Toggle, Form Validation, Interactive Filters,
 * Animated Counters, Cook-Along Timer, Toast Notification System & Skeleton Loaders
 */

document.addEventListener('DOMContentLoaded', () => {

  // Desktop Hover for Home Dropdown to sync aria-expanded
  const homeDropdownItems = document.querySelectorAll('.main-header .nav-item.dropdown');
  homeDropdownItems.forEach(item => {
    const toggle = item.querySelector('.dropdown-toggle');
    if (toggle) {
      item.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 992) {
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
      item.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 992) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

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
  // 6. CLIENT-SIDE FORM VALIDATION ENGINE & STRICT INPUT FORMATTING
  // -------------------------------------------------------------------------
  const forms = document.querySelectorAll('.needs-validation-custom');

  // Strict Phone Auto-Formatter Helper: (XXX) XXX-XXXX
  function formatPhoneNumber(val) {
    const digits = val.replace(/\D/g, '').substring(0, 10);
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  // Attach live formatters & strict character filters
  function attachStrictInputFormatters() {
    // 1. Phone number inputs: auto-formatting + block non-digits
    const phoneInputs = document.querySelectorAll('input[type="tel"], #contactPhone');
    phoneInputs.forEach(phone => {
      phone.addEventListener('input', () => {
        phone.value = formatPhoneNumber(phone.value);
        if (phone.classList.contains('is-valid-custom') || phone.classList.contains('is-invalid-custom')) {
          validateField(phone);
        }
      });
      phone.addEventListener('keydown', (e) => {
        // Allow navigation, delete, copy/paste
        if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key) ||
            (e.ctrlKey || e.metaKey)) {
          return;
        }
        // Block non-digits
        if (!/^[0-9]$/.test(e.key)) {
          e.preventDefault();
        }
      });
    });

    // 2. Name inputs: letters, spaces, hyphens, and apostrophes only (strictly forbid numbers & symbols)
    const nameInputs = document.querySelectorAll('#contactName, input[name="parentName"], input[autocomplete="name"]');
    nameInputs.forEach(nameInput => {
      nameInput.addEventListener('keydown', (e) => {
        if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End', 'Enter'].includes(e.key) ||
            (e.ctrlKey || e.metaKey)) {
          return;
        }
        // Block numbers
        if (/^[0-9]$/.test(e.key)) {
          e.preventDefault();
        }
      });
      nameInput.addEventListener('input', () => {
        // Strip any pasted digits immediately
        if (/\d/.test(nameInput.value)) {
          nameInput.value = nameInput.value.replace(/\d/g, '');
        }
        if (nameInput.classList.contains('is-valid-custom') || nameInput.classList.contains('is-invalid-custom')) {
          validateField(nameInput);
        }
      });
    });
  }

  attachStrictInputFormatters();

  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, select, textarea');

    // Realtime field validation on blur and input
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        // Validate on blur if non-empty or required
        if (input.value.trim() !== '' || input.hasAttribute('required')) {
          validateField(input);
        }
      });
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid-custom') || input.classList.contains('is-valid-custom')) {
          validateField(input);
        }
      });
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => validateField(input));
      }
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
        showToast('Form Incomplete', 'Please check highlighted fields and ensure correct formatting.', 'error');
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
        inputs.forEach(inp => {
          inp.classList.remove('is-valid-custom');
          inp.classList.remove('is-invalid-custom');
        });

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

    // 0. Non-required empty fields should remain clean/neutral
    if (!input.hasAttribute('required') && !value) {
      input.classList.remove('is-invalid-custom');
      input.classList.remove('is-valid-custom');
      return true;
    }

    // 1. Required check
    if (input.hasAttribute('required') && !value) {
      valid = false;
    } 
    // 2. Parent Name: letters, spaces, hyphens, and apostrophes only (strictly forbid digits and symbols)
    else if (input.id === 'contactName' || input.name === 'parentName' || (input.type === 'text' && input.autocomplete === 'name')) {
      const nameRegex = /^[A-Za-zÀ-ÿ\s'-]{2,50}$/;
      valid = nameRegex.test(value) && !/\d/.test(value) && ((value.match(/[A-Za-zÀ-ÿ]/g) || []).length >= 2);
    }
    // 3. Email Address: valid RFC format
    else if (input.type === 'email' || input.id === 'contactEmail') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      valid = emailRegex.test(value);
    }
    // 4. Phone Number: 10 digits formatted (XXX) XXX-XXXX or standard digits
    else if (input.type === 'tel' || input.id === 'contactPhone') {
      const digits = value.replace(/\D/g, '');
      const phoneRegex = /^(\+?1\s?)?\(?[0-9]{3}\)?[\s\.-]?[0-9]{3}[\s\.-]?[0-9]{4}$/;
      valid = (digits.length === 10 && phoneRegex.test(value)) || (digits.length >= 10 && digits.length <= 15);
    }
    // 5. Select dropdown check
    else if (input.tagName === 'SELECT') {
      valid = value !== '' && value !== null;
    }
    // 6. Textarea / minlength check
    else if (input.minLength && value.length < input.minLength) {
      valid = false;
    }
    // 7. Pattern attribute fallback
    else if (input.hasAttribute('pattern') && value) {
      try {
        const patternRegex = new RegExp(input.getAttribute('pattern'));
        valid = patternRegex.test(value);
      } catch (e) {
        // Fallback
      }
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
  // 6B. AUTH FORMS VALIDATION (LOGIN & REGISTER PAGES)
  // -------------------------------------------------------------------------
  function initAuthFormsValidation() {
    const loginForm = document.getElementById('parentLoginForm');
    const registerForm = document.getElementById('parentRegisterForm');
    const sendResetBtn = document.getElementById('sendResetCodeBtn');
    const resetEmailInput = document.getElementById('resetEmailInput');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[A-Za-zÀ-ÿ\s'-]{2,50}$/;

    function formatPhoneNumber(val) {
      const digits = val.replace(/\D/g, '').substring(0, 10);
      if (digits.length === 0) return '';
      if (digits.length <= 3) return `(${digits}`;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }

    function setAuthFieldState(input, isValid, feedbackMsg) {
      if (!input) return isValid;
      const group = input.closest('.login-input-group');
      const container = input.closest('.auth-field-wrapper') || (group ? group.parentElement : null) || input.parentElement;
      const feedback = container ? container.querySelector('.login-invalid-feedback') : null;

      if (!isValid) {
        if (group) {
          group.classList.remove('is-valid-group');
          group.classList.add('is-invalid-group');
        }
        input.classList.remove('is-valid-custom');
        input.classList.add('is-invalid-custom');
        input.setAttribute('aria-invalid', 'true');
        if (feedback) {
          if (feedbackMsg) feedback.textContent = feedbackMsg;
          feedback.classList.add('is-feedback-visible');
        }
      } else {
        if (group) {
          group.classList.remove('is-invalid-group');
          group.classList.add('is-valid-group');
        }
        input.classList.remove('is-invalid-custom');
        input.classList.add('is-valid-custom');
        input.setAttribute('aria-invalid', 'false');
        if (feedback) {
          feedback.classList.remove('is-feedback-visible');
        }
      }
      return isValid;
    }

    function clearAuthFieldState(input) {
      if (!input) return;
      const group = input.closest('.login-input-group');
      if (group) {
        group.classList.remove('is-valid-group', 'is-invalid-group');
      }
      input.classList.remove('is-valid-custom', 'is-invalid-custom');
      input.removeAttribute('aria-invalid');
      const container = input.closest('.auth-field-wrapper') || (group ? group.parentElement : null) || input.parentElement;
      const feedback = container ? container.querySelector('.login-invalid-feedback') : null;
      if (feedback) feedback.classList.remove('is-feedback-visible');
    }

    // 1. SIGN IN FORM VALIDATION
    if (loginForm) {
      const loginEmail = document.getElementById('loginEmail');
      const loginPassword = document.getElementById('loginPassword');

      function validateLoginEmail(showError = true) {
        if (!loginEmail) return true;
        const val = loginEmail.value.trim();
        if (!val) {
          return showError ? setAuthFieldState(loginEmail, false, 'Email address is required.') : false;
        }
        const valid = emailRegex.test(val);
        return showError ? setAuthFieldState(loginEmail, valid, 'Please enter a valid email address (e.g. name@example.com).') : valid;
      }

      function validateLoginPassword(showError = true) {
        if (!loginPassword) return true;
        const val = loginPassword.value;
        if (!val) {
          return showError ? setAuthFieldState(loginPassword, false, 'Password is required.') : false;
        }
        const valid = val.length >= 6;
        return showError ? setAuthFieldState(loginPassword, valid, 'Password must be at least 6 characters long.') : valid;
      }

      if (loginEmail) {
        loginEmail.addEventListener('blur', () => {
          if (loginEmail.value.trim()) validateLoginEmail(true);
        });
        loginEmail.addEventListener('input', () => {
          const group = loginEmail.closest('.login-input-group');
          if (group && (group.classList.contains('is-invalid-group') || group.classList.contains('is-valid-group'))) {
            validateLoginEmail(true);
          }
        });
      }

      if (loginPassword) {
        loginPassword.addEventListener('blur', () => {
          if (loginPassword.value) validateLoginPassword(true);
        });
        loginPassword.addEventListener('input', () => {
          const group = loginPassword.closest('.login-input-group');
          if (group && (group.classList.contains('is-invalid-group') || group.classList.contains('is-valid-group'))) {
            validateLoginPassword(true);
          }
        });
      }

      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailValid = validateLoginEmail(true);
        const passValid = validateLoginPassword(true);

        if (!emailValid || !passValid) {
          showToast('Sign In Incomplete', 'Please check highlighted fields and ensure correct credentials.', 'error');
          if (!emailValid && loginEmail) loginEmail.focus();
          else if (!passValid && loginPassword) loginPassword.focus();
          return;
        }

        const submitBtn = document.getElementById('submitLoginBtn');
        const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Signing In...`;
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
          }
          const emailVal = loginEmail.value.trim();
          showToast('Welcome Back!', `Signed in successfully as ${emailVal}. Loading dashboard...`, 'success');
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 600);
        }, 800);
      });
    }

    // 2. CREATE ACCOUNT FORM VALIDATION
    if (registerForm) {
      const regParentName = document.getElementById('regParentName');
      const regEmail = document.getElementById('regEmail');
      const regPhone = document.getElementById('regPhone');
      const regPassword = document.getElementById('regPassword');
      const regConfirmPassword = document.getElementById('regConfirmPassword');
      const termsCheck = document.getElementById('termsCheck');
      const regPasswordMeter = document.getElementById('regPasswordMeter');
      const regPasswordFill = document.getElementById('regPasswordFill');
      const regPasswordStrengthText = document.getElementById('regPasswordStrengthText');

      function validateRegName(showError = true) {
        if (!regParentName) return true;
        const val = regParentName.value.trim();
        if (!val) {
          return showError ? setAuthFieldState(regParentName, false, 'Please provide your full name.') : false;
        }
        if (/\d/.test(val)) {
          return showError ? setAuthFieldState(regParentName, false, 'Full name cannot contain numbers.') : false;
        }
        if (!nameRegex.test(val)) {
          return showError ? setAuthFieldState(regParentName, false, 'Letters, spaces, hyphens and apostrophes only.') : false;
        }
        const words = val.split(/\s+/).filter(w => w.length > 0);
        if (words.length < 2) {
          return showError ? setAuthFieldState(regParentName, false, 'Please enter both first and last name (e.g. Sarah Miller).') : false;
        }
        return showError ? setAuthFieldState(regParentName, true) : true;
      }

      function validateRegEmail(showError = true) {
        if (!regEmail) return true;
        const val = regEmail.value.trim();
        if (!val) {
          return showError ? setAuthFieldState(regEmail, false, 'Please provide your email address.') : false;
        }
        const valid = emailRegex.test(val);
        return showError ? setAuthFieldState(regEmail, valid, 'Please enter a valid email address (e.g. name@example.com).') : valid;
      }

      function validateRegPhone(showError = true) {
        if (!regPhone) return true;
        const val = regPhone.value.trim();
        const digits = val.replace(/\D/g, '');
        if (!val) {
          return showError ? setAuthFieldState(regPhone, false, 'Please provide an emergency contact phone number.') : false;
        }
        const valid = digits.length === 10;
        return showError ? setAuthFieldState(regPhone, valid, 'Please provide a valid 10-digit phone number (e.g. (512) 555-0199).') : valid;
      }

      function updatePasswordMeter(val) {
        if (!regPasswordMeter || !regPasswordFill || !regPasswordStrengthText) return;
        if (!val) {
          regPasswordMeter.classList.add('d-none');
          regPasswordStrengthText.classList.add('d-none');
          return;
        }
        regPasswordMeter.classList.remove('d-none');
        regPasswordStrengthText.classList.remove('d-none');

        let strength = 0;
        if (val.length >= 8) strength += 30;
        if (val.length >= 12) strength += 10;
        if (/[A-Z]/.test(val)) strength += 20;
        if (/[0-9]/.test(val)) strength += 20;
        if (/[^A-Za-z0-9]/.test(val)) strength += 20;

        regPasswordFill.style.width = strength + '%';
        if (strength < 40) {
          regPasswordFill.style.backgroundColor = '#EF4444';
          regPasswordStrengthText.textContent = 'Weak';
          regPasswordStrengthText.style.color = '#EF4444';
        } else if (strength < 70) {
          regPasswordFill.style.backgroundColor = '#F59E0B';
          regPasswordStrengthText.textContent = 'Medium';
          regPasswordStrengthText.style.color = '#F59E0B';
        } else {
          regPasswordFill.style.backgroundColor = '#10B981';
          regPasswordStrengthText.textContent = 'Strong';
          regPasswordStrengthText.style.color = '#10B981';
        }
      }

      function validateRegPassword(showError = true) {
        if (!regPassword) return true;
        const val = regPassword.value;
        if (!val) {
          return showError ? setAuthFieldState(regPassword, false, 'Please create a secure password.') : false;
        }
        if (val.length < 8) {
          return showError ? setAuthFieldState(regPassword, false, 'Password must be at least 8 characters long.') : false;
        }
        const hasLetter = /[A-Za-z]/.test(val);
        const hasNumber = /[0-9]/.test(val);
        if (!hasLetter || !hasNumber) {
          return showError ? setAuthFieldState(regPassword, false, 'Password must include both letters and numbers.') : false;
        }
        return showError ? setAuthFieldState(regPassword, true) : true;
      }

      function validateRegConfirmPassword(showError = true) {
        if (!regConfirmPassword) return true;
        const passVal = regPassword ? regPassword.value : '';
        const confirmVal = regConfirmPassword.value;
        if (!confirmVal) {
          return showError ? setAuthFieldState(regConfirmPassword, false, 'Please confirm your password.') : false;
        }
        if (confirmVal !== passVal) {
          return showError ? setAuthFieldState(regConfirmPassword, false, 'Passwords do not match.') : false;
        }
        return showError ? setAuthFieldState(regConfirmPassword, true) : true;
      }

      function validateTerms(showError = true) {
        if (!termsCheck) return true;
        const valid = termsCheck.checked;
        const feedback = document.getElementById('termsFeedback');
        if (!valid) {
          termsCheck.classList.add('is-invalid-custom');
          if (feedback && showError) feedback.classList.add('is-feedback-visible');
        } else {
          termsCheck.classList.remove('is-invalid-custom');
          if (feedback) feedback.classList.remove('is-feedback-visible');
        }
        return valid;
      }

      if (regParentName) {
        regParentName.addEventListener('blur', () => {
          if (regParentName.value.trim()) validateRegName(true);
        });
        regParentName.addEventListener('input', () => {
          const group = regParentName.closest('.login-input-group');
          if (group && (group.classList.contains('is-invalid-group') || group.classList.contains('is-valid-group'))) {
            validateRegName(true);
          }
        });
      }

      if (regEmail) {
        regEmail.addEventListener('blur', () => {
          if (regEmail.value.trim()) validateRegEmail(true);
        });
        regEmail.addEventListener('input', () => {
          const group = regEmail.closest('.login-input-group');
          if (group && (group.classList.contains('is-invalid-group') || group.classList.contains('is-valid-group'))) {
            validateRegEmail(true);
          }
        });
      }

      if (regPhone) {
        regPhone.addEventListener('input', () => {
          regPhone.value = formatPhoneNumber(regPhone.value);
          const group = regPhone.closest('.login-input-group');
          if (group && (group.classList.contains('is-invalid-group') || group.classList.contains('is-valid-group'))) {
            validateRegPhone(true);
          }
        });
        regPhone.addEventListener('blur', () => {
          if (regPhone.value.trim()) validateRegPhone(true);
        });
      }

      if (regPassword) {
        regPassword.addEventListener('input', () => {
          updatePasswordMeter(regPassword.value);
          const group = regPassword.closest('.login-input-group');
          if (group && (group.classList.contains('is-invalid-group') || group.classList.contains('is-valid-group'))) {
            validateRegPassword(true);
          }
          if (regConfirmPassword && regConfirmPassword.value) {
            validateRegConfirmPassword(true);
          }
        });
        regPassword.addEventListener('blur', () => {
          if (regPassword.value) validateRegPassword(true);
        });
      }

      if (regConfirmPassword) {
        regConfirmPassword.addEventListener('input', () => {
          const group = regConfirmPassword.closest('.login-input-group');
          if (group && (group.classList.contains('is-invalid-group') || group.classList.contains('is-valid-group'))) {
            validateRegConfirmPassword(true);
          }
        });
        regConfirmPassword.addEventListener('blur', () => {
          if (regConfirmPassword.value) validateRegConfirmPassword(true);
        });
      }

      if (termsCheck) {
        termsCheck.addEventListener('change', () => validateTerms(true));
      }

      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameOk = validateRegName(true);
        const emailOk = validateRegEmail(true);
        const phoneOk = validateRegPhone(true);
        const passOk = validateRegPassword(true);
        const confirmOk = validateRegConfirmPassword(true);
        const termsOk = validateTerms(true);

        if (!nameOk || !emailOk || !phoneOk || !passOk || !confirmOk || !termsOk) {
          showToast('Registration Incomplete', 'Please check highlighted fields and ensure correct formatting.', 'error');
          if (!nameOk && regParentName) regParentName.focus();
          else if (!emailOk && regEmail) regEmail.focus();
          else if (!phoneOk && regPhone) regPhone.focus();
          else if (!passOk && regPassword) regPassword.focus();
          else if (!confirmOk && regConfirmPassword) regConfirmPassword.focus();
          else if (!termsOk && termsCheck) termsCheck.focus();
          return;
        }

        const submitBtn = document.getElementById('submitRegisterBtn');
        const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Creating Account...`;
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
          }
          const nameVal = regParentName.value.trim();
          showToast('Account Created!', `Welcome to Little Chefs Academy, ${nameVal}! Redirecting to dashboard...`, 'success');
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 600);
        }, 900);
      });
    }

    // 3. RESET PASSWORD MODAL VALIDATION
    if (sendResetBtn && resetEmailInput) {
      sendResetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const val = resetEmailInput.value.trim();
        const valid = emailRegex.test(val);
        setAuthFieldState(resetEmailInput, valid, 'Please enter a valid email address.');
        if (!valid) {
          resetEmailInput.focus();
          showToast('Invalid Email', 'Please enter a valid email address to receive password reset instructions.', 'error');
          return;
        }

        const modalEl = document.getElementById('forgotPasswordModal');
        if (modalEl && typeof bootstrap !== 'undefined') {
          const bsModal = bootstrap.Modal.getInstance(modalEl);
          if (bsModal) bsModal.hide();
        }
        showToast('Reset Link Sent', `Password recovery link has been emailed to ${val}.`, 'info');
        resetEmailInput.value = '';
        clearAuthFieldState(resetEmailInput);
      });
    }
  }

  initAuthFormsValidation();

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
  const advisorAgeBadge = document.getElementById('advisorAgeBadge');
  const advisorTitle = document.getElementById('advisorTitle');
  const advisorDesc = document.getElementById('advisorDesc');
  const advisorPrice = document.getElementById('advisorPrice');
  const advisorLink = document.getElementById('advisorLink');
  const advisorImg = document.getElementById('advisorImg');
  const advisorIcon = document.getElementById('advisorIcon');
  const advisorIconWrapper = document.getElementById('advisorIconWrapper');
  const advisorMeta1 = document.getElementById('advisorMeta1');
  const advisorMeta2 = document.getElementById('advisorMeta2');
  const advisorMeta3 = document.getElementById('advisorMeta3');
  const advisorBtnText = document.getElementById('advisorBtnText');

  if (ageBtns.length > 0 && goalBtns.length > 0 && advisorTitle) {
    let selectedAge = '3-5';
    let selectedGoal = 'weekly';

    const recommendations = {
      '3-5': {
        weekly: {
          tag: 'Parent & Me Sensory',
          ageBadge: 'Ages 3–5',
          title: 'Tiny Tasters Kitchen Discovery',
          desc: 'Gentle sensory exploration with fruit shapes, mini flatbreads, soft dough kneading, and cheerful kitchen safety songs.',
          price: '$45 / session',
          link: 'classes.html#tiny-tasters',
          img: 'https://images.unsplash.com/photo-1556911073-38141963c9e0?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-seedling',
          iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
          meta: [
            'Parent & Me side-by-side workstation',
            '100% no-heat sensory play & measuring fun',
            'Take-home child-crafted tasting portions'
          ],
          btnText: 'Book Tiny Tasters Program'
        },
        camp: {
          tag: 'Half-Day Summer Mini',
          ageBadge: 'Ages 3–5',
          title: 'Little Sprout Sensory Camp',
          desc: 'Morning 9am–12pm tactile food fun with storybook recipes, fruit smoothies, and vegetable stamp crafting.',
          price: '$240 / week',
          link: 'camps.html',
          img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-campground',
          iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
          meta: [
            'Daily 9:00 AM – 12:00 PM half-day track',
            'Storybook culinary theme days & parfaits',
            'All organic ingredients & keepsake mini apron'
          ],
          btnText: 'Explore Sprout Camp'
        },
        party: {
          tag: 'Toddler Celebration',
          ageBadge: 'Ages 3–5',
          title: 'Tiny Chef Cupcake & Cookie Bash',
          desc: 'Fun sensory cookie decorating party with pre-baked treats, colorful sprinkles, and chef hats for all little guests.',
          price: 'From $380',
          link: 'service-birthday-parties.html',
          img: '../assets/images/birthday_cooking_party.jpg',
          icon: 'fa-solid fa-cake-candles',
          iconClass: 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
          meta: [
            '90 min private studio rental with chef host',
            'Rainbow frosting, sprinkles & cookie boxes',
            'Zero cleanup for parents + custom chef hats'
          ],
          btnText: 'Plan Toddler Party'
        },
        workshop: {
          tag: 'Weekend Workshop',
          ageBadge: 'Ages 3–5',
          title: 'Parent & Me Sweet Pretzel Rolling',
          desc: 'Spend a joyful Sunday morning rolling soft cinnamon-sugar pretzels side-by-side with your toddler.',
          price: '$50 / duo',
          link: 'classes.html#tiny-tasters',
          img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-cookie-bite',
          iconClass: 'bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400',
          meta: [
            '60-minute weekend parent-child duo session',
            'Yeast dough shaping & warm butter dipping',
            'Box of 6 warm pretzels to share at home'
          ],
          btnText: 'Reserve Workshop Spot'
        }
      },
      '6-9': {
        weekly: {
          tag: 'Fundamental Skills',
          ageBadge: 'Ages 6–9',
          title: 'Little Chefs Foundation Class',
          desc: 'Individual workstation cooking where kids learn safe knife pinch-grips, measure wet & dry ingredients, and prepare balanced meals.',
          price: '$55 / session',
          link: 'service-weekly-classes.html',
          img: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-kitchen-set',
          iconClass: 'bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400',
          meta: [
            'Child-safe nylon blade knife mastery',
            'Fresh handmade pasta & skillet quesadillas',
            'Individual induction cooktop per child'
          ],
          btnText: 'Enroll in Little Chefs'
        },
        camp: {
          tag: '5-Day Immersion',
          ageBadge: 'Ages 6–9',
          title: 'Global Gastronomy Summer Camp',
          desc: 'Passport to 5 international cuisines! Homemade pasta, Mexican street tacos, and Japanese sushi rolls with daily hot lunch.',
          price: '$395 / week',
          link: 'service-summer-camps.html',
          img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-earth-americas',
          iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
          meta: [
            'Full-day (9am–3pm) or half-day options',
            'Daily hot 2-course lunch cooked by campers',
            'Friday Parent Banquet with graduation apron'
          ],
          btnText: 'Explore Summer Camps'
        },
        party: {
          tag: 'Birthday Party',
          ageBadge: 'Ages 6–9',
          title: 'Handmade Pizza & Cupcake Wars',
          desc: 'Kids stretch their own pizza dough, ladle scratch marinara, grate cheese, and compete in a frosting face-off!',
          price: 'From $450',
          link: 'service-birthday-parties.html',
          img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-cake-candles',
          iconClass: 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
          meta: [
            '2 hours exclusive kitchen studio rental',
            'Personal artisan pizza & cupcake piping',
            'Keepsake aprons & complete cleanup included'
          ],
          btnText: 'Book Birthday Party'
        },
        workshop: {
          tag: 'Weekend Workshop',
          ageBadge: 'Ages 6–9',
          title: 'Handmade Gnocchi & Marinara Lab',
          desc: 'Boiling, ricing, and shaping pillowy potato gnocchi with classic slow-simmered tomato basil sauce.',
          price: '$65 / chef',
          link: 'classes.html#little-chefs',
          img: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-utensils',
          iconClass: 'bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400',
          meta: [
            '90-min weekend intensive culinary lab',
            'Wooden gnocchi board shaping technique',
            'Family dinner portion to take home'
          ],
          btnText: 'Reserve Gnocchi Workshop'
        }
      },
      '10-13': {
        weekly: {
          tag: 'Intermediate Academy',
          ageBadge: 'Ages 10–13',
          title: 'Junior Gourmet Sauté & Emulsions',
          desc: 'Master induction sautéing, culinary chemistry, vinaigrette emulsions, yeast sandwich breads, and professional plating.',
          price: '$65 / session',
          link: 'service-weekly-classes.html',
          img: 'https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-fire-burner',
          iconClass: 'bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400',
          meta: [
            'Real chef knife grip & steel honing',
            'Sauce reduction, emulsification & pan searing',
            'Earn Sauté Master digital badges'
          ],
          btnText: 'Join Junior Gourmet'
        },
        camp: {
          tag: 'Challenge Camp',
          ageBadge: 'Ages 10–13',
          title: 'Junior Iron Chef Mystery Basket Camp',
          desc: 'High-energy team cooking challenges with daily secret ingredients, time management, and presentation judging.',
          price: '$420 / week',
          link: 'service-summer-camps.html',
          img: 'https://images.unsplash.com/photo-1556911073-38141963c9e0?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-trophy',
          iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
          meta: [
            'Daily mystery ingredient basket challenge',
            'Recipe formulation & culinary math',
            'Team presentation & taste test showcases'
          ],
          btnText: 'Register for Iron Chef Camp'
        },
        party: {
          tag: 'Tween Celebration',
          ageBadge: 'Ages 10–13',
          title: 'Gourmet Slider & Macaron Party',
          desc: 'Teens and tweens craft custom mini burgers on brioche buns, truffle parmesan fries, and pipe colorful macarons.',
          price: 'From $495',
          link: 'service-birthday-parties.html',
          img: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-burger',
          iconClass: 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
          meta: [
            '2.5 hours private commercial studio access',
            'Artisan burgers, gourmet fries & French macarons',
            'Mocktail mixology toast & celebration aprons'
          ],
          btnText: 'Book Gourmet Party'
        },
        workshop: {
          tag: 'Weekend Workshop',
          ageBadge: 'Ages 10–13',
          title: 'French Boulangerie & Pastry Intensive',
          desc: '3-hour masterclass mastering flaky tart dough, laminated butter blocks, and chocolate choux puffs.',
          price: '$75 / chef',
          link: 'classes.html',
          img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-bread-slice',
          iconClass: 'bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400',
          meta: [
            'Laminated pastry dough & blind baking',
            'Scratch vanilla bean pastry cream',
            'Box of 8 bakery-quality French pastries'
          ],
          btnText: 'Reserve Pastry Workshop'
        }
      },
      '14-17': {
        weekly: {
          tag: 'Advanced Academy',
          ageBadge: 'Ages 14–17',
          title: 'Teen Masterclass Culinary Track',
          desc: 'Professional culinary pre-college preparation: mother sauces, precise julienne & brunoise cuts, handmade pasta, and sushi craftsmanship.',
          price: '$75 / session',
          link: 'service-weekly-classes.html',
          img: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-award',
          iconClass: 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
          meta: [
            'Professional knife skills & station sanitation',
            '5 French mother sauces & reduction chemistry',
            'Portfolio of advanced culinary dishes'
          ],
          btnText: 'Apply for Teen Masterclass'
        },
        camp: {
          tag: '5-Day Immersion',
          ageBadge: 'Ages 14–17',
          title: 'Master Pastry & Baking Arts Camp',
          desc: 'Full-day pastry immersion covering croissants, multi-layer tortes, mirror glazes, and artisan sourdough starters.',
          price: '$440 / week',
          link: 'service-summer-camps.html',
          img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-cake-candles',
          iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
          meta: [
            'Croissant laminating, macarons & mirror glazes',
            'Sourdough starter biology & hearth baking',
            'Industry standard commercial baking tools'
          ],
          btnText: 'Explore Teen Camp'
        },
        party: {
          tag: 'Private Hire',
          ageBadge: 'Ages 14–17',
          title: 'Teen Chef Kitchen Takeover',
          desc: 'Exclusive evening studio rental for friends to prepare a 3-course sit-down gourmet dinner under private chef mentorship.',
          price: 'From $550',
          link: 'service-birthday-parties.html',
          img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-champagne-glasses',
          iconClass: 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
          meta: [
            '3-course sit-down gourmet dinner prepared by teens',
            'Appetizer, handmade entree, & plated dessert',
            'Complete private kitchen studio rental'
          ],
          btnText: 'Book Teen Event'
        },
        workshop: {
          tag: 'Weekend Workshop',
          ageBadge: 'Ages 14–17',
          title: 'Asian Street Food & Dumpling Masterclass',
          desc: 'Folding soup dumplings, balancing umami dipping broths, and hand-pulling savory noodles.',
          price: '$75 / chef',
          link: 'classes.html',
          img: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
          icon: 'fa-solid fa-bowl-food',
          iconClass: 'bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400',
          meta: [
            'Intricate dumpling pleated folds & wrappers',
            'Scratch dashi & spicy chili crisp oil',
            'Multi-course tasting feast & recipe binder'
          ],
          btnText: 'Reserve Dumpling Workshop'
        }
      }
    };

    function updateAdvisor() {
      const match = recommendations[selectedAge]?.[selectedGoal];
      if (match) {
        if (advisorTag) advisorTag.textContent = match.tag;
        if (advisorAgeBadge) advisorAgeBadge.textContent = match.ageBadge || `Ages ${selectedAge}`;
        if (advisorTitle) {
          advisorTitle.textContent = match.title;
          advisorTitle.href = match.link;
        }
        if (advisorDesc) advisorDesc.textContent = match.desc;
        if (advisorPrice) advisorPrice.textContent = match.price;
        if (advisorLink) advisorLink.href = match.link;
        if (advisorImg && match.img) {
          advisorImg.src = match.img;
          advisorImg.alt = match.title;
        }
        if (advisorIcon && match.icon) {
          advisorIcon.className = match.icon;
        }
        if (advisorIconWrapper && match.iconClass) {
          advisorIconWrapper.className = `service-card-icon ${match.iconClass}`;
        }
        if (match.meta) {
          if (advisorMeta1 && match.meta[0]) advisorMeta1.textContent = match.meta[0];
          if (advisorMeta2 && match.meta[1]) advisorMeta2.textContent = match.meta[1];
          if (advisorMeta3 && match.meta[2]) advisorMeta3.textContent = match.meta[2];
        }
        if (advisorBtnText && match.btnText) {
          advisorBtnText.textContent = match.btnText;
        }
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

    // Run initial update to sync all properties on page load
    updateAdvisor();
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

  // -------------------------------------------------------------------------
  // DEDICATED KIDS COOKING VIDEO CONTROLLERS (HOME 1 & HOME 2)
  // -------------------------------------------------------------------------
  function initVideoShowcase(video, options = {}) {
    if (!video) return;

    const container = video.closest('.video-stage') || video.closest('.home2-facility-video-wrapper') || video.parentElement;
    const playPauseBtn = options.playPauseBtn || (container ? container.querySelector('#studioPlayPauseBtn, #home2PlayPauseBtn, #heroPlayPauseBtn, .video-pill-btn') : null);
    const muteBtn = options.muteBtn || (container ? container.querySelector('#studioMuteBtn, #home2MuteBtn, #heroMuteBtn') : null);
    const fullscreenBtn = options.fullscreenBtn || (container ? container.querySelector('#studioFullscreenBtn, #home2FullscreenBtn, #heroFullscreenBtn') : null);
    const sceneText = options.sceneText || (container ? container.querySelector('#videoCurrentSceneText, #home2VideoSceneText, .video-live-pill span:last-child') : null);
    const capsules = container ? container.querySelectorAll('.scene-switcher-capsule .capsule-btn, .hero-video-scenes .scene-pill') : [];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      video.pause();
      if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        playPauseBtn.setAttribute('aria-label', 'Play Video');
      }
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            playPauseBtn.setAttribute('aria-label', 'Play Video');
          }
        });
      }
    }

    // Play/Pause button
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        if (video.paused || video.ended) {
          video.play().then(() => {
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            playPauseBtn.setAttribute('aria-label', 'Pause Video');
          }).catch(() => {});
        } else {
          video.pause();
          playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
          playPauseBtn.setAttribute('aria-label', 'Play Video');
        }
      });
    }

    // Direct click on video to toggle
    video.style.cursor = 'pointer';
    video.addEventListener('click', () => {
      if (video.paused || video.ended) {
        video.play().then(() => {
          if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            playPauseBtn.setAttribute('aria-label', 'Pause Video');
          }
        }).catch(() => {});
      } else {
        video.pause();
        if (playPauseBtn) {
          playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
          playPauseBtn.setAttribute('aria-label', 'Play Video');
        }
      }
    });

    // Mute / Unmute
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        if (video.muted) {
          muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
          muteBtn.setAttribute('aria-label', 'Unmute Sound');
        } else {
          video.volume = 1.0;
          muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
          muteBtn.setAttribute('aria-label', 'Mute Sound');
        }
      });
    }

    // Fullscreen
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        const stage = container || video;
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          if (stage.requestFullscreen) {
            stage.requestFullscreen().catch(() => video.requestFullscreen());
          } else if (video.webkitEnterFullscreen) {
            video.webkitEnterFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });

      document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
          fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
          fullscreenBtn.setAttribute('aria-label', 'Exit Fullscreen');
        } else {
          fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
          fullscreenBtn.setAttribute('aria-label', 'View Fullscreen');
        }
      });
    }

    // Scene Switcher Capsules
    capsules.forEach(capsule => {
      capsule.addEventListener('click', () => {
        capsules.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        capsule.classList.add('active');
        capsule.setAttribute('aria-selected', 'true');

        const videoSrc = capsule.getAttribute('data-video');
        const posterSrc = capsule.getAttribute('data-poster');
        const sceneTitle = capsule.getAttribute('data-title') || 'Kitchen In Action';

        if (videoSrc) {
          video.style.opacity = '0.5';
          video.src = videoSrc;
          if (posterSrc) {
            video.poster = posterSrc;
          }
          video.load();
          video.play().then(() => {
            video.style.opacity = '1';
            if (playPauseBtn) {
              playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
              playPauseBtn.setAttribute('aria-label', 'Pause Video');
            }
          }).catch(() => {
            video.style.opacity = '1';
          });

          if (sceneText) {
            sceneText.innerHTML = `${sceneTitle} &bull; Live Action`;
          }
        }
      });
    });

    // Auto-advance to next video when current scene finishes
    video.addEventListener('ended', () => {
      const capsuleList = Array.from(capsules);
      if (capsuleList.length > 1) {
        const activeIdx = capsuleList.findIndex(c => c.classList.contains('active'));
        const nextIdx = (activeIdx + 1) % capsuleList.length;
        capsuleList[nextIdx].click();
      }
    });

    // Auto-pause when scrolled out of view to preserve device performance
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
            if (playPauseBtn) {
              playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
              playPauseBtn.setAttribute('aria-label', 'Play Video');
            }
          } else if (entry.isIntersecting && video.paused && !prefersReducedMotion) {
            video.play().then(() => {
              if (playPauseBtn) {
                playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                playPauseBtn.setAttribute('aria-label', 'Pause Video');
              }
            }).catch(() => {});
          }
        });
      }, { threshold: 0.25 });

      observer.observe(video);
    }
  }

  // Initialize all video players across Home 1 and Home 2
  const studioCookingVideo = document.getElementById('studioCookingVideo') || document.getElementById('heroCookingVideo');
  if (studioCookingVideo) {
    initVideoShowcase(studioCookingVideo);
  }

  const home2FacilityVideo = document.getElementById('home2FacilityVideo');
  if (home2FacilityVideo) {
    initVideoShowcase(home2FacilityVideo, {
      playPauseBtn: document.getElementById('home2PlayPauseBtn'),
      muteBtn: document.getElementById('home2MuteBtn'),
      fullscreenBtn: document.getElementById('home2FullscreenBtn'),
      sceneText: document.getElementById('home2VideoSceneText')
    });
  }

});


/**
 * Little Chefs Academy - Parent Dashboard JavaScript
 * Features:
 * 1. Child Profile Management (Add/Edit child, dietary restrictions, emergency contacts, culinary badges)
 * 2. Class & Camp Session Enrollment Engine (Child selection, schedule picking, mock Stripe/PayPal checkout)
 * 3. Schedule Tracking & Attendance (Calendar view, filter by child, iCal export simulator, rescheduling)
 * 4. Session Photo Gallery & Lightbox (Download high-res photos, instructor notes, tags)
 * 5. Digital Recipe Vault with print/cook-along view
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // INITIAL MOCK STATE (STORED IN LOCALSTORAGE OR DEFAULT)
  // -------------------------------------------------------------------------
  const defaultChildren = [
    {
      id: 'child-1',
      name: 'Leo Miller',
      age: 8,
      group: 'Little Chefs (Ages 6-9)',
      allergies: ['Peanuts (Severe)', 'Egg Whites (Mild)'],
      badges: ['Knife Safety 101', 'Master Dough Roller', 'Rainbow Salad Star'],
      avatar: 'https://images.unsplash.com/photo-1595454223600-91fb5591ef5d?auto=format&fit=crop&w=200&q=80',
      enrolledSessions: 3,
      attendedHours: 18
    },
    {
      id: 'child-2',
      name: 'Mia Miller',
      age: 11,
      group: 'Junior Gourmet (Ages 10-13)',
      allergies: ['None / No Restrictions'],
      badges: ['Fresh Pasta Artisan', 'Sauté Captain', 'Pastry Puffer', 'Kitchen Chemist'],
      avatar: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=200&q=80',
      enrolledSessions: 4,
      attendedHours: 26
    }
  ];

  const defaultSchedule = [
    {
      id: 'sch-1',
      childId: 'child-1',
      childName: 'Leo Miller',
      title: 'Handmade Gnocchi & Fresh Herb Pesto',
      date: 'Saturday, Oct 24, 2026',
      time: '10:00 AM - 12:30 PM',
      chef: 'Chef Marco Rossi',
      station: 'Kitchen Island #3',
      status: 'Confirmed'
    },
    {
      id: 'sch-2',
      childId: 'child-2',
      childName: 'Mia Miller',
      title: 'French Macarons & Buttercream Piping',
      date: 'Sunday, Oct 25, 2026',
      time: '01:30 PM - 04:00 PM',
      chef: 'Chef Maya Vance',
      station: 'Pastry Lab #1',
      status: 'Confirmed'
    },
    {
      id: 'sch-3',
      childId: 'child-1',
      childName: 'Leo Miller',
      title: 'Halloween Spooky Cupcake Sculpting',
      date: 'Saturday, Oct 31, 2026',
      time: '10:00 AM - 12:30 PM',
      chef: 'Chef Liam Chen',
      station: 'Kitchen Island #2',
      status: 'Upcoming'
    }
  ];

  let children = JSON.parse(localStorage.getItem('littleChefsChildren')) || defaultChildren;
  let schedule = JSON.parse(localStorage.getItem('littleChefsSchedule')) || defaultSchedule;

  function saveState() {
    localStorage.setItem('littleChefsChildren', JSON.stringify(children));
    localStorage.setItem('littleChefsSchedule', JSON.stringify(schedule));
  }

  // -------------------------------------------------------------------------
  // 1. DASHBOARD TAB NAVIGATION
  // -------------------------------------------------------------------------
  const navItems = document.querySelectorAll('.dashboard-nav-item');
  const viewSections = document.querySelectorAll('.dashboard-view');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-target-view');
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      viewSections.forEach(section => {
        if (section.id === targetView) {
          section.classList.remove('d-none');
        } else {
          section.classList.add('d-none');
        }
      });

      // Scroll smoothly to top of dashboard view
      window.scrollTo({ top: 100, behavior: 'smooth' });
    });
  });

  // -------------------------------------------------------------------------
  // 2. RENDER CHILDREN CARDS & PROFILE LIST
  // -------------------------------------------------------------------------
  const childrenContainer = document.getElementById('childrenListContainer');
  const enrollmentChildSelect = document.getElementById('enrollmentChildSelect');

  function renderChildren() {
    if (!childrenContainer) return;

    childrenContainer.innerHTML = '';
    if (enrollmentChildSelect) enrollmentChildSelect.innerHTML = '';

    children.forEach(child => {
      // Add child card in Profiles Tab
      const card = document.createElement('div');
      card.className = 'col-md-6 mb-4';
      card.innerHTML = `
        <div class="custom-card p-4">
          <div class="d-flex align-items-center gap-3 mb-3">
            <img src="${child.avatar}" alt="${child.name}" class="child-avatar-img">
            <div>
              <h5 class="mb-1 font-heading fw-bold">${child.name}</h5>
              <span class="badge badge-pill badge-age">${child.group}</span>
              <p class="text-muted small mb-0 mt-1">Age ${child.age} • ${child.attendedHours} Culinary Hours</p>
            </div>
          </div>
          <div class="mb-3">
            <label class="small text-muted fw-bold d-block mb-1">Dietary & Allergy Alerts:</label>
            <div class="d-flex flex-wrap gap-1">
              ${child.allergies.map(a => `<span class="badge bg-danger-subtle text-danger border border-danger-subtle">${a}</span>`).join('')}
            </div>
          </div>
          <div>
            <label class="small text-muted fw-bold d-block mb-1">Earned Badges (${child.badges.length}):</label>
            <div class="d-flex flex-wrap gap-1">
              ${child.badges.map(b => `<span class="badge badge-pill badge-diet"><i class="fa-solid fa-award me-1"></i>${b}</span>`).join('')}
            </div>
          </div>
          <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
            <button class="btn btn-sm btn-outline-custom edit-child-btn" data-id="${child.id}">
              <i class="fa-solid fa-pen me-1"></i> Edit Details
            </button>
            <button class="btn btn-sm btn-primary-custom quick-enroll-child-btn" data-child-id="${child.id}">
              <i class="fa-solid fa-plus me-1"></i> Enroll in Class
            </button>
          </div>
        </div>
      `;
      childrenContainer.appendChild(card);

      // Populate enrollment dropdown
      if (enrollmentChildSelect) {
        const option = document.createElement('option');
        option.value = child.id;
        option.textContent = `${child.name} (${child.group})`;
        enrollmentChildSelect.appendChild(option);
      }
    });

    // Wire up quick enroll button from card
    document.querySelectorAll('.quick-enroll-child-btn').forEach(b => {
      b.addEventListener('click', () => {
        const cId = b.getAttribute('data-child-id');
        const enrollNavItem = document.querySelector('[data-target-view="viewEnroll"]');
        if (enrollNavItem) enrollNavItem.click();
        if (enrollmentChildSelect) enrollmentChildSelect.value = cId;
      });
    });
  }

  // -------------------------------------------------------------------------
  // 3. ADD NEW CHILD MODAL HANDLER
  // -------------------------------------------------------------------------
  const addChildForm = document.getElementById('addChildForm');
  if (addChildForm) {
    addChildForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('newChildName');
      const ageInput = document.getElementById('newChildAge');
      const allergiesInput = document.getElementById('newChildAllergies');

      const ageNum = parseInt(ageInput.value, 10);
      let groupName = 'Little Chefs (Ages 6-9)';
      if (ageNum < 6) groupName = 'Tiny Tasters (Ages 3-5)';
      else if (ageNum > 13) groupName = 'Teen Masterclass (Ages 14-17)';
      else if (ageNum >= 10) groupName = 'Junior Gourmet (Ages 10-13)';

      const newChild = {
        id: `child-${Date.now()}`,
        name: nameInput.value.trim(),
        age: ageNum,
        group: groupName,
        allergies: allergiesInput.value ? allergiesInput.value.split(',').map(s => s.trim()) : ['None recorded'],
        badges: ['New Chef Welcome Badge'],
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
        enrolledSessions: 0,
        attendedHours: 0
      };

      children.push(newChild);
      saveState();
      renderChildren();
      addChildForm.reset();

      // Close modal
      const modalElem = document.getElementById('addChildModal');
      if (modalElem && typeof bootstrap !== 'undefined') {
        const modalInstance = bootstrap.Modal.getInstance(modalElem);
        if (modalInstance) modalInstance.hide();
      }

      window.showToast('👶 Child Profile Created!', `${newChild.name} is now registered in your Little Chefs family account.`, 'success');
    });
  }

  // -------------------------------------------------------------------------
  // 4. CLASS ENROLLMENT PROCESS (MOCK STRIPE/PAYPAL)
  // -------------------------------------------------------------------------
  const enrollButtons = document.querySelectorAll('.enroll-session-trigger');
  const confirmEnrollModalElem = document.getElementById('confirmEnrollModal');

  enrollButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const classTitle = btn.getAttribute('data-class-title') || 'Culinary Workshop Session';
      const classPrice = btn.getAttribute('data-class-price') || '$55';
      const classDate = btn.getAttribute('data-class-date') || 'Next Available Saturday';
      const classInstructor = btn.getAttribute('data-class-chef') || 'Chef Maya Vance';

      document.getElementById('modalEnrollClassTitle').textContent = classTitle;
      document.getElementById('modalEnrollPrice').textContent = classPrice;
      document.getElementById('modalEnrollDate').textContent = classDate;
      document.getElementById('modalEnrollInstructor').textContent = classInstructor;

      if (confirmEnrollModalElem && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(confirmEnrollModalElem);
        modal.show();
      }
    });
  });

  const completeEnrollmentBtn = document.getElementById('completeEnrollmentBtn');
  if (completeEnrollmentBtn) {
    completeEnrollmentBtn.addEventListener('click', () => {
      const selectedChildId = enrollmentChildSelect ? enrollmentChildSelect.value : children[0]?.id;
      const childObj = children.find(c => c.id === selectedChildId) || children[0];
      const classTitle = document.getElementById('modalEnrollClassTitle').textContent;
      const classDate = document.getElementById('modalEnrollDate').textContent;
      const classInstructor = document.getElementById('modalEnrollInstructor').textContent;

      completeEnrollmentBtn.disabled = true;
      completeEnrollmentBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Securing Kitchen Station...`;

      setTimeout(() => {
        completeEnrollmentBtn.disabled = false;
        completeEnrollmentBtn.innerHTML = `<i class="fa-solid fa-lock me-2"></i> Confirm & Reserve Spot`;

        // Add to schedule
        const newScheduleItem = {
          id: `sch-${Date.now()}`,
          childId: childObj ? childObj.id : 'child-1',
          childName: childObj ? childObj.name : 'Leo Miller',
          title: classTitle,
          date: classDate,
          time: '10:00 AM - 12:30 PM',
          chef: classInstructor,
          station: 'Kitchen Island #1',
          status: 'Confirmed'
        };

        schedule.unshift(newScheduleItem);
        if (childObj) childObj.enrolledSessions = (childObj.enrolledSessions || 0) + 1;
        saveState();
        renderSchedule();

        if (confirmEnrollModalElem && typeof bootstrap !== 'undefined') {
          const modalInstance = bootstrap.Modal.getInstance(confirmEnrollModalElem);
          if (modalInstance) modalInstance.hide();
        }

        window.showToast('🎉 Enrollment Confirmed!', `Spot reserved for ${childObj.name} in ${classTitle}. Email confirmation sent!`, 'success', 5000);

        // Switch to Schedule Tab
        const schTab = document.querySelector('[data-target-view="viewSchedule"]');
        if (schTab) schTab.click();
      }, 1400);
    });
  }

  // -------------------------------------------------------------------------
  // 5. SCHEDULE & UPCOMING SESSIONS
  // -------------------------------------------------------------------------
  const scheduleTableBody = document.getElementById('scheduleTableBody');
  const scheduleFilterChild = document.getElementById('scheduleFilterChild');

  function renderSchedule(filterChildId = 'all') {
    if (!scheduleTableBody) return;

    scheduleTableBody.innerHTML = '';
    const filtered = filterChildId === 'all'
      ? schedule
      : schedule.filter(s => s.childId === filterChildId);

    if (filtered.length === 0) {
      scheduleTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">
            <i class="fa-solid fa-calendar-xmark fs-2 mb-2 d-block"></i>
            No class sessions booked yet. Explore our Classes tab to enroll!
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="fw-bold">${item.childName}</div>
          <span class="badge bg-light text-dark border small">${item.station}</span>
        </td>
        <td>
          <div class="fw-bold text-primary">${item.title}</div>
          <small class="text-muted"><i class="fa-solid fa-user-tie me-1"></i>${item.chef}</small>
        </td>
        <td>
          <div>${item.date}</div>
          <small class="text-muted">${item.time}</small>
        </td>
        <td>
          <span class="badge ${item.status === 'Confirmed' ? 'bg-success' : 'bg-warning text-dark'}">
            <i class="fa-solid ${item.status === 'Confirmed' ? 'fa-circle-check' : 'fa-clock'} me-1"></i> ${item.status}
          </span>
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-custom calendar-export-btn" title="Add to Calendar" data-title="${item.title}">
            <i class="fa-solid fa-calendar-plus"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger cancel-session-btn" title="Cancel/Reschedule" data-id="${item.id}">
            <i class="fa-solid fa-rotate-left"></i>
          </button>
        </td>
      `;
      scheduleTableBody.appendChild(tr);
    });

    // Wire calendar export simulation
    document.querySelectorAll('.calendar-export-btn').forEach(b => {
      b.addEventListener('click', () => {
        const t = b.getAttribute('data-title');
        window.showToast('📅 Calendar Sync', `Added "${t}" to your calendar invite (iCal/Google Calendar format).`, 'info');
      });
    });

    // Wire cancel session
    document.querySelectorAll('.cancel-session-btn').forEach(b => {
      b.addEventListener('click', () => {
        const sId = b.getAttribute('data-id');
        if (confirm('Would you like to reschedule or cancel this session credit?')) {
          schedule = schedule.filter(s => s.id !== sId);
          saveState();
          renderSchedule(scheduleFilterChild ? scheduleFilterChild.value : 'all');
          window.showToast('Session Cancelled', 'Session credit refunded back to your parent account pass.', 'warning');
        }
      });
    });
  }

  if (scheduleFilterChild) {
    scheduleFilterChild.addEventListener('change', (e) => {
      renderSchedule(e.target.value);
    });
  }

  // -------------------------------------------------------------------------
  // 6. PHOTO GALLERY LIGHTBOX & DOWNLOAD
  // -------------------------------------------------------------------------
  const photoCards = document.querySelectorAll('.gallery-photo-item');
  const photoLightboxModal = document.getElementById('photoLightboxModal');
  const lightboxImg = document.getElementById('lightboxModalImg');
  const lightboxTitle = document.getElementById('lightboxModalTitle');
  const lightboxDesc = document.getElementById('lightboxModalDesc');
  const lightboxDownloadBtn = document.getElementById('lightboxDownloadBtn');

  photoCards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-full-img');
      const title = card.getAttribute('data-photo-title') || 'Cooking Session Highlight';
      const desc = card.getAttribute('data-photo-desc') || 'Young chefs perfecting their culinary craft!';

      if (lightboxImg) lightboxImg.src = src;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;
      if (lightboxDownloadBtn) {
        lightboxDownloadBtn.setAttribute('href', src);
        lightboxDownloadBtn.onclick = (e) => {
          window.showToast('📸 Download Started', `Downloading high-resolution photo: ${title}`, 'success');
        };
      }

      if (photoLightboxModal && typeof bootstrap !== 'undefined') {
        const bsModal = new bootstrap.Modal(photoLightboxModal);
        bsModal.show();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 7. INITIAL RENDER CALLS
  // -------------------------------------------------------------------------
  renderChildren();
  renderSchedule();

});

document.addEventListener('DOMContentLoaded', () => {
  // Navbar Scroll Effect
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
  });

  const closeBtn = document.getElementById('nav-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
    });
  }

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
    });
  });

  // Scroll Animations (Intersection Observer)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  revealElements.forEach(el => observer.observe(el));

  // Smooth Scroll Offset for Fixed Header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });
});

// Reservation Form Handler
document.addEventListener('DOMContentLoaded', () => {
  const reservationForm = document.getElementById('reservationForm');
  const dateInput = document.getElementById('res-date');
  const timeSelect = document.getElementById('res-time');

  if (reservationForm) {
    // 1. Set Min Date to Today (Local Time)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    dateInput.setAttribute('min', today);

    // 2. Function to Populate Time Slots
    const populateTimeSlots = () => {
      // Clear existing options except the first one
      timeSelect.innerHTML = '<option value="">Select Time</option>';

      const selectedDate = dateInput.value;
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const isToday = selectedDate === today;

      // Restaurant Hours: 14:00 (2 PM) to 23:00 (11 PM)
      const startHour = 14;
      const endHour = 23;

      for (let hour = startHour; hour <= endHour; hour++) {
        for (let min of ['00', '30']) {
          // Skip 23:30 if closing is strictly 23:00, or allow it?
          // Requirement: "up to 23:00" usually means 23:00 is the last slot (taking orders until 11).
          // If 11 PM is closing time, maybe last seating is 22:30 or 23:00?
          // "Time selection ... up to 23:00". I will include 23:00 and exclude 23:30.
          if (hour === 23 && min === '30') continue;

          const timeString = `${hour}:${min}`;

          let isDisabled = false;
          if (isToday) {
            // Compare with current time
            if (hour < currentHour || (hour === currentHour && parseInt(min) < currentMinutes)) {
              isDisabled = true;
            }
          }

          const option = document.createElement('option');
          option.value = timeString;
          // Format specific time (e.g., 14:00 -> 02:00 PM) for better display if needed, 
          // or just keep 24h format as per requirement example "14:00".
          // I'll keep 24h format in value, but maybe show AM/PM in text for friendliness?
          // User asked for "14:00, 14:30...". I will stick to 24h or what matches the requirement example.
          // Requirement example: "(e.g., 14:00, 14:30...)"
          option.textContent = timeString;

          if (isDisabled) {
            option.disabled = true;
            option.textContent += " (Unavailable)";
          }

          timeSelect.appendChild(option);
        }
      }
    };

    // Initial populate (in case browser pre-fills 'today' or just empty)
    // If empty, we can still populate basic slots (assuming not today or just show all)
    // Actually if empty, it's treated as future/neutral usually, or disable until date picked.
    // Let's populate assuming "not today" logic (all enabled) effectively, 
    // BUT seeing the date input might be empty, we wait for user. 
    // However, if user picks a date, we trigger.
    populateTimeSlots();

    // Event Listener for Date Change
    dateInput.addEventListener('change', populateTimeSlots);

    // Form Submit
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('res-name').value;
      const phone = document.getElementById('res-phone').value;
      const date = dateInput.value;
      const time = timeSelect.value;
      const guests = document.getElementById('res-guests').value;

      const message = `Hello, I would like to reserve a table at KAV.

Name: ${name}
Phone: ${phone}
Date: ${date}
Time: ${time}
Guests: ${guests} people`;

      const whatsappUrl = `https://wa.me/917994930089?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  }
});





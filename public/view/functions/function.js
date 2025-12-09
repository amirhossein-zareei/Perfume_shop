document.addEventListener("DOMContentLoaded", function () {
  // Hamburger Menu
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav a");

  if (hamburger && nav) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      nav.classList.toggle("active");
      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !isExpanded);
    });

    // Close menu when clicking on a link
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        nav.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target) && !hamburger.contains(event.target)) {
        hamburger.classList.remove("active");
        nav.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Theme Toggle
  const themeToggle = document.querySelector(".theme-toggle");
  const themeText =
    themeToggle === null
      ? null
      : themeToggle.querySelector(".theme-toggle__text");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const storageKey = "swager-theme-preference";

  const applyTheme = (theme) => {
    const normalizedTheme = theme === "light" ? "light" : "dark";
    document.body.dataset.theme = normalizedTheme;

    if (themeToggle) {
      const nextTheme = normalizedTheme === "light" ? "Dark" : "Light";
      themeToggle.setAttribute(
        "aria-pressed",
        normalizedTheme === "dark" ? "true" : "false"
      );
      themeToggle.setAttribute(
        "aria-label",
        `Switch to ${nextTheme.toLowerCase()} mode`
      );
      if (themeText) {
        themeText.textContent = `${nextTheme} Mode`;
      }
    }
  };

  const storedTheme = localStorage.getItem(storageKey);
  if (storedTheme === "light" || storedTheme === "dark") {
    applyTheme(storedTheme);
  } else {
    applyTheme(prefersDark.matches ? "dark" : "light");
  }

  themeToggle?.addEventListener("click", function () {
    const currentTheme =
      document.body.dataset.theme === "light" ? "light" : "dark";
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    localStorage.setItem(storageKey, nextTheme);
  });

  const handlePrefersChange = (event) => {
    if (!localStorage.getItem(storageKey)) {
      applyTheme(event.matches ? "dark" : "light");
    }
  };

  if (typeof prefersDark.addEventListener === "function") {
    prefersDark.addEventListener("change", handlePrefersChange);
  } else if (typeof prefersDark.addListener === "function") {
    prefersDark.addListener(handlePrefersChange);
  }

  const form = document.querySelector(".newsletter-form");
  if (form) {
    const confirmation = form.querySelector(".confirmation");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const emailField = form.querySelector('input[type="email"]');
      if (!emailField) {
        return;
      }

      const email = emailField.value.trim();
      if (!email) {
        confirmation.textContent = "Please enter a valid email address.";
        confirmation.style.color = "#ffe7d6";
        return;
      }

      confirmation.textContent = "Merci! You are on the list.";
      confirmation.style.color = "#ffe7d6";
      form.reset();
    });
  }

  // Features Slider
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    if (index >= slides.length) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = index;
    }

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 4000);
  }

  function stopSlider() {
    clearInterval(slideInterval);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", function () {
      const slideIndex = parseInt(this.getAttribute("data-slide"));
      stopSlider();
      showSlide(slideIndex);
      startSlider();
    });
  });

  if (slides.length > 0) {
    startSlider();

    const sliderContainer = document.querySelector(".slider-container");
    if (sliderContainer) {
      sliderContainer.addEventListener("mouseenter", stopSlider);
      sliderContainer.addEventListener("mouseleave", startSlider);
    }
  }

  // Contact Form — posts to an API endpoint, with mailto fallback
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const emailEl = document.getElementById("email");
      const messageEl = document.getElementById("message");
      const email = emailEl ? emailEl.value.trim() : "";
      const message = messageEl ? messageEl.value.trim() : "";
      const statusElement = contactForm.querySelector(".form-status");
      const submitButton = contactForm.querySelector('button[type="submit"]');

      if (!email || !message) {
        statusElement.textContent = "Please fill in all fields.";
        statusElement.style.color = "#ff6b6b";
        return;
      }

      const endpoint = contactForm.dataset.endpoint || "/api/v1/contact";

      const originalText = submitButton ? submitButton.textContent : "Send";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }
      statusElement.textContent = "Sending...";
      statusElement.style.color = "var(--accent)";

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, message }),
        });

        if (!res.ok) {
          let errMsg = "Failed to send message.";
          try {
            const errData = await res.json();
            if (errData && errData.message) errMsg = errData.errors[0].message;
          } catch (e) {}
          statusElement.textContent = errMsg;
          statusElement.style.color = "#ff6b6b";
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
          }
          return;
        }

        statusElement.textContent = "Message sent. Thank you!";
        statusElement.style.color = "var(--accent)";
        contactForm.reset();
      } catch (err) {
        // Network error — fallback to mailto
        const subject = encodeURIComponent(`Contact from Perfume Shop`);
        const body = encodeURIComponent(
          `Email: ${email}\n\nMessage:\n${message}`
        );
        const mailtoLink = `mailto:amirhossein2004zareei@gmail.com?subject=${subject}&body=${body}`;
        statusElement.textContent =
          "Network error — opening your email client...";
        statusElement.style.color = "#ffe7d6";
        window.location.href = mailtoLink;
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
        setTimeout(() => {
          statusElement.textContent = "";
        }, 3000);
      }
    });
  }
});

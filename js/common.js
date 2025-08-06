// Shared functionality across all pages
function initializeTheme() {
  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "light");
  }
}

// Initialize current date display
function initializeCurrentDate() {
  const dateElements = document.querySelectorAll(
    "#current-date, #journal-date"
  );
  if (dateElements.length > 0) {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = now.toLocaleDateString(undefined, options);

    dateElements.forEach((el) => {
      el.textContent = formattedDate;
    });
  }
}

// Mobile menu toggle functionality
function setupMobileMenu() {
  const menuToggle = document.createElement("button");
  menuToggle.className = "menu-toggle";
  menuToggle.setAttribute("aria-label", "Toggle menu");
  menuToggle.innerHTML = `
        <svg class="hamburger-icon" width="24" height="24" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round"/>
        </svg>
    `;

  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelector(".nav-links");

  if (!nav || !navLinks) return;

  nav.prepend(menuToggle);

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    menuToggle.classList.toggle("active");
  });

  function checkScreenSize() {
    const isMobile = window.innerWidth <= 768;
    menuToggle.style.display = isMobile ? "block" : "none";
    navLinks.classList.toggle("open", !isMobile);
  }

  window.addEventListener("resize", checkScreenSize);
  checkScreenSize();
}

// Initialize common functionality when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeCurrentDate();
  setupMobileMenu();

  // Add active class to current page link
  const currentPage = location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (currentPage === linkPage) {
      link.classList.add("active");
    }
  });
});

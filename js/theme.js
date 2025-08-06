document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const lightIcon = document.querySelector(".light-icon");
  const darkIcon = document.querySelector(".dark-icon");
  const currentTheme = localStorage.getItem("theme") || "light";

  // Set initial theme
  document.documentElement.setAttribute("data-theme", currentTheme);
  themeToggle.checked = currentTheme === "dark";
  updateActiveIcon(currentTheme);

  // Toggle theme when switch is clicked
  themeToggle.addEventListener("change", () => {
    const newTheme = themeToggle.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateActiveIcon(newTheme);
  });

  // Click handlers for icons
  lightIcon.addEventListener("click", () => {
    if (themeToggle.checked) {
      themeToggle.checked = false;
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      updateActiveIcon("light");
    }
  });

  darkIcon.addEventListener("click", () => {
    if (!themeToggle.checked) {
      themeToggle.checked = true;
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      updateActiveIcon("dark");
    }
  });

  function updateActiveIcon(theme) {
    if (theme === "dark") {
      darkIcon.classList.add("active");
      darkIcon.classList.remove("inactive");
      lightIcon.classList.add("inactive");
      lightIcon.classList.remove("active");
    } else {
      lightIcon.classList.add("active");
      lightIcon.classList.remove("inactive");
      darkIcon.classList.add("inactive");
      darkIcon.classList.remove("active");
    }
  }
});

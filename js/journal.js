document.addEventListener("DOMContentLoaded", () => {
  const journalEntry = document.getElementById("journal-entry");
  const saveJournalBtn = document.getElementById("save-journal-btn");
  const saveStatus = document.getElementById("save-status");
  const prevDayBtn = document.getElementById("prev-day-btn");
  const nextDayBtn = document.getElementById("next-day-btn");
  const journalDateDisplay = document.getElementById("journal-date");
  const datePicker = document.createElement("input");

  let currentDate = new Date();
  let autoSaveTimer;

  // date picker input
  datePicker.type = "date";
  datePicker.className = "date-picker";
  datePicker.style.margin = "0 10px";
  journalDateDisplay.parentNode.insertBefore(
    datePicker,
    journalDateDisplay.nextSibling
  );

  // Format date as YYYY-MM-DD for storage
  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  // Format date for display
  function formatDisplayDate(date) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  }

  // Update date picker value
  function updateDatePicker() {
    datePicker.value = formatDate(currentDate);
    journalDateDisplay.textContent = formatDisplayDate(currentDate);

    // Disable next day button if it's today or future
    nextDayBtn.disabled =
      currentDate.toDateString() === new Date().toDateString();
  }

  // Load journal entry for current date
  function loadEntry() {
    const dateKey = formatDate(currentDate);
    const entry = localStorage.getItem(`journal-${dateKey}`);
    journalEntry.value = entry || "";
    updateDatePicker();
  }

  // Save journal entry
  function saveEntry() {
    const dateKey = formatDate(currentDate);
    localStorage.setItem(`journal-${dateKey}`, journalEntry.value);

    saveStatus.textContent = "Saved";
    setTimeout(() => {
      if (saveStatus.textContent === "Saved") {
        saveStatus.textContent = "Auto-saved";
      }
    }, 2000);
  }

  // Change date
  function changeDate(days) {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);

    // Don't allow future dates
    if (newDate > new Date()) return;

    currentDate = newDate;
    loadEntry();
  }

  // Handle manual date selection
  datePicker.addEventListener("change", (e) => {
    const selectedDate = new Date(e.target.value);

    // Don't allow future dates
    if (selectedDate > new Date()) {
      datePicker.value = formatDate(currentDate);
      return;
    }

    currentDate = selectedDate;
    loadEntry();
  });

  // Auto-save when typing
  journalEntry.addEventListener("input", () => {
    saveStatus.textContent = "Saving...";

    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      saveEntry();
    }, 1000);
  });

  // Manual save button
  saveJournalBtn.addEventListener("click", () => {
    saveEntry();
  });

  // Date navigation
  prevDayBtn.addEventListener("click", () => changeDate(-1));
  nextDayBtn.addEventListener("click", () => changeDate(1));

  // Initialize
  loadEntry();
});

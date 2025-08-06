document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("time");
  const modeDisplay = document.getElementById("timer-mode");
  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const resetBtn = document.getElementById("reset-btn");
  const sessionCountDisplay = document.getElementById("session-count");
  const soundToggle = document.getElementById("sound-toggle");
  const timerSound = document.getElementById("timer-sound");

  let timer;
  let timeLeft = 25 * 60; // In seconds
  let isRunning = false;
  let isFocusMode = true;
  let sessionCount = 0;
  let lastUpdateTime = Date.now();

  // Load session count and timer state from localStorage
  const today = new Date().toISOString().split("T")[0];
  const savedSessions = localStorage.getItem(`pomodoro-sessions-${today}`);
  if (savedSessions) {
    sessionCount = parseInt(savedSessions);
    sessionCountDisplay.textContent = sessionCount;
  }

  // Load timer state if exists
  const savedTimer = JSON.parse(localStorage.getItem("pomodoro-timer-state"));
  if (savedTimer) {
    isRunning = savedTimer.isRunning;
    isFocusMode = savedTimer.isFocusMode;
    timeLeft = savedTimer.timeLeft;
    lastUpdateTime = savedTimer.lastUpdateTime;

    // Calculate elapsed time if timer was running
    if (isRunning) {
      const elapsedSeconds = Math.floor((Date.now() - lastUpdateTime) / 1000);
      timeLeft = Math.max(0, timeLeft - elapsedSeconds);

      if (timeLeft <= 0) {
        handleTimerCompletion();
      } else {
        startTimer();
      }
    }

    updateDisplay();
    updateUIState();
  }

  // Update timer display
  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  // Update UI buttons state
  function updateUIState() {
    startBtn.disabled = isRunning;
    pauseBtn.disabled = !isRunning;
    modeDisplay.textContent = isFocusMode ? "Focus" : "Break";
    document.body.style.backgroundColor = isFocusMode
      ? ""
      : "rgba(165, 164, 255, 0.1)";
  }

  // Switch between focus and break modes
  function switchMode() {
    isFocusMode = !isFocusMode;
    timeLeft = isFocusMode ? 25 * 60 : 5 * 60;

    if (!isFocusMode) {
      sessionCount++;
      sessionCountDisplay.textContent = sessionCount;
      localStorage.setItem(
        `pomodoro-sessions-${today}`,
        sessionCount.toString()
      );
    }

    updateDisplay();
    updateUIState();
    saveTimerState();
  }

  // Handle timer completion
  function handleTimerCompletion() {
    if (soundToggle.checked) {
      timerSound.play();
    }
    switchMode();
    if (isRunning) {
      startTimer();
    }
  }

  // Start timer
  function startTimer() {
    if (isRunning) return;

    isRunning = true;
    lastUpdateTime = Date.now();
    updateUIState();
    saveTimerState();

    timer = setInterval(() => {
      timeLeft--;
      lastUpdateTime = Date.now();
      updateDisplay();
      saveTimerState();

      if (timeLeft <= 0) {
        clearInterval(timer);
        handleTimerCompletion();
      }
    }, 1000);
  }

  // Pause timer
  function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    updateUIState();
    saveTimerState();
  }

  // Reset timer
  function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isFocusMode = true;
    timeLeft = 25 * 60;
    updateDisplay();
    updateUIState();
    localStorage.removeItem("pomodoro-timer-state");
  }

  // Save timer state to localStorage
  function saveTimerState() {
    localStorage.setItem(
      "pomodoro-timer-state",
      JSON.stringify({
        isRunning,
        isFocusMode,
        timeLeft,
        lastUpdateTime: Date.now(),
      })
    );
  }

  // Event listeners
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  window.addEventListener("beforeunload", () => {
    if (isRunning) {
      saveTimerState();
    }
  });

  // Initialize display
  updateDisplay();
  updateUIState();
});

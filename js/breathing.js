document.addEventListener("DOMContentLoaded", () => {
  const breathingCircle = document.getElementById("breathing-circle");
  const breathingText = document.getElementById("breathing-text");
  const startBtn = document.getElementById("start-breathing-btn");
  const stopBtn = document.getElementById("stop-breathing-btn");
  const soundSelect = document.getElementById("sound-select");
  const playSoundBtn = document.getElementById("play-sound-btn");

  const rainSound = document.getElementById("rain-sound");
  const wavesSound = document.getElementById("waves-sound");
  const forestSound = document.getElementById("forest-sound");

  let animationInterval;
  let isAnimating = false;
  let currentSound = null;

  // Breathing animation sequence
  const breathingSequence = [
    { text: "Breathe In", scale: 1.5, duration: 4000 },
    { text: "Hold", scale: 1.5, duration: 3000 },
    { text: "Breathe Out", scale: 1, duration: 4000 },
    { text: "Hold", scale: 1, duration: 3000 },
  ];

  // Start breathing animation
  function startBreathing() {
    if (isAnimating) return;

    isAnimating = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;

    let step = 0;

    function animateStep() {
      const { text, scale, duration } =
        breathingSequence[step % breathingSequence.length];

      breathingText.textContent = text;
      breathingCircle.style.transform = `scale(${scale})`;
      breathingCircle.style.backgroundColor = `hsl(${
        200 + step * 10
      }, 70%, 70%)`;

      step++;

      animationInterval = setTimeout(animateStep, duration);
    }

    animateStep();
  }

  // Stop breathing animation
  function stopBreathing() {
    clearTimeout(animationInterval);
    isAnimating = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;

    breathingText.textContent = "Breathe In";
    breathingCircle.style.transform = "scale(1)";
    breathingCircle.style.backgroundColor = "var(--primary-color)";
  }

  // Play selected ambient sound
  function playSelectedSound() {
    // Stop any currently playing sound
    if (currentSound) {
      currentSound.pause();
      currentSound.currentTime = 0;
    }

    const selectedSound = soundSelect.value;

    switch (selectedSound) {
      case "rain":
        currentSound = rainSound;
        break;
      case "waves":
        currentSound = wavesSound;
        break;
      case "forest":
        currentSound = forestSound;
        break;
      default:
        currentSound = null;
        return;
    }

    currentSound.play();
    playSoundBtn.textContent = "Stop Sound";
  }

  // Stop ambient sound
  function stopSound() {
    if (currentSound) {
      currentSound.pause();
      currentSound.currentTime = 0;
    }
    currentSound = null;
    playSoundBtn.textContent = "Play Sound";
  }

  // Toggle sound playback
  function toggleSound() {
    if (currentSound && !currentSound.paused) {
      stopSound();
    } else {
      playSelectedSound();
    }
  }

  // Event listeners
  startBtn.addEventListener("click", startBreathing);
  stopBtn.addEventListener("click", stopBreathing);
  playSoundBtn.addEventListener("click", toggleSound);

  // Initialize
  stopBtn.disabled = true;
});

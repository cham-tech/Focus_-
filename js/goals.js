document.addEventListener("DOMContentLoaded", () => {
  const goalInput = document.getElementById("goal-input");
  const addGoalBtn = document.getElementById("add-goal-btn");
  const goalsList = document.getElementById("goals-list");

  // Load goals from localStorage
  let goals = JSON.parse(localStorage.getItem("goals")) || [];

  // Initialize UI
  function initializeUI() {
    renderGoalsList();
  }

  // Render all goals
  function renderGoalsList() {
    goalsList.innerHTML = "";

    if (goals.length === 0) {
      goalsList.innerHTML =
        '<p class="no-goals">No goals yet. Add your first goal above!</p>';
      return;
    }

    goals.forEach((goal, index) => {
      const goalCard = document.createElement("div");
      goalCard.className = "goal-card";
      goalCard.dataset.index = index;

      // Get today's completion status
      const today = new Date().toISOString().split("T")[0];
      const todayCompleted = goal.completionHistory[today] || false;

      goalCard.innerHTML = `
                <div class="goal-header">
                    <h3 class="goal-title">${goal.text}</h3>
                    <div class="goal-actions">
                        <button class="delete-goal-btn">Delete</button>
                    </div>
                </div>
                <div class="goal-streak">
                    <span>${goal.streak}</span> day streak!
                </div>
                <div class="goal-checkbox">
                    <label>
                        <input type="checkbox" class="goal-checkbox-input" ${
                          todayCompleted ? "checked" : ""
                        }>
                        <span class="goal-checkbox-label">${
                          todayCompleted
                            ? "Completed today!"
                            : "Mark as completed today"
                        }</span>
                    </label>
                </div>
                <div class="goal-calendar">
                    <h4>Recent Progress</h4>
                    <div class="calendar-grid" id="calendar-${index}"></div>
                </div>
            `;

      goalsList.appendChild(goalCard);

      // Render calendar for this goal
      renderCalendar(index);
    });
  }

  // Render calendar for a specific goal
  function renderCalendar(goalIndex) {
    const calendarGrid = document.getElementById(`calendar-${goalIndex}`);
    if (!calendarGrid) return;

    calendarGrid.innerHTML = "";

    // Show last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];

      const dayElement = document.createElement("div");
      dayElement.className = "calendar-day";
      dayElement.textContent = date.getDate();

      if (goals[goalIndex].completionHistory[dateKey]) {
        dayElement.classList.add("completed");
      } else if (
        dateKey in goals[goalIndex].completionHistory &&
        !goals[goalIndex].completionHistory[dateKey] &&
        dateKey !== new Date().toISOString().split("T")[0]
      ) {
        dayElement.classList.add("missed");
      }

      calendarGrid.appendChild(dayElement);
    }
  }

  // Add new goal
  function addGoal() {
    const text = goalInput.value.trim();
    if (text === "") return;

    const newGoal = {
      text,
      streak: 0,
      completionHistory: {},
    };

    goals.push(newGoal);
    saveGoals();
    goalInput.value = "";
    renderGoalsList();
  }

  // Delete goal
  function deleteGoal(index) {
    if (
      !confirm(
        "Are you sure you want to delete this goal? This will also remove all its progress data."
      )
    ) {
      return;
    }

    goals.splice(index, 1);
    saveGoals();
    renderGoalsList();
  }

  // Update goal completion
  function updateGoalCompletion(index, isCompleted) {
    const today = new Date().toISOString().split("T")[0];
    goals[index].completionHistory[today] = isCompleted;

    // Update streak
    if (isCompleted) {
      // Check if yesterday was completed to maintain streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split("T")[0];

      if (
        goals[index].completionHistory[yesterdayKey] ||
        goals[index].streak === 0
      ) {
        goals[index].streak++;
      } else {
        goals[index].streak = 1;
      }
    } else {
      goals[index].streak = 0;
    }

    saveGoals();
    renderGoalsList();
  }

  // Save goals to localStorage
  function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals));
  }

  // Event delegation for checkboxes and delete buttons
  goalsList.addEventListener("click", (e) => {
    const goalCard = e.target.closest(".goal-card");
    if (!goalCard) return;

    const index = parseInt(goalCard.dataset.index);

    // Delete button clicked
    if (e.target.classList.contains("delete-goal-btn")) {
      deleteGoal(index);
    }

    // Checkbox clicked
    if (e.target.classList.contains("goal-checkbox-input")) {
      updateGoalCompletion(index, e.target.checked);
    }
  });

  // Event listeners
  addGoalBtn.addEventListener("click", addGoal);
  goalInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addGoal();
  });

  // Initialize UI
  initializeUI();
});

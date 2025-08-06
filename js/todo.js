document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTodoBtn = document.getElementById("add-todo-btn");
  const todoList = document.getElementById("todo-list");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  // Get today's date in YYYY-MM-DD format for storage
  const today = new Date().toISOString().split("T")[0];

  // Load todos from localStorage
  let todos = JSON.parse(localStorage.getItem(`todos-${today}`)) || [];

  // Render todos
  function renderTodos() {
    todoList.innerHTML = "";

    if (todos.length === 0) {
      todoList.innerHTML =
        '<p class="no-tasks">No tasks for today. Add one above!</p>';
      return;
    }

    todos.forEach((todo, index) => {
      const todoItem = document.createElement("li");
      todoItem.className = "todo-item";
      todoItem.dataset.index = index;

      todoItem.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${
                  todo.completed ? "checked" : ""
                }>
                <span class="todo-text ${todo.completed ? "completed" : ""}">${
        todo.text
      }</span>
                <button class="delete-todo">×</button>
            `;

      todoList.appendChild(todoItem);
    });

    updateProgress();
  }

  // Update progress bar
  function updateProgress() {
    if (todos.length === 0) {
      progressBar.style.width = "0%";
      progressText.textContent = "0% complete";
      return;
    }

    const completedCount = todos.filter((todo) => todo.completed).length;
    const progressPercent = Math.round((completedCount / todos.length) * 100);

    progressBar.style.width = `${progressPercent}%`;
    progressText.textContent = `${progressPercent}% complete`;
  }

  // Add new todo
  function addTodo() {
    const text = todoInput.value.trim();
    if (text === "") return;

    todos.push({
      text,
      completed: false,
    });

    localStorage.setItem(`todos-${today}`, JSON.stringify(todos));
    todoInput.value = "";
    renderTodos();
  }

  // Event listeners
  addTodoBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
  });

  // Event delegation for checkboxes and delete buttons
  todoList.addEventListener("click", (e) => {
    const todoItem = e.target.closest(".todo-item");
    if (!todoItem) return;

    const index = parseInt(todoItem.dataset.index);

    // Checkbox clicked
    if (e.target.classList.contains("todo-checkbox")) {
      todos[index].completed = e.target.checked;
      localStorage.setItem(`todos-${today}`, JSON.stringify(todos));

      const todoText = todoItem.querySelector(".todo-text");
      todoText.classList.toggle("completed", e.target.checked);
      updateProgress();
    }

    // Delete button clicked
    if (e.target.classList.contains("delete-todo")) {
      todos.splice(index, 1);
      localStorage.setItem(`todos-${today}`, JSON.stringify(todos));
      renderTodos();
    }
  });

  // Initial render
  renderTodos();
});

// script.js - simple beginner version

// 1. initial tasks (5 samples)
const tasks = [
  { id: 1, name: "Finish assignment", dueDate: "2025-09-30", completed: false },
  { id: 2, name: "Buy groceries", dueDate: "2025-10-01", completed: false },
  { id: 3, name: "Call mom", dueDate: "2025-10-02", completed: true },
  { id: 4, name: "Read a book", dueDate: "2025-10-03", completed: false },
  { id: 5, name: "Workout", dueDate: "2025-10-04", completed: true }
];

// 2. render function
function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = ""; // clear existing

  tasks.forEach(task => {
    const item = document.createElement("div");
    item.className = `flex justify-between items-center bg-white p-4 rounded-lg shadow mb-2 border border-red-900 ${task.completed ? "bg-green-50 line-through" : ""}`;
    item.dataset.id = task.id;

    item.innerHTML = `
      <div>
        <h3 class="font-semibold">${escapeHtml(task.name)}</h3>
        <p class="text-sm text-gray-500">${escapeHtml(task.dueDate || "")}</p>
      </div>
      <div class="flex gap-2">
        <button data-action="toggle" data-id="${task.id}" class="text-green-600">✔</button>
        <button data-action="edit" data-id="${task.id}" class="text-yellow-500">✏</button>
        <button data-action="delete" data-id="${task.id}" class="text-red-600">❌</button>
      </div>
    `;
    list.appendChild(item);
  });
}

// small escape to avoid basic HTML injection
function escapeHtml(str = "") {
  return String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// 3. form handler - add task
const form = document.getElementById("task-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("task-name").value.trim();
  const dueDate = document.getElementById("task-date").value;

  if (!name) {
    alert("Task name cannot be empty.");
    return;
  }

  const id = Date.now(); // simple unique id
  tasks.push({ id, name, dueDate, completed: false });
  form.reset();
  renderTasks();
});

// 4. event delegation for toggle, edit, delete
document.getElementById("task-list").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);

  if (action === "toggle") toggleComplete(id);
  if (action === "delete") deleteTask(id);
  if (action === "edit") editTask(id);
});

function toggleComplete(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.completed = !t.completed;
  renderTasks();
}

function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  const idx = tasks.findIndex(x => x.id === id);
  if (idx !== -1) tasks.splice(idx, 1);
  renderTasks();
}


function editTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  const newName = prompt("Edit task name:", t.name);
  if (newName === null) return; // user cancelled
  const newDate = prompt("Edit due date (YYYY-MM-DD):", t.dueDate || "");
  if (newName.trim() === "") {
    alert("Task name cannot be empty.");
    return;
  }
  t.name = newName.trim();
  t.dueDate = newDate.trim();
  renderTasks();
}

// initial render on load
renderTasks();

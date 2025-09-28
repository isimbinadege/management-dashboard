let tasks = [
    
  { id: 1, name: "Finish assignment", dueDate: "2025-09-30", completed: false },
  { id: 2, name: "Buy groceries", dueDate: "2025-10-01", completed: false },
  { id: 3, name: "Call mom", dueDate: "2025-10-02", completed: true },
  { id: 4, name: "Read a book", dueDate: "2025-10-03", completed: false },
  { id: 5, name: "Workout", dueDate: "2025-10-04", completed: true }
    
];
// 1. initial data model
// 2. render function
function renderTasks(filter = "all", sortByDate = false) {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  let shown = tasks.slice();

  if (filter === "completed") shown = shown.filter(t => t.completed);
  if (filter === "pending") shown = shown.filter(t => !t.completed);
  if (sortByDate) shown.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  shown.forEach(task => {
    const container = document.createElement("div");
    container.className = `flex justify-between items-center bg-white p-4 rounded-lg shadow mb-2 border border-red-900 ${task.completed ? "bg-green-50 line-through" : ""}`;
    container.innerHTML = `
      <div>
        <h3 class="font-semibold">${escapeHtml(task.name)}</h3>
        <p class="text-sm text-gray-500">${task.dueDate || ""}</p>
      </div>
      <div class="flex gap-2">
        <button class="text-green-600" data-action="toggle" data-id="${task.id}">✔</button>
        <button class="text-yellow-500" data-action="edit" data-id="${task.id}">✏</button>
        <button class="text-red-600" data-action="delete" data-id="${task.id}">❌</button>
      </div>
    `;
    list.appendChild(container);
  });
}

// small helper to avoid basic HTML injection
function escapeHtml(str = "") {
  return str.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// 3. handlers: event delegation for list buttons
document.getElementById("task-list").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;
  if (action === "toggle") toggleComplete(id);
  if (action === "delete") deleteTask(id);
  if (action === "edit") editTaskPrompt(id);
});

// add task form handler
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.querySelector('input[type="text"]').value.trim();
  const dueDate = form.querySelector('input[type="date"]').value;
  if (!name) return alert("Task name cannot be empty.");
  addTask({ name, dueDate });
  form.reset();
});

// CRUD helpers
function addTask({ name, dueDate }) {
  const id = Date.now();
  tasks.push({ id, name, dueDate, completed: false });
  renderTasks();
}

function toggleComplete(id) {
  const t = tasks.find(x => x.id === id);
  if (t) t.completed = !t.completed;
  renderTasks();
}

function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  const idx = tasks.findIndex(x => x.id === id);
  if (idx !== -1) tasks.splice(idx, 1);
  renderTasks();
}

function editTaskPrompt(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  const newName = prompt("Task name:", t.name);
  if (newName === null) return;
  const newDate = prompt("Due date (YYYY-MM-DD):", t.dueDate || "");
  if (newDate === null) return;
  t.name = newName.trim() || t.name;
  t.dueDate = newDate.trim();
  renderTasks();
}

// initial render on page load
renderTasks();

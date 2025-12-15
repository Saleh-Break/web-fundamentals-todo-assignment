// File: js/app.js
// Student: Saleh Break (12401201)

const STUDENT_ID = "12401201";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// Grab elements from the DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

function setStatus(message, isError = false) {
if (!statusDiv) return;
statusDiv.textContent = message || "";
statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

// ----------------------------
// TODO 1: Load tasks on page load
// ----------------------------
async function loadCurrentToDO() {
try {
setStatus("Loading tasks...");

const url = `${API_BASE}/get.php?stdid=${STUDENT_ID}&key=${API_KEY}`;

const res = await fetch(url);
if (!res.ok) throw new Error(`Errror here, response status: ${res.status}`);

const data = await res.json();

// Clear list on reload
if (list) list.innerHTML = "";
const tasks = Array.isArray(data.tasks) ? data.tasks : [];

for (const task of tasks) {
renderTask(task);
}

setStatus(tasks.length ? `Loaded ${tasks.length} task(s).` : "0 tasks.");
} catch (err) {
console.error(err);
setStatus(err.message || "Errorhere.", true);
}
}

document.addEventListener("DOMContentLoaded", () => {
loadCurrentToDO();
});

// ----------------------------
// TODO 2: Add task (POST) on form submit
// ----------------------------
if (form) {
form.addEventListener("submit", async (event) => {
event.preventDefault();

try {
const title = (input?.value || "").trim();
if (!title) return;

setStatus("Currently adding.");

const url = `${API_BASE}/add.php?stdid=${STUDENT_ID}&key=${API_KEY}`;


const res = await fetch(url, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ title }),
});

if (!res.ok) throw new Error(`Error adding, response status: ${res.status})`);

const data = await res.json();




renderTask(data.task);     


input.value = "";
setStatus("Added");
} catch (err) {
console.error(err);
setStatus(err.message || "Error adding", true);
}
});
}

// ----------------------------
// TODO 3: Render + Delete button
// ----------------------------
async function deleteTask(taskId, liElement) {
    // assre wasnt clciked by accident
if (!confirm("Delete this task?")) return;

try {
setStatus("Deleting.");

const url = `${API_BASE}/delete.php?stdid=${STUDENT_ID}&key=${API_KEY}&id=${taskId}`;

const res = await fetch(url, { method: "GET" });
if (!res.ok) throw new Error(`Errror deleting, response status: ${res.status})`);

const data = await res.json();

if (!data.success) {
throw new Error(data.message || "Server could not delete the task.");
}

liElement.remove();
setStatus("Deleted");
} catch (err) {
console.error(err);
setStatus(err.message || "Error deleting.", true);
}
}

function renderTask(task) {
if (!list || !task) return;

const li = document.createElement("li");
li.className = "task-item";

const span = document.createElement("span");
span.textContent = task.title;

const btn = document.createElement("button");
btn.type = "button";
btn.textContent = "Delete";

btn.addEventListener("click", () => {
deleteTask(task.id, li);
});

li.appendChild(span);
li.appendChild(btn);
list.appendChild(li);
}

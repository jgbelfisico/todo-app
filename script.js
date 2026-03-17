"use strict";

// Referencias principales de la interfaz.
const todoForm = document.querySelector(".todo-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");

// Clave de localStorage y texto para estado vacío.
const STORAGE_KEY = "todo.tasks";
const EMPTY_MESSAGE = "Aún no hay tareas. Agrega la primera.";

// Estado en memoria de la app.
let tasks = [];

// Crea un id único por tarea.
function createTaskId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

// Guarda el estado completo en localStorage.
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Convierte cualquier dato cargado en un formato seguro y predecible.
function sanitizeTasks(rawTasks) {
  if (!Array.isArray(rawTasks)) {
    return [];
  }

  return rawTasks
    .map(function (item, index) {
      return {
        id: typeof item.id === "string" && item.id ? item.id : `loaded-${index}`,
        text: typeof item.text === "string" ? item.text.trim() : "",
        completed: Boolean(item.completed),
      };
    })
    .filter(function (item) {
      return item.text !== "";
    });
}

// Carga tareas desde localStorage al iniciar la app.
function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (!savedTasks) {
    tasks = [];
    return;
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);
    tasks = sanitizeTasks(parsedTasks);
  } catch (error) {
    tasks = [];
  }
}

// Dibuja un mensaje simple cuando no hay tareas.
function renderEmptyState() {
  const emptyItem = document.createElement("li");
  emptyItem.className = "task-list-empty";
  emptyItem.textContent = EMPTY_MESSAGE;
  taskList.appendChild(emptyItem);
}

// Crea un elemento visual de tarea y conecta eventos de completar/eliminar.
function createTaskItem(task) {
  const listItem = document.createElement("li");
  listItem.className = "task-item";

  if (task.completed) {
    listItem.classList.add("task-completed");
  }

  const content = document.createElement("div");
  content.className = "task-content";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = task.completed;

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "task-delete-button";
  deleteButton.textContent = "Eliminar";

  // Marca/desmarca tarea, actualiza estado y guarda.
  checkbox.addEventListener("change", function () {
    task.completed = checkbox.checked;
    listItem.classList.toggle("task-completed", task.completed);
    saveTasks();
  });

  // Elimina tarea del estado, guarda y vuelve a renderizar.
  deleteButton.addEventListener("click", function () {
    tasks = tasks.filter(function (currentTask) {
      return currentTask.id !== task.id;
    });

    saveTasks();
    renderTasks();
  });

  content.appendChild(checkbox);
  content.appendChild(text);
  listItem.appendChild(content);
  listItem.appendChild(deleteButton);

  return listItem;
}

// Dibuja toda la lista según el estado actual en memoria.
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    renderEmptyState();
    return;
  }

  tasks.forEach(function (task) {
    taskList.appendChild(createTaskItem(task));
  });
}

// Crea una tarea nueva, guarda y re-renderiza.
function addTask(taskText) {
  const newTask = {
    id: createTaskId(),
    text: taskText,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

// Maneja el formulario para agregar tareas.
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  // Evita tareas vacías o con solo espacios.
  if (!taskText) {
    taskInput.focus();
    return;
  }

  addTask(taskText);

  // Limpia el campo y deja el cursor listo para seguir.
  taskInput.value = "";
  taskInput.focus();
});

// Inicialización: leer localStorage y renderizar.
loadTasks();
renderTasks();

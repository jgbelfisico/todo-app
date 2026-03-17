"use strict";

// Referencias principales de la interfaz.
const todoForm = document.querySelector(".todo-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const filterButtons = document.querySelectorAll(".filter-button");
const pendingCounter = document.querySelector("#pending-counter");
const clearCompletedButton = document.querySelector("#clear-completed-button");

// Clave de localStorage, texto para estado vacío y filtros disponibles.
const STORAGE_KEY = "todo.tasks";
const EMPTY_MESSAGE = "Aún no hay tareas en este filtro.";
const FILTER_ALL = "all";
const FILTER_PENDING = "pending";
const FILTER_COMPLETED = "completed";

// Estado en memoria de la app.
let tasks = [];
let currentFilter = FILTER_ALL;

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

// Dibuja un mensaje simple cuando no hay tareas visibles.
function renderEmptyState() {
  const emptyItem = document.createElement("li");
  emptyItem.className = "task-list-empty";
  emptyItem.textContent = EMPTY_MESSAGE;
  taskList.appendChild(emptyItem);
}

// Devuelve solo tareas según el filtro activo.
function getFilteredTasks() {
  if (currentFilter === FILTER_PENDING) {
    return tasks.filter(function (task) {
      return !task.completed;
    });
  }

  if (currentFilter === FILTER_COMPLETED) {
    return tasks.filter(function (task) {
      return task.completed;
    });
  }

  return tasks;
}

// Calcula cuántas tareas pendientes quedan.
function getPendingTasksCount() {
  return tasks.filter(function (task) {
    return !task.completed;
  }).length;
}

// Calcula cuántas tareas completadas existen.
function getCompletedTasksCount() {
  return tasks.filter(function (task) {
    return task.completed;
  }).length;
}

// Actualiza el texto del contador de pendientes.
function renderPendingCounter() {
  const pendingCount = getPendingTasksCount();

  if (pendingCount === 1) {
    pendingCounter.textContent = "Te queda 1 tarea pendiente.";
    return;
  }

  pendingCounter.textContent = `Te quedan ${pendingCount} tareas pendientes.`;
}

// Muestra u oculta el botón para eliminar completadas.
function renderClearCompletedButton() {
  const completedCount = getCompletedTasksCount();
  clearCompletedButton.disabled = completedCount === 0;
}

// Actualiza visualmente el botón de filtro activo.
function updateActiveFilterButton() {
  filterButtons.forEach(function (button) {
    button.classList.toggle("is-active", button.dataset.filter === currentFilter);
  });
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
    saveTasks();
    renderTasks();
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

// Dibuja la lista según tareas + filtro activo.
function renderTasks() {
  const visibleTasks = getFilteredTasks();

  taskList.innerHTML = "";

  if (visibleTasks.length === 0) {
    renderEmptyState();
  } else {
    visibleTasks.forEach(function (task) {
      taskList.appendChild(createTaskItem(task));
    });
  }

  renderPendingCounter();
  renderClearCompletedButton();
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

// Elimina todas las tareas completadas.
function clearCompletedTasks() {
  tasks = tasks.filter(function (task) {
    return !task.completed;
  });

  saveTasks();
  renderTasks();
}

// Permite agregar tareas al presionar Enter en el campo de texto.
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    todoForm.requestSubmit();
  }
});

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

// Maneja cambios de filtro.
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    updateActiveFilterButton();
    renderTasks();
  });
});

// Maneja la acción de eliminar todas las tareas completadas.
clearCompletedButton.addEventListener("click", function () {
  clearCompletedTasks();
});

// Inicialización: leer localStorage y renderizar.
loadTasks();
updateActiveFilterButton();
renderTasks();

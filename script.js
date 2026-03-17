"use strict";

// Referencias principales de la interfaz.
const todoForm = document.querySelector(".todo-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const filterButtons = document.querySelectorAll(".filter-button");
const pendingCounter = document.querySelector("#pending-counter");
const clearCompletedButton = document.querySelector("#clear-completed-button");

// Clave de localStorage y textos de interfaz.
const STORAGE_KEY = "todo.tasks";
const EMPTY_MESSAGE = "Aún no hay tareas en este filtro.";
const UNKNOWN_DATE_TEXT = "Fecha desconocida";

// Filtros disponibles para mostrar tareas.
const FILTERS = {
  all: function () {
    return true;
  },
  pending: function (task) {
    return !task.completed;
  },
  completed: function (task) {
    return task.completed;
  },
};

// Estado en memoria de la app.
let tasks = [];
let currentFilter = "all";

// Crea un id único por tarea.
function createTaskId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

// Devuelve fecha/hora actual en formato ISO para guardar en localStorage.
function createCreatedAt() {
  return new Date().toISOString();
}

// Convierte una fecha ISO a texto legible para mostrar en interfaz.
function formatCreatedAt(isoDate) {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return UNKNOWN_DATE_TEXT;
  }

  return date.toLocaleString("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

// Normaliza una tarea para evitar errores por datos incompletos.
function sanitizeTask(rawTask, index) {
  return {
    id: typeof rawTask.id === "string" && rawTask.id ? rawTask.id : `loaded-${index}`,
    text: typeof rawTask.text === "string" ? rawTask.text.trim() : "",
    completed: Boolean(rawTask.completed),
    createdAt:
      typeof rawTask.createdAt === "string" && rawTask.createdAt
        ? rawTask.createdAt
        : createCreatedAt(),
  };
}

// Convierte cualquier dato cargado en un formato seguro y predecible.
function sanitizeTasks(rawTasks) {
  if (!Array.isArray(rawTasks)) {
    return [];
  }

  return rawTasks
    .map(function (item, index) {
      return sanitizeTask(item, index);
    })
    .filter(function (item) {
      return item.text !== "";
    });
}

// Guarda el estado completo en localStorage.
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Carga tareas desde localStorage al iniciar la app.
function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (!savedTasks) {
    tasks = [];
    return;
  }

  try {
    tasks = sanitizeTasks(JSON.parse(savedTasks));
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

// Devuelve tareas según el filtro activo.
function getFilteredTasks() {
  const matchesFilter = FILTERS[currentFilter] || FILTERS.all;

  return tasks.filter(function (task) {
    return matchesFilter(task);
  });
}

// Calcula cantidades para contador de pendientes y botón de completadas.
function getTaskCounts() {
  return tasks.reduce(
    function (counts, task) {
      if (task.completed) {
        counts.completed += 1;
      } else {
        counts.pending += 1;
      }

      return counts;
    },
    { pending: 0, completed: 0 },
  );
}

// Actualiza contador de tareas pendientes.
function renderPendingCounter(pendingCount) {
  if (pendingCount === 1) {
    pendingCounter.textContent = "Te queda 1 tarea pendiente.";
    return;
  }

  pendingCounter.textContent = `Te quedan ${pendingCount} tareas pendientes.`;
}

// Actualiza disponibilidad del botón para eliminar completadas.
function renderClearCompletedButton(completedCount) {
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

  const textGroup = document.createElement("div");
  textGroup.className = "task-text-group";

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;

  const createdAt = document.createElement("small");
  createdAt.className = "task-created-at";
  createdAt.textContent = `Creada: ${formatCreatedAt(task.createdAt)}`;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "task-delete-button";
  deleteButton.textContent = "Eliminar";

  // Marca/desmarca tarea, guarda y vuelve a renderizar.
  checkbox.addEventListener("change", function () {
    task.completed = checkbox.checked;
    saveAndRender();
  });

  // Elimina tarea del estado, guarda y vuelve a renderizar.
  deleteButton.addEventListener("click", function () {
    tasks = tasks.filter(function (currentTask) {
      return currentTask.id !== task.id;
    });

    saveAndRender();
  });

  textGroup.appendChild(text);
  textGroup.appendChild(createdAt);

  content.appendChild(checkbox);
  content.appendChild(textGroup);
  listItem.appendChild(content);
  listItem.appendChild(deleteButton);

  return listItem;
}

// Dibuja la lista según tareas + filtro activo.
function renderTasks() {
  const visibleTasks = getFilteredTasks();
  const taskCounts = getTaskCounts();

  taskList.innerHTML = "";

  if (visibleTasks.length === 0) {
    renderEmptyState();
  } else {
    visibleTasks.forEach(function (task) {
      taskList.appendChild(createTaskItem(task));
    });
  }

  renderPendingCounter(taskCounts.pending);
  renderClearCompletedButton(taskCounts.completed);
}

// Guarda en localStorage y repinta la interfaz.
function saveAndRender() {
  saveTasks();
  renderTasks();
}

// Crea una tarea nueva, guarda y re-renderiza.
function addTask(taskText) {
  tasks.push({
    id: createTaskId(),
    text: taskText,
    completed: false,
    createdAt: createCreatedAt(),
  });

  saveAndRender();
}

// Elimina todas las tareas completadas.
function clearCompletedTasks() {
  tasks = tasks.filter(function (task) {
    return !task.completed;
  });

  saveAndRender();
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

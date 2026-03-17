"use strict";

// Referencias principales de la interfaz.
const todoForm = document.querySelector(".todo-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");

// Clave única para guardar y leer tareas desde localStorage.
const STORAGE_KEY = "todo.tasks";

// Estado en memoria de la aplicación.
let tasks = [];

// Guarda el arreglo de tareas en localStorage.
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
    tasks = JSON.parse(savedTasks);
  } catch (error) {
    tasks = [];
  }
}

// Muestra un mensaje simple cuando no hay tareas.
function renderEmptyState() {
  const emptyItem = document.createElement("li");
  emptyItem.className = "task-list-empty";
  emptyItem.textContent = "Aún no hay tareas. Agrega la primera.";
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

  // Cambia el estado de completada y lo guarda.
  checkbox.addEventListener("change", function () {
    task.completed = checkbox.checked;
    listItem.classList.toggle("task-completed", task.completed);
    saveTasks();
  });

  // Elimina la tarea del estado y vuelve a guardar.
  deleteButton.addEventListener("click", function () {
    tasks = tasks.filter(function (item) {
      return item.id !== task.id;
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

// Dibuja toda la lista de tareas según el estado actual.
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    renderEmptyState();
    return;
  }

  tasks.forEach(function (task) {
    const taskItem = createTaskItem(task);
    taskList.appendChild(taskItem);
  });
}

// Agrega una nueva tarea al estado, la guarda y vuelve a renderizar.
function addTask(taskText) {
  const newTask = {
    id: Date.now().toString(),
    text: taskText,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

// Maneja el formulario para crear tareas.
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  // Evita agregar tareas vacías o con solo espacios.
  if (!taskText) {
    taskInput.focus();
    return;
  }

  addTask(taskText);

  // Limpia el campo y deja el cursor listo.
  taskInput.value = "";
  taskInput.focus();
});

// Inicializa la app leyendo almacenamiento y renderizando la lista.
loadTasks();
renderTasks();

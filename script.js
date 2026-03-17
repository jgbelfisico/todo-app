"use strict";

// Referencias principales de la interfaz.
const todoForm = document.querySelector(".todo-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");

// Muestra el mensaje de lista vacía si ya no quedan tareas.
function showEmptyMessageIfNeeded() {
  const hasTasks = taskList.querySelector(".task-item");

  if (!hasTasks) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "task-list-empty";
    emptyItem.textContent = "Aún no hay tareas. Agrega la primera.";
    taskList.appendChild(emptyItem);
  }
}

// Crea la estructura visual de una tarea con acciones de completar y eliminar.
function createTaskItem(taskText) {
  const listItem = document.createElement("li");
  listItem.className = "task-item";

  const content = document.createElement("div");
  content.className = "task-content";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = taskText;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "task-delete-button";
  deleteButton.textContent = "Eliminar";

  // Marca o desmarca visualmente la tarea como completada.
  checkbox.addEventListener("change", function () {
    listItem.classList.toggle("task-completed", checkbox.checked);
  });

  // Elimina la tarea seleccionada de la lista.
  deleteButton.addEventListener("click", function () {
    listItem.remove();
    showEmptyMessageIfNeeded();
  });

  content.appendChild(checkbox);
  content.appendChild(text);
  listItem.appendChild(content);
  listItem.appendChild(deleteButton);

  return listItem;
}

// Agrega una tarea al listado visible.
function addTaskToList(taskText) {
  const emptyItem = taskList.querySelector(".task-list-empty");

  // Si existe el mensaje de lista vacía, se remueve al agregar una tarea.
  if (emptyItem) {
    emptyItem.remove();
  }

  const newTaskItem = createTaskItem(taskText);
  taskList.appendChild(newTaskItem);
}

// Maneja el envío del formulario al hacer clic en "Agregar tarea".
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  // Evita agregar tareas vacías o solo con espacios.
  if (!taskText) {
    taskInput.focus();
    return;
  }

  addTaskToList(taskText);

  // Limpia el campo y deja el cursor listo para la siguiente tarea.
  taskInput.value = "";
  taskInput.focus();
});

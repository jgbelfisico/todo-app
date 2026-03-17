"use strict";

// Referencias a elementos de la interfaz.
const todoForm = document.querySelector(".todo-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");

// Crea y agrega una nueva tarea a la lista visual.
function addTaskToList(taskText) {
  const emptyItem = taskList.querySelector(".task-list-empty");

  // Si existe el mensaje "lista vacía", se elimina al agregar la primera tarea.
  if (emptyItem) {
    emptyItem.remove();
  }

  const listItem = document.createElement("li");
  listItem.className = "task-item";
  listItem.textContent = taskText;
  taskList.appendChild(listItem);
}

// Maneja el envío del formulario al hacer clic en "Agregar tarea".
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  // No permite agregar tareas vacías.
  if (!taskText) {
    taskInput.focus();
    return;
  }

  addTaskToList(taskText);

  // Limpia el campo después de agregar y deja el cursor listo para la siguiente tarea.
  taskInput.value = "";
  taskInput.focus();
});

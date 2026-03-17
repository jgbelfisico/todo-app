# To-Do App (fase final + filtros)

Aplicación de tareas básica construida con:

- HTML
- CSS
- JavaScript puro

## Estado actual

La app permite:

- Agregar tareas (con validación para evitar vacías).
- Marcar tareas como completadas.
- Eliminar tareas.
- Guardar y recuperar tareas con `localStorage`.
- Mantener el estado de completadas al recargar la página.
- Filtrar tareas por estado:
  - **Todas**
  - **Pendientes**
  - **Completadas**

## Archivos del proyecto

- `index.html`: estructura de la interfaz (formulario, filtros y lista).
- `styles.css`: estilos visuales de la app y del estado "completada".
- `script.js`: lógica principal (estado, renderizado, filtros y persistencia).
- `README.md`: documentación general y guía rápida de uso.

## Cómo abrirlo localmente

1. Abre este repositorio en tu editor.
2. Ejecuta un servidor local simple:
   - `python3 -m http.server 8000`
3. Abre en el navegador:
   - `http://localhost:8000`

También puedes abrir `index.html` directamente con doble clic.

## Qué probar manualmente

1. Escribe una tarea y presiona **Agregar tarea**.
2. Intenta agregar una tarea vacía (no debe agregarse).
3. Marca una tarea como completada (debe verse tachada).
4. Cambia filtros y verifica resultados:
   - **Todas**: muestra todo.
   - **Pendientes**: solo no completadas.
   - **Completadas**: solo completadas.
5. Elimina una tarea y verifica que desaparece.
6. Recarga la página y confirma que tareas y estado se mantienen.

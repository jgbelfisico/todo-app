# To-Do App (fase final + filtros + contador)

Aplicación de tareas básica construida con:

- HTML
- CSS
- JavaScript puro

## Estado actual

La app permite:

- Agregar tareas (con validación para evitar vacías).
- Agregar tareas con la tecla **Enter**.
- Marcar tareas como completadas.
- Eliminar tareas.
- Eliminar todas las tareas completadas con un botón.
- Guardar y recuperar tareas con `localStorage`.
- Mantener el estado de completadas al recargar la página.
- Filtrar tareas por estado:
  - **Todas**
  - **Pendientes**
  - **Completadas**
- Ver un contador de tareas pendientes.
- Mostrar la fecha de creación de cada tarea.

## Archivos del proyecto

- `index.html`: estructura de la interfaz (formulario, contador, filtros y lista).
- `styles.css`: estilos visuales de la app y del estado "completada".
- `script.js`: lógica principal (estado, renderizado, filtros, contador y persistencia).
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
2. Confirma que el contador de pendientes aumenta.
3. Marca una tarea como completada y confirma que el contador baja.
4. Elimina una tarea y confirma que el contador se actualiza.
5. Cambia filtros y verifica resultados:
   - **Todas**: muestra todo.
   - **Pendientes**: solo no completadas.
   - **Completadas**: solo completadas.
6. Presiona **Eliminar completadas** y confirma que desaparecen todas las completadas.
7. Verifica que cada tarea muestra su fecha/hora de creación.
8. Recarga la página y confirma que tareas, estado, contador y fecha se mantienen.

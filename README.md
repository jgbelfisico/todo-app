# To-Do App (fase 6: revisión final)

Aplicación de tareas básica construida con:

- HTML
- CSS
- JavaScript puro

## Estado actual

La app ya permite:

- Agregar tareas (con validación para evitar vacías).
- Marcar tareas como completadas.
- Eliminar tareas.
- Guardar y recuperar tareas con `localStorage`.
- Mantener el estado de completadas al recargar la página.

## Archivos del proyecto

- `index.html`: estructura de la interfaz (título, formulario y lista).
- `styles.css`: estilos visuales de la app y del estado "completada".
- `script.js`: lógica principal (estado en memoria, renderizado y persistencia).
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
4. Elimina una tarea.
5. Recarga la página y verifica que tareas y estados se mantengan.

# OPTIMIZATIONS.md

## Evidencia de optimización

## Problema identificado

Durante el desarrollo del módulo de tareas se observó que varios componentes podían renderizarse más veces de lo necesario. Esto ocurría principalmente en las listas de tareas y proyectos, donde cada cambio en el contenedor provocaba la reevaluación de todos los elementos renderizados. Además, la búsqueda por texto podía dispararse en cada pulsación del teclado, generando trabajo extra en la interfaz.

También se identificó el riesgo de fugas de memoria o actualizaciones innecesarias al trabajar con operaciones asíncronas, especialmente al desmontar componentes o cancelar solicitudes en progreso.

---

## Soluciones aplicadas

### 1. Memoización de componentes con `React.memo`

Se aplicó `React.memo` a los componentes `ProjectCard` y `TaskCard` para evitar renders innecesarios cuando sus props no cambian. Esto mejora el rendimiento de las listas, especialmente cuando existen varias tareas mostradas al mismo tiempo.

**Objetivo:** evitar que cada tarjeta se vuelva a renderizar si la tarea o proyecto correspondiente no cambió.

---

### 2. Memoización de cálculos con `useMemo`

En `ProjectListContainer` y `TaskListContainer` se utilizó `useMemo` para calcular:

- las listas filtradas
- total de elementos
- la cantidad de elementos filtrados

Esto evita recalcular estos valores en cada render si sus dependencias no han cambiado.

**Objetivo:** reducir trabajo innecesario al aplicar filtros y búsquedas.

---

### 3. Optimización de funciones con `useCallback`

Se utilizó `useCallback` en hooks y funciones que se reutilizan entre renders, por ejemplo:

- carga de tareas con `fetchTasks` o de proyectos con `fetchProjects`
- handlers del formulario
- funciones del hook `useForm`
- ejecución controlada en `useAsync`

**Objetivo:** mantener referencias estables y prevenir renders o ejecuciones repetidas por cambios innecesarios de funciones.

---

### 4. Búsqueda con debounce

Se implementó una búsqueda por título en `ProjectFilters` y `TaskFilters` usando debounce de **500 ms**. De esta forma, el filtrado no se ejecuta en cada tecla presionada, sino medio segundo después de que el usuario deja de escribir.

**Objetivo:** disminuir renders y cálculos excesivos durante la búsqueda.

---

### 5. Manejo seguro de asincronía con `AbortController`

En el hook `useAsync` se implementó:

- cancelación de requests previos
- cancelación al desmontar el componente
- prevención de actualizaciones de estado cuando el componente ya no está montado

Esto ayuda a evitar fugas de memoria y errores asociados a operaciones asíncronas inconclusas.

**Objetivo:** mejorar estabilidad y evitar trabajo innecesario en segundo plano.

---

### 6. Separación de responsabilidades

Se separó la lógica en varias capas:

Por ejemplo:
- `taskService`: simula la API
- `taskContext`: mantiene el estado global
- `useTasks`: conecta el servicio con el contexto
- componentes de UI: presentan la información

**Objetivo:** mejorar mantenibilidad, legibilidad y escalabilidad del código.

---

## Optimizaciones específicas de Next.js aplicadas

Además de las optimizaciones de React, en el proyecto también se aplicaron optimizaciones propias de Next.js:

### 1. Uso de Server Components en páginas

Se mantuvieron páginas como `tasks/page.tsx` como **Server Components** cuando no necesitaban hooks del cliente directamente. Esto reduce la cantidad de JavaScript enviado al navegador.

**Beneficio:** menor carga en cliente y mejor separación entre render del servidor y lógica interactiva.

---

### 2. Uso de Client Components solo donde era necesario

Los componentes que usan estado, contexto, efectos o hooks como `useTasks`, `useForm` o `useAsync` fueron marcados con `'use client'` únicamente cuando era requerido.

**Beneficio:** evita convertir innecesariamente toda la pantalla en código cliente.

---

### 3. Uso de `loading.tsx`

Se utilizaron archivos `loading.tsx` para aprovechar el sistema de carga por segmentos de Next.js.

**Beneficio:** mejor experiencia de usuario durante navegación y carga de rutas.

---

### 4. Rutas dinámicas con App Router

La edición de tareas se implementó mediante rutas dinámicas como:

```txt
/tasks/edit/[id]/page.tsx
```

**Beneficio:** estructura más escalable, clara y alineada con el enrutamiento moderno de Next.js.

---

### 5. Organización por App Router y separación modular

El proyecto se estructuró usando App Router con carpetas por dominio (`tasks`, `projects`, `hooks`, `services`, `context`).

**Beneficio:** facilita mantenimiento, reutilización y crecimiento del proyecto.

---

## Conclusión

Las optimizaciones aplicadas permitieron mejorar el rendimiento y la organización del proyecto. Se redujeron renders innecesarios, se controló mejor la ejecución de operaciones asíncronas y se mejoró la experiencia del usuario con una búsqueda más eficiente y una arquitectura más ordenada. Además, se aprovecharon características propias de Next.js para mantener una separación correcta entre componentes de servidor y componentes de cliente.

## Calculadora de gastos personales

Actividad final integradora de Programación Frontend, de la Tecnicatura Superior en Desarrollo de Software Full Stack (IPAP Río Negro).

## Descripción

Es una aplicación web para registrar gastos personales. De cada gasto se guarda el concepto, la categoría y el monto. Los gastos se ven en una tabla con el total acumulado y se pueden editar o eliminar. Los datos quedan guardados en el navegador, así que siguen ahí aunque se cierre la página.

## Objetivos

- Registrar gastos de forma simple y validada.
- Ver todos los gastos en un mismo lugar, con el total calculado automáticamente.
- Poder corregir o eliminar un gasto cargado por error.
- Conservar la información entre visitas sin usar una base de datos.

## Funciones

Gastos (index.html) = Muestra los gastos en una tabla con su ID, concepto, categoría y monto, y calcula el total. Si no hay gastos, lo avisa.

Nuevo Registro (NuevoRegistro.html) = Formulario para cargar un gasto. Valida que el concepto no esté vacío, que se elija una categoría y que el monto sea mayor a 0.

Editar Registro (EditarRegistro.html) = Permite elegir un gasto de una lista desplegable para modificarlo o eliminarlo. Antes de eliminar pide confirmación.

Otros detalles:

- Los IDs son correlativos (1, 2, 3...) y se reordenan cuando se elimina un gasto.
- Los montos se muestran con formato de peso argentino ($ 1.250,50).
- Los mensajes de error y de confirmación aparecen debajo del formulario y se borran cuando el usuario vuelve a escribir.
- El diseño se adapta a pantallas chicas: en el celular, los botones de navegación se apilan y la tabla y el formulario ocupan todo el ancho.

## Tecnologías utilizadas

- HTML: estructura semántica (header, nav, main, table, form con label).
- CSS: colores, modelo de caja, Flexbox y @media para el diseño adaptable.
- JavaScript: manipulación del DOM y eventos (submit, click, change, input). Usa arreglos y objetos, y los métodos map, filter, find, reduce y forEach.
- JSON y localStorage: los gastos se guardan como un arreglo de objetos convertido a JSON con JSON.stringify y se leen con JSON.parse.

## Estructura del proyecto

```
├── index.html            Listado de gastos (página principal)
├── NuevoRegistro.html    Formulario para agregar un gasto
├── EditarRegistro.html   Formulario para editar o eliminar un gasto
├── styles.css            Estilos de las 3 páginas
├── app.js                Lógica de las 3 páginas
└── wireframes/           Bocetos de las pantallas
```

## Cómo usarla

1. Descargar o clonar el repositorio.
2. Abrir index.html en el navegador. 

## Versiones

- primera-entrega: versión presentada en la primera entrega (28/09).
- main: versión final (02/11).

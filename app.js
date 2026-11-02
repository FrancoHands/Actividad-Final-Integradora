// Datos y funciones compartidas por las 3 páginas

const CATEGORIAS = ["Comida", "Transporte", "Servicios", "Salud", "Ocio", "Otros"];

function obtenerGastos() {
  try {
    return JSON.parse(localStorage.getItem("gastos")) || [];
  } catch (error) {
// Si el dato guardado está dañado, se empieza con una lista vacía
    return [];
  }
}

// Reasigna los IDs según la posición en el array (1, 2, 3...) para que no queden huecos cuando se borra un gasto del medio.
function guardarGastos(gastos) {
  const gastosOrdenados = gastos.map((gasto, indice) => ({
    ...gasto,
    id: indice + 1
  }));
  localStorage.setItem("gastos", JSON.stringify(gastosOrdenados));
}

function formatearMonto(monto) {
  return "$ " + Number(monto).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function cargarCategorias(select) {
  CATEGORIAS.forEach((categoria) => {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria;
    select.appendChild(opcion);
  });
}

// Devuelve el texto del error, o "" si los datos son válidos
function validarGasto(concepto, categoria, monto) {
  if (concepto === "") {
    return "Ingresá un concepto.";
  }
  if (categoria === "") {
    return "Elegí una categoría.";
  }
  if (monto === "") {
    return "Ingresá un monto válido.";
  }
  if (Number(monto) <= 0) {
    return "El monto debe ser mayor a 0.";
  }
  return "";
}

// tipo: "error", "exito" o "" para borrar el mensaje
function mostrarMensaje(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = "mensaje " + tipo;
}

// Lógica para NuevoRegistro.html

const formNuevo = document.getElementById("formNuevo");

if (formNuevo) {
  const inputConcepto = document.getElementById("concepto");
  const selectCategoria = document.getElementById("categoria");
  const inputMonto = document.getElementById("monto");
  const mensajeNuevo = document.getElementById("mensajeNuevo");

  cargarCategorias(selectCategoria);

// Cuando el usuario corrige un campo, se borra el mensaje de error
  formNuevo.addEventListener("input", () => {
    mostrarMensaje(mensajeNuevo, "", "");
  });

  formNuevo.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const concepto = inputConcepto.value.trim();
    const categoria = selectCategoria.value;
    const monto = inputMonto.value;

    const error = validarGasto(concepto, categoria, monto);
    if (error) {
      mostrarMensaje(mensajeNuevo, error, "error");
      return;
    }

    const gastos = obtenerGastos();
    gastos.push({ concepto, categoria, monto: Number(monto) });
    guardarGastos(gastos);

    window.location.href = "index.html";
  });
}

// Lógica para index.html (listado de gastos)

const tablaBody = document.querySelector(".tabla tbody");

if (tablaBody) {
  const filtroCategoria = document.getElementById("filtroCategoria");

  function mostrarGastos(gastos) {
    tablaBody.innerHTML = "";

    if (gastos.length === 0) {
      const fila = document.createElement("tr");
      const celda = document.createElement("td");
      celda.colSpan = 4;
      celda.className = "sinGastos";
      celda.textContent = "No hay gastos registrados.";
      fila.appendChild(celda);
      tablaBody.appendChild(fila);
    }

    gastos.forEach((gasto) => {
      const fila = document.createElement("tr");
      const valores = [gasto.id, gasto.concepto, gasto.categoria, formatearMonto(gasto.monto)];

      valores.forEach((valor) => {
        const celda = document.createElement("td");
        celda.textContent = valor;
        fila.appendChild(celda);
      });

      tablaBody.appendChild(fila);
    });

    const total = gastos.reduce((suma, gasto) => suma + Number(gasto.monto), 0);
    document.getElementById("totalGastos").textContent = formatearMonto(total);
  }

  cargarCategorias(filtroCategoria);
  mostrarGastos(obtenerGastos());

// Filtro de gastos por categoría
  filtroCategoria.addEventListener("change", () => {
    const gastos = obtenerGastos();

    if (filtroCategoria.value === "") {
      mostrarGastos(gastos);
    } else {
      mostrarGastos(gastos.filter((gasto) => gasto.categoria === filtroCategoria.value));
    }
  });
}

// Lógica para EditarRegistro.html

const formEditar = document.getElementById("formEditar");

if (formEditar) {
  const selectorGasto = document.getElementById("selectorGasto");
  const inputConceptoEdit = document.getElementById("conceptoEdit");
  const selectCategoriaEdit = document.getElementById("categoriaEdit");
  const inputMontoEdit = document.getElementById("montoEdit");
  const botonEliminar = document.getElementById("btnEliminar");
  const mensajeEditar = document.getElementById("mensajeEditar");

// Carga los gastos guardados en el desplegable
  function cargarOpciones() {
    selectorGasto.innerHTML = '<option value="">-- Seleccionar --</option>';

    obtenerGastos().forEach((gasto) => {
      const opcion = document.createElement("option");
      opcion.value = gasto.id;
      opcion.textContent = `${gasto.id}. ${gasto.concepto} - ${gasto.categoria} - ${formatearMonto(gasto.monto)}`;
      selectorGasto.appendChild(opcion);
    });
  }

  function limpiarCampos() {
    inputConceptoEdit.value = "";
    selectCategoriaEdit.value = "";
    inputMontoEdit.value = "";
  }

  cargarCategorias(selectCategoriaEdit);
  cargarOpciones();

  formEditar.addEventListener("input", () => {
    mostrarMensaje(mensajeEditar, "", "");
  });

// Al elegir un gasto del desplegable, muestra sus datos en los campos
  selectorGasto.addEventListener("change", () => {
    const gastoSeleccionado = obtenerGastos().find((gasto) => gasto.id === Number(selectorGasto.value));

    if (gastoSeleccionado) {
      inputConceptoEdit.value = gastoSeleccionado.concepto;
      selectCategoriaEdit.value = gastoSeleccionado.categoria;
      inputMontoEdit.value = gastoSeleccionado.monto;
    } else {
      limpiarCampos();
    }
  });

// Actualiza el gasto seleccionado (botón "Actualizar")
  formEditar.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!selectorGasto.value) {
      mostrarMensaje(mensajeEditar, "Elegí un gasto para editar.", "error");
      return;
    }

    const concepto = inputConceptoEdit.value.trim();
    const categoria = selectCategoriaEdit.value;
    const monto = inputMontoEdit.value;

    const error = validarGasto(concepto, categoria, monto);
    if (error) {
      mostrarMensaje(mensajeEditar, error, "error");
      return;
    }

    const idSeleccionado = Number(selectorGasto.value);

    const gastosActualizados = obtenerGastos().map((gasto) => {
      if (gasto.id === idSeleccionado) {
        return { id: gasto.id, concepto, categoria, monto: Number(monto) };
      }
      return gasto;
    });

    guardarGastos(gastosActualizados);
    cargarOpciones();
    selectorGasto.value = idSeleccionado;
    mostrarMensaje(mensajeEditar, "Gasto actualizado correctamente.", "exito");
  });

// Elimina el gasto seleccionado
  botonEliminar.addEventListener("click", () => {
    if (!selectorGasto.value) {
      mostrarMensaje(mensajeEditar, "Elegí un gasto para eliminar.", "error");
      return;
    }

    const textoGasto = selectorGasto.options[selectorGasto.selectedIndex].textContent;
    if (!confirm(`¿Seguro que querés eliminar "${textoGasto}"?`)) {
      return;
    }

    const idSeleccionado = Number(selectorGasto.value);
    const gastosFiltrados = obtenerGastos().filter((gasto) => gasto.id !== idSeleccionado);

    guardarGastos(gastosFiltrados);
    cargarOpciones();
    limpiarCampos();
    mostrarMensaje(mensajeEditar, "Gasto eliminado correctamente.", "exito");
  });
}

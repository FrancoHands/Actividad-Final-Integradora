const formulario = document.getElementById("formNuevo");
const formularioEditar = document.getElementById("formEditar");
const tablaBody = document.querySelector(".tabla tbody");

// Reasigna los IDs según la posición en el array (1, 2, 3...) para que no queden huecos cuando se borra un gasto del medio.
function reordenarIds(gastos) {
  return gastos.map((gasto, indice) => ({
    ...gasto,
    id: indice + 1
  }));
}

// --- Lógica para NuevoRegistro.html ---

if (formulario) {
  const inputConcepto = document.getElementById("concepto");
  const inputCategoria = document.getElementById("categoria");
  const inputMonto = document.getElementById("monto");
  const botonGuardar = formulario.querySelector("button");

  botonGuardar.addEventListener("click", () => {
    const concepto = inputConcepto.value;
    const categoria = inputCategoria.value;
    const monto = inputMonto.value;

    if (!concepto || !categoria || !monto) {
      alert("Completá todos los campos");
      return;
    }

    const gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    const nuevoGasto = { concepto, categoria, monto };

    gastos.push(nuevoGasto);
    localStorage.setItem("gastos", JSON.stringify(reordenarIds(gastos)));

    inputConcepto.value = "";
    inputCategoria.value = "";
    inputMonto.value = "";

    window.location.href = "Gastos.html";
  });
}

// --- Lógica para Gastos.html ---

if (tablaBody) {
  const gastos = JSON.parse(localStorage.getItem("gastos")) || [];

  gastos.forEach((gasto) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td>${gasto.id}</td><td>${gasto.concepto}</td><td>${gasto.categoria}</td><td>${gasto.monto}</td>`;
    tablaBody.appendChild(fila);
  });

  const totalGastos = document.getElementById("totalGastos");
  const total = gastos.reduce((suma, gasto) => suma + Number(gasto.monto), 0);
  totalGastos.textContent = total;
}

// --- Lógica para EditarRegistro.html ---

if (formularioEditar) {
  const selectorGasto = document.getElementById("selectorGasto");
  const inputConceptoEdit = document.getElementById("conceptoEdit");
  const inputCategoriaEdit = document.getElementById("categoriaEdit");
  const inputMontoEdit = document.getElementById("montoEdit");
  const botonActualizar = document.getElementById("btnActualizar");
  const botonEliminar = document.getElementById("btnEliminar");

  // Carga los gastos guardados
  function cargarOpciones() {
    const gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    selectorGasto.innerHTML = '<option value="">-- Seleccionar --</option>';

    gastos.forEach((gasto) => {
      const opcion = document.createElement("option");
      opcion.value = gasto.id;
      opcion.textContent = `${gasto.concepto} - ${gasto.categoria} - ${gasto.monto}`;
      selectorGasto.appendChild(opcion);
    });
  }

  cargarOpciones();

  // Al elegir un gasto del desplegable, muestra sus datos en los inputs
  selectorGasto.addEventListener("change", () => {
    const gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    const gastoSeleccionado = gastos.find((g) => g.id === Number(selectorGasto.value));

    if (gastoSeleccionado) {
      inputConceptoEdit.value = gastoSeleccionado.concepto;
      inputCategoriaEdit.value = gastoSeleccionado.categoria;
      inputMontoEdit.value = gastoSeleccionado.monto;
    } else {
      inputConceptoEdit.value = "";
      inputCategoriaEdit.value = "";
      inputMontoEdit.value = "";
    }
  });

  // Actualiza el gasto seleccionado
  botonActualizar.addEventListener("click", () => {
    if (!selectorGasto.value) {
      alert("Elegí un gasto para editar");
      return;
    }

    const gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    const idSeleccionado = Number(selectorGasto.value);

    const gastosActualizados = gastos.map((gasto) => {
      if (gasto.id === idSeleccionado) {
        return {
          id: gasto.id,
          concepto: inputConceptoEdit.value,
          categoria: inputCategoriaEdit.value,
          monto: inputMontoEdit.value
        };
      }
      return gasto;
    });

    localStorage.setItem("gastos", JSON.stringify(gastosActualizados));
    cargarOpciones();
    alert("Gasto actualizado");
  });

  // Elimina el gasto seleccionado
  botonEliminar.addEventListener("click", () => {
    if (!selectorGasto.value) {
      alert("Elegí un gasto para eliminar");
      return;
    }

    const gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    const idSeleccionado = Number(selectorGasto.value);

    const gastosFiltrados = gastos.filter((gasto) => gasto.id !== idSeleccionado);

    localStorage.setItem("gastos", JSON.stringify(reordenarIds(gastosFiltrados)));
    cargarOpciones();

    inputConceptoEdit.value = "";
    inputCategoriaEdit.value = "";
    inputMontoEdit.value = "";

    alert("Gasto eliminado");
  });
}

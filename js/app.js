// SIMULACIÓN DE DATOS (Se guardarán en la memoria del navegador usando localStorage)
let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
let trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [
    { id: 1, nombre: "Vendedor 1", comisionPorcentaje: 10, totalVentas: 0, ganancias: 0 }
];

// Al cargar la página, pintar los datos que ya existan
document.addEventListener("DOMContentLoaded", () => {
    actualizarTablas();

    const formVenta = document.getElementById("form-venta");
    if (formVenta) {
        formVenta.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Capturar datos del formulario
            const cliente = e.target.elements[0].value;
            const monto = parseFloat(e.target.elements[1].value);
            const esDeudor = document.getElementById("es-deudor").checked;

            // Registrar la venta
            const nuevaVenta = {
                id: Date.now(),
                vendedor: usuarioLogueado.nombre,
                cliente: cliente,
                monto: monto,
                estado: esDeudor ? "Deudor" : "Pagado",
                deuda: esDeudor ? monto : 0
            };

            ventas.push(nuevaVenta);
            
            // Si es el vendedor actual, sumarle su comisión
            if (usuarioLogueado.rol === "vendedor") {
                trabajadores[0].totalVentas += monto;
                trabajadores[0].ganancias += (monto * (usuarioLogueado.comision / 100));
            }

            // Guardar cambios y limpiar formulario
            localStorage.setItem('ventas', JSON.stringify(ventas));
            localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
            
            e.target.reset();
            actualizarTablas();
            alert("Venta registrada con éxito");
        });
    }
});

// Función para actualizar las tablas en la pantalla
function actualizarTablas() {
    const tablaComisiones = document.getElementById("tabla-comisiones")?.getElementsByTagName('tbody')[0];
    const tablaClientes = document.getElementById("tabla-clientes")?.getElementsByTagName('tbody')[0];
    const listaTrabajadores = document.getElementById("lista-trabajadores");

    if (tablaComisiones) {
        tablaComisiones.innerHTML = "";
        trabajadores.forEach(t => {
            tablaComisiones.innerHTML += `
                <tr>
                    <td>${t.nombre}</td>
                    <td>$${t.totalVentas}</td>
                    <td>${t.comisionPorcentaje}%</td>
                    <td>$${t.ganancias}</td>
                </tr>
            `;
        });
    }

    if (tablaClientes) {
        tablaClientes.innerHTML = "";
        ventas.forEach(v => {
            tablaClientes.innerHTML += `
                <tr>
                    <td>${v.cliente}</td>
                    <td><span style="color: ${v.estado === 'Deudor' ? 'red' : 'green'}">${v.estado}</span></td>
                    <td>$${v.deuda}</td>
                    <td>
                        ${v.estado === 'Deudor' ? `<button onclick="cobrarDeuda(${v.id})" style="background:#10b981; color:white; padding:2px 5px; font-size:12px;">Cobrar</button>` : 'Ninguna'}
                    </td>
                </tr>
            `;
        });
    }

    if (listaTrabajadores) {
        listaTrabajadores.innerHTML = "";
        trabajadores.forEach(t => {
            listaTrabajadores.innerHTML += `<li>${t.nombre} - (${t.comisionPorcentaje}% Comisión)</li>`;
        });
    }
}

// Función para que el dueño liquide las deudas
function cobrarDeuda(id) {
    ventas = ventas.map(v => {
        if (v.id === id) {
            v.estado = "Pagado";
            v.deuda = 0;
        }
        return v;
    });
    localStorage.setItem('ventas', JSON.stringify(ventas));
    actualizarTablas();
    alert("¡Deuda pagada!");
}
// Función para que el dueño agregue nuevos vendedores
function agregarTrabajador() {
    const nombre = prompt("Ingrese el nombre del nuevo trabajador:");
    
    // Si el usuario cancela o deja vacío, no hace nada
    if (!nombre) return; 

    const comision = parseFloat(prompt(`Ingrese el % de comisión para ${nombre} (Solo el número):`));

    // Validar que la comisión sea un número real
    if (isNaN(comision) || comision < 0) {
        alert("Por favor, ingrese un porcentaje de comisión válido.");
        return;
    }

    // Crear el nuevo objeto trabajador
    const nuevoTrabajador = {
        id: Date.now(),
        nombre: nombre,
        comisionPorcentaje: comision,
        totalVentas: 0,
        ganancias: 0
    };

    // Empujar el trabajador a la lista global y guardarlo en el almacenamiento del navegador
    trabajadores.push(nuevoTrabajador);
    localStorage.setItem('trabajadores', JSON.stringify(trabajadores));

    // Refrescar las tablas automáticamente en la pantalla
    actualizarTablas();
    alert(`¡${nombre} ha sido agregado con éxito!`);
}

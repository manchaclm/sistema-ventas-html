// MEMORIA LOCAL DE LA APLICACIÓN
let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
let trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [
    { id: 1, nombre: "Vendedor 1", comisionPorcentaje: 10, totalVentas: 0, ganancias: 0 }
];

// Variable global para saber quién está usando la página en este instante
let usuarioActivo = { nombre: "Carlos (Dueño)", rol: "admin", comision: 0 };

document.addEventListener("DOMContentLoaded", () => {
    actualizarSelectorUsuarios();
    actualizarTablas();
    controlarVistasPorRol();

    const formVenta = document.getElementById("form-venta");
    if (formVenta) {
        formVenta.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const cliente = e.target.elements[0].value;
            const monto = parseFloat(e.target.elements[1].value);
            const esDeudor = document.getElementById("es-deudor").checked;

            // 1. Registrar la venta vinculándola al usuario que está activo en el selector
            const nuevaVenta = {
                id: Date.now(),
                vendedor: usuarioActivo.nombre,
                cliente: cliente,
                monto: monto,
                estado: esDeudor ? "Deudor" : "Pagado",
                deuda: esDeudor ? monto : 0
            };

            ventas.push(nuevaVenta);
            
            // 2. Si el usuario activo es un vendedor, sumarle la venta y su comisión matemática
            if (usuarioActivo.rol === "vendedor") {
                trabajadores = trabajadores.map(t => {
                    if (t.nombre === usuarioActivo.nombre) {
                        t.totalVentas += monto;
                        t.ganancias += (monto * (t.comisionPorcentaje / 100));
                    }
                    return t;
                });
            }

            // Guardar todo en la memoria del navegador
            localStorage.setItem('ventas', JSON.stringify(ventas));
            localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
            
            // Reiniciar el formulario y refrescar la pantalla
            e.target.reset();
            actualizarTablas();
            actualizarSelectorUsuarios(); // Mantener el selector sincronizado
            alert(`Venta registrada con éxito por ${usuarioActivo.nombre}`);
        });
    }
});

// FUNCIÓN PARA CAMBIAR ENTRE DUEÑO Y VENDEDORES
function cambiarUsuarioSimulado() {
    const selector = document.getElementById("selector-vendedor");
    const valorSeleccionado = selector.value;

    if (valorSeleccionado === "admin") {
        usuarioActivo = { nombre: "Carlos (Dueño)", rol: "admin", comision: 0 };
    } else {
        // Buscar al vendedor seleccionado en la lista de trabajadores
        const vendedorEncontrado = trabajadores.find(t => t.id == valorSeleccionado);
        if (vendedorEncontrado) {
            usuarioActivo = { 
                nombre: sellerEncontrado = vendedorEncontrado.nombre, 
                rol: "vendedor", 
                comision: vendedorEncontrado.comisionPorcentaje 
            };
        }
    }
    
    // Ocultar o mostrar herramientas según el rol seleccionado
    controlarVistasPorRol();
}

// Oculta el panel de control si es vendedor, lo muestra si es Dueño
function controlarVistasPorRol() {
    const seccionAdmin = document.getElementById("seccion-admin");
    if (seccionAdmin) {
        if (usuarioActivo.rol === "admin") {
            seccionAdmin.classList.remove("hidden"); // Muestra estadísticas y botón de agregar
        } else {
            seccionAdmin.classList.add("hidden");    // Un vendedor ordinario no puede ver esto
        }
    }
}

// Llena el menú desplegable de arriba con los vendedores que vayas creando
function actualizarSelectorUsuarios() {
    const selector = document.getElementById("selector-vendedor");
    if (!selector) return;

    // Guardar el valor que estaba seleccionado para que no se reinicie
    const valorActual = selector.value;

    // Dejar siempre al administrador de primero
    selector.innerHTML = `<option value="admin">Carlos (Dueño) - ADMIN</option>`;
    
    // Agregar dinámicamente cada trabajador de la lista
    trabajadores.forEach(t => {
        selector.innerHTML += `<option value="${t.id}">${t.nombre} (Vendedor)</option>`;
    });

    // Restaurar la selección
    selector.value = valorActual;
}

// PINTAR LOS DATOS EN LAS TABLAS
function actualizarTablas() {
    const tablaComisiones = document.getElementById("tabla-comisiones")?.getElementsByTagName('tbody')[0];
    const tablaClientes = document.getElementById("tabla-clientes")?.getElementsByTagName('tbody')[0];
    const listaTrabajadores = document.getElementById("lista-trabajadores");

    if (tablaComisiones) {
        tablaComisiones.innerHTML = "";
        trabajadores.forEach(t => {
            tablaComisiones.innerHTML += `
                <tr>
                    <td><strong>${t.nombre}</strong></td>
                    <td>$${t.totalVentas.toFixed(2)}</td>
                    <td>${t.comisionPorcentaje}%</td>
                    <td style="color: #10b981; font-weight: bold;">$${t.ganancias.toFixed(2)}</td>
                </tr>
            `;
        });
    }

    if (tablaClientes) {
        tablaClientes.innerHTML = "";
        ventas.forEach(v => {
            tablaClientes.innerHTML += `
                <tr>
                    <td>${v.cliente} <br><small style="color:gray">Vendido por: ${v.vendedor}</small></td>
                    <td><span style="color: ${v.estado === 'Deudor' ? 'red' : 'green'}; font-weight:bold;">${v.estado}</span></td>
                    <td>$${v.deuda.toFixed(2)}</td>
                    <td>
                        ${v.estado === 'Deudor' ? `<button onclick="cobrarDeuda(${v.id})" class="btn-success" style="padding:3px 8px; font-size:12px;">Cobrar</button>` : 'Ninguna'}
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

// AGREGAR TRABAJADORES DESDE LA PANTALLA
function agregarTrabajador() {
    const nombre = prompt("Ingrese el nombre del nuevo trabajador:");
    if (!nombre) return; 

    const comision = parseFloat(prompt(`Ingrese el % de comisión para ${nombre}:`));
    if (isNaN(comision) || comision < 0) {
        alert("Por favor, ingrese un número válido.");
        return;
    }

    const nuevoTrabajador = {
        id: Date.now(),
        nombre: nombre,
        comisionPorcentaje: comision,
        totalVentas: 0,
        ganancias: 0
    };

    trabajadores.push(nuevoTrabajador);
    localStorage.setItem('trabajadores', JSON.stringify(trabajadores));

    actualizarTablas();
    actualizarSelectorUsuarios(); // Lo agrega de inmediato al menú de arriba
    alert(`¡${nombre} ahora es parte del equipo!`);
}

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
    alert("¡Deuda cobrada con éxito!");
}

function cerrarSesion() {
    alert("Sesión simulada cerrada.");
}


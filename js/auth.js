// SIMULACIÓN DE BASE DE DATOS LOCAL
// Puedes probar cambiando el rol de 'admin' a 'vendedor' para ver cómo cambia el panel
const usuarioLogueado = {
    nombre: "Carlos (Dueño)",
    rol: "admin", // Opciones: 'admin' o 'vendedor'
    comision: 10   // Porcentaje de comisión si es vendedor
};

// Función que se ejecuta automáticamente al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const txtUsuario = document.getElementById("txt-usuario");
    const seccionAdmin = document.getElementById("seccion-admin");

    if (txtUsuario) {
        txtUsuario.textContent = `${usuarioLogueado.nombre} (${usuarioLogueado.rol.toUpperCase()})`;
    }

    // CONTROL DE ROLES: Si es admin ve todo, si es vendedor se oculta el panel de dueño
    if (seccionAdmin) {
        if (usuarioLogueado.rol === "admin") {
            seccionAdmin.classList.remove("hidden"); // Muestra el panel de dueño
        } else {
            seccionAdmin.classList.add("hidden");    // Oculta el panel de dueño
        }
    }
});

function cerrarSesion() {
    alert("Cerrando sesión...");
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Admin() {
  const [seccion, setSeccion] = useState("dashboard");
  const [ventas, setVentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    cargarVentas();
    cargarUsuarios();
  }, []);

  const cargarVentas = async () => {
    const { data } = await supabase
      .from("ventas")
      .select("*, trabajadores(nombre)");

    if (data) {
      setVentas(data);
      const suma = data.reduce((acc, v) => acc + Number(v.precio), 0);
      setTotal(suma);
    }
  };

  const cargarUsuarios = async () => {
    const { data } = await supabase
      .from("trabajadores")
      .select("*");

    if (data) {
      setUsuarios(data);
    }
  };

  const crearUsuario = async () => {
    const nombre = prompt("Nombre del trabajador:");
    const pin = prompt("PIN del trabajador:");

    if (!nombre || !pin) return;

    await supabase.from("trabajadores").insert([{ nombre, pin }]);

    alert("Trabajador creado 🔥");
    cargarUsuarios();
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este trabajador?")) return;

    await supabase.from("trabajadores").delete().eq("id", id);

    alert("Trabajador eliminado");
    cargarUsuarios();
  };

  const cerrarSesion = () => {
    window.location.href = "/login";
  };

  const tu15 = total * 0.15;
  const socio50 = total * 0.5;
  const trabajador35 = total * 0.35;

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={{ color: "gold" }}>Imperio S&D 👑</h2>

        <button onClick={() => setSeccion("dashboard")} style={styles.menuBtn}>
          Dashboard
        </button>

        <button onClick={() => setSeccion("ventas")} style={styles.menuBtn}>
          Ventas
        </button>

        <button onClick={() => setSeccion("usuarios")} style={styles.menuBtn}>
          Usuarios
        </button>

        <button onClick={cerrarSesion} style={styles.logout}>
          Cerrar Sesión
        </button>
      </div>

      <div style={styles.content}>
        {seccion === "dashboard" && (
          <>
            <h1>Dashboard 👑</h1>
            <h2>Total: ${total}</h2>
            <p>Tu 15% 👑: ${tu15}</p>
            <p>Socio 50% 🤝: ${socio50}</p>
            <p>Trabajadores 35% 👤: ${trabajador35}</p>
          </>
        )}

        {seccion === "ventas" && (
          <>
            <h1>Historial de Ventas 💰</h1>
            {ventas.map((venta) => (
              <div key={venta.id} style={styles.card}>
                <p><strong>{venta.trabajadores?.nombre}</strong></p>
                <p>${venta.precio}</p>
              </div>
            ))}
          </>
        )}

        {seccion === "usuarios" && (
          <>
            <h1>Gestión de Usuarios 👥</h1>

            <button style={styles.addBtn} onClick={crearUsuario}>
              ➕ Crear Trabajador
            </button>

            <div style={{ marginTop: "20px" }}>
              {usuarios.map((usuario) => (
                <div key={usuario.id} style={styles.card}>
                  <p><strong>{usuario.nombre}</strong></p>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => eliminarUsuario(usuario.id)}
                  >
                    🗑 Eliminar
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#111",
    color: "white",
  },
  sidebar: {
    width: "220px",
    background: "#1a1a1a",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    borderRight: "1px solid gold",
  },
  menuBtn: {
    padding: "10px",
    background: "#222",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  logout: {
    marginTop: "auto",
    padding: "10px",
    background: "gold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: "40px",
  },
  card: {
    background: "#222",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addBtn: {
    padding: "10px",
    background: "gold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  deleteBtn: {
    padding: "5px 10px",
    background: "red",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
};

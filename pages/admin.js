import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Admin() {
  const [seccion, setSeccion] = useState("dashboard");
  const [ventas, setVentas] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    cargarVentas();
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

  const cerrarSesion = () => {
    window.location.href = "/login";
  };

  const tu15 = total * 0.15;
  const socio50 = total * 0.5;
  const trabajador35 = total * 0.35;

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={{ color: "gold" }}>Imperio S&D</h2>

        <button onClick={() => setSeccion("dashboard")} style={styles.menuBtn}>
          Dashboard
        </button>

        <button onClick={() => setSeccion("ventas")} style={styles.menuBtn}>
          Ventas
        </button>

        <button onClick={() => setSeccion("usuarios")} style={styles.menuBtn}>
          Usuarios
        </button>

        <button onClick={() => setSeccion("ajustes")} style={styles.menuBtn}>
          Ajustes
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
            <h1>Historial de Ventas</h1>
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
            <h1>Gestión de Usuarios</h1>
            <p>Aquí agregaremos editar / crear / eliminar trabajadores.</p>
          </>
        )}

        {seccion === "ajustes" && (
          <>
            <h1>Ajustes ⚙</h1>
            <p>Aquí pondremos modo noche / día / cambiar PIN.</p>
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
  },
};

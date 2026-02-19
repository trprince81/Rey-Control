import { useState } from "react";

export default function Admin() {
  const [clientes, setClientes] = useState(0);
  const [total, setTotal] = useState(0);
  const [cerrado, setCerrado] = useState(false);

  function registrarVenta(precio) {
    if (cerrado) return;

    const confirmar = confirm("¿Estás seguro que quieres agregar este cliente?");

    if (!confirmar) return;

    setClientes(clientes + 1);
    setTotal(total + precio);
  }

  const trabajador = total * 0.35;
  const tu = total * 0.15;
  const socio = total * 0.5;

  function cerrarDia() {
    const confirmar = confirm("¿Seguro que deseas cerrar el día?");
    if (!confirmar) return;

    setCerrado(true);
    alert("Día cerrado correctamente 🔒");
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Panel Admin 👑</h1>

        <div style={styles.stats}>
          <p>Clientes: {clientes}</p>
          <p>Total Vendido: ${total}</p>
          <p>Trabajador 35%: ${trabajador}</p>
          <p>Tu 15%: ${tu}</p>
          <p>Socio 50%: ${socio}</p>
        </div>

        {!cerrado && (
          <>
            <button style={styles.button} onClick={() => registrarVenta(120)}>
              15 min - $120
            </button>

            <button style={styles.button} onClick={() => registrarVenta(180)}>
              30 min - $180
            </button>

            <button style={styles.button} onClick={() => registrarVenta(260)}>
              1 Hora - $260
            </button>

            <button style={styles.closeButton} onClick={cerrarDia}>
              Cerrar Día 🔒
            </button>
          </>
        )}

        {cerrado && <p style={{ color: "red" }}>Día Cerrado</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    background: "linear-gradient(145deg, #1c1c1c, #111)",
    padding: "30px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 10px 30px rgba(255, 140, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
  },

  title: {
    fontSize: "24px",
    marginBottom: "20px",
    background: "linear-gradient(45deg, orange, gold)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "bold",
    textAlign: "center",
  },

  stats: {
    marginBottom: "20px",
    lineHeight: "1.8",
  },

  button: {
    width: "100%",
    padding: "14px",
    marginTop: "10px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    background: "linear-gradient(45deg, #ff8c00, #ffb347)",
    color: "black",
    boxShadow: "0 4px 20px rgba(255,140,0,0.4)",
  },

  closeButton: {
    width: "100%",
    padding: "14px",
    marginTop: "15px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    background: "linear-gradient(45deg, #ff0000, #b30000)",
    color: "white",
  },
};

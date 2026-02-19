import { useState, useEffect } from "react";

export default function Admin() {
  const [clientes, setClientes] = useState(0);
  const [total, setTotal] = useState(0);
  const [cerrado, setCerrado] = useState(false);

  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayClientes, setDisplayClientes] = useState(0);

  function hablar(texto) {
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-DO";
    mensaje.rate = 0.9;
    mensaje.pitch = 1;
    mensaje.volume = 1;
    window.speechSynthesis.speak(mensaje);
  }

  function registrarVenta(precio) {
    if (cerrado) return;

    const confirmar = confirm("¿Estás seguro que quieres agregar este cliente?");
    if (!confirmar) return;

    setClientes(prev => prev + 1);
    setTotal(prev => prev + precio);

    hablar("Ta heavy mi rey, estás haciendo pasta mijo");
  }

  const trabajador = total * 0.35;
  const tu = total * 0.15;
  const socio = total * 0.5;

  // 🔥 Animación Clientes
  useEffect(() => {
    let start = displayClientes;
    let end = clientes;
    if (start === end) return;

    let increment = end > start ? 1 : -1;

    const timer = setInterval(() => {
      start += increment;
      setDisplayClientes(start);
      if (start === end) clearInterval(timer);
    }, 40);

    return () => clearInterval(timer);
  }, [clientes]);

  // 🔥 Animación Total
  useEffect(() => {
    let start = displayTotal;
    let end = total;
    if (start === end) return;

    let increment = (end - start) / 20;

    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        start = end;
        clearInterval(timer);
      }
      setDisplayTotal(Math.floor(start));
    }, 30);

    return () => clearInterval(timer);
  }, [total]);

  function cerrarDia() {
    const confirmar = confirm("¿Seguro que deseas cerrar el día?");
    if (!confirmar) return;

    setCerrado(true);
    hablar("Día cerrado mi rey, conteo final listo");
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <button
          style={styles.backButton}
          onClick={() => (window.location.href = "/login")}
        >
          ⬅ Volver
        </button>

        <h1 style={styles.title}>Imperio S&D 👑</h1>

        <div style={styles.stats}>
          <p style={styles.line}>
            Clientes 👨 : <span style={styles.number}>{displayClientes}</span>
          </p>

          <p style={styles.line}>
            Total Vendido 💰 : <span style={styles.number}>${displayTotal}</span>
          </p>

          <p style={styles.line}>
            Trabajador 35% 👤 : <span style={styles.number}>${Math.floor(trabajador)}</span>
          </p>

          <p style={styles.line}>
            Tu 15% 👑 : <span style={styles.number}>${Math.floor(tu)}</span>
          </p>

          <p style={styles.line}>
            Socio 50% 🤝 : <span style={styles.number}>${Math.floor(socio)}</span>
          </p>
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

        {cerrado && (
          <p style={{ color: "red", marginTop: "15px" }}>
            Día Cerrado
          </p>
        )}
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

  backButton: {
    alignSelf: "flex-start",
    marginBottom: "15px",
    background: "transparent",
    border: "1px solid gold",
    color: "gold",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  title: {
    fontSize: "28px",
    marginBottom: "20px",
    fontWeight: "bold",
    textAlign: "center",
    background: "linear-gradient(45deg, #FFD700, #FFB800, #FFA500)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  stats: {
    marginBottom: "20px",
  },

  line: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#FFD700",
  },

  number: {
    fontSize: "22px",
    color: "#FFD700",
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

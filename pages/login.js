import { useState } from "react";

export default function Login() {
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");

  const ADMIN_PIN = "1234"; // cambia esto luego

  const entrarAdmin = () => {
    if (pin === ADMIN_PIN) {
      window.location.href = "/admin";
    } else {
      alert("PIN incorrecto mi rey ❌");
    }
  };

  const entrarTrabajador = () => {
    if (!nombre || !pin) {
      alert("Pon nombre y PIN 👀");
      return;
    }

    // guardamos temporalmente el nombre
    localStorage.setItem("trabajadorNombre", nombre);

    window.location.href = "/trabajador";
  };

  return (
    <div style={styles.fondo}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>Imperio S&D 👑</h1>

        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="PIN"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          style={styles.input}
        />

        <button style={styles.boton} onClick={entrarTrabajador}>
          Entrar como Trabajador 👤
        </button>

        <button style={styles.boton} onClick={entrarAdmin}>
          Entrar como Admin 👑
        </button>
      </div>
    </div>
  );
}

const styles = {
  fondo: {
    height: "100vh",
    background: "linear-gradient(135deg, #1a1a2e, #16213e)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#1e1e2f",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 0 40px gold",
    textAlign: "center",
    width: "320px",
  },
  titulo: {
    color: "gold",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "none",
  },
  boton: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "12px",
    border: "none",
    background: "gold",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

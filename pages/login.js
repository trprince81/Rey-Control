import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  const ADMIN_PIN = "caro13"; //

  function handleLogin(role) {
    if (role === "admin") {
      if (pin.trim() === ADMIN_PIN) {
        router.push("/admin");
      } else {
        alert("PIN incorrecto");
      }
    } else {
      router.push("/trabajador");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Imperio S&D 👑</h1>

        <input
          type="password"
          placeholder="PIN Admin"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button} onClick={() => handleLogin("admin")}>
          Entrar como Admin 👑
        </button>

        <button style={styles.button} onClick={() => handleLogin("trabajador")}>
          Entrar como Trabajador 👤
        </button>
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
    maxWidth: "350px",
    boxShadow: "0 10px 30px rgba(255, 140, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  title: {
    fontSize: "26px",
    marginBottom: "20px",
    background: "linear-gradient(45deg, orange, gold)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    backgroundColor: "#222",
    color: "white",
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
};

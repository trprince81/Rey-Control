import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  const ADMIN_PIN = "caro13";

  function handleLogin(role) {
    if (role === "admin") {
      if (pin === ADMIN_PIN) {
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
      <h1>Imperio S&D</h1>

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
  );
}

const styles = {
  container: {
    backgroundColor: "#000",
    color: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    padding: 10,
    margin: 10,
  },
  button: {
    padding: 12,
    margin: 5,
    backgroundColor: "gold",
    border: "none",
    cursor: "pointer",
  },
};

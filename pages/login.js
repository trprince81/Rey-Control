import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const entrarTrabajador = async () => {
    setError("");

    const { data, error } = await supabase
      .from("trabajadores")
      .select("*")
      .eq("nombre", nombre)
      .eq("pin", pin)
      .single();

    if (error || !data) {
      setError("Nombre o PIN incorrecto");
      return;
    }

    localStorage.setItem("trabajador", JSON.stringify(data));
    router.push("/trabajador");
  };

  const entrarAdmin = () => {
    if (pin === "1234") {
      router.push("/admin");
    } else {
      setError("PIN Admin incorrecto");
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <h1 style={styles.title}>Imperio S&D 👑</h1>

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

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={entrarTrabajador}>
          Entrar como Trabajador 👤
        </button>

        <button style={styles.button} onClick={entrarAdmin}>
          Entrar como Admin 👑
        </button>
      </div>
    </div>
  );
}

const styles = {
  background: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at center, #1a1a1a, #000)",
  },
  card: {
    background: "#111",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 0 40px gold",
    textAlign: "center",
    width: "320px",
  },
  title: {
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
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "10px",
    border: "none",
    background: "gold",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};

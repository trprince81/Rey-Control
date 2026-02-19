import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLoginTrabajador = async () => {
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

  const handleLoginAdmin = () => {
    if (pin === "1234") {
      router.push("/admin");
    } else {
      setError("PIN de admin incorrecto");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Imperio S&D 👑</h1>

        <input
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="PIN"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={handleLoginTrabajador}>
          Entrar como Trabajador 👤
        </button>

        <button style={styles.button} onClick={handleLoginAdmin}>
          Entrar como Admin 👑
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #000000, #1a1a1a)"
  },
  card: {
    background: "#111",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 0 40px gold",
    display: "flex",
    flexDirection: "column",
    width: "320px"
  },
  title: {
    color: "gold",
    textAlign: "center",
    marginBottom: "20px"
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "10px",
    border: "none"
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "gold",
    fontWeight: "bold",
    cursor: "pointer"
  },
  error: {
    color: "red",
    textAlign: "center"
  }
};

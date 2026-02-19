import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [modo, setModo] = useState("admin");
  const [pinAdmin, setPinAdmin] = useState("");
  const [nombre, setNombre] = useState("");
  const [pinTrabajador, setPinTrabajador] = useState("");

  async function entrarAdmin() {
    if (pinAdmin === "carolynsd") {
      router.push("/admin");
    } else {
      alert("PIN incorrecto ❌");
    }
  }

  async function entrarTrabajador() {
    if (!nombre || !pinTrabajador) {
      alert("Completa todos los campos");
      return;
    }

    const { data, error } = await supabase
      .from("trabajadores")
      .select("*")
      .eq("nombre", nombre)
      .eq("pin", pinTrabajador)
      .single();

    if (error || !data) {
      alert("Nombre o PIN incorrecto ❌");
      return;
    }

    localStorage.setItem("trabajador_id", data.id);
    localStorage.setItem("trabajador_nombre", data.nombre);

    router.push("/trabajador");
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.logo}>IMPERIO S&D 💰</h1>

        <div style={styles.tabs}>
          <button
            style={modo === "admin" ? styles.activeTab : styles.tab}
            onClick={() => setModo("admin")}
          >
            👑 Admin
          </button>
          <button
            style={modo === "trabajador" ? styles.activeTab : styles.tab}
            onClick={() => setModo("trabajador")}
          >
            👤 Trabajador
          </button>
        </div>

        {modo === "admin" && (
          <>
            <input
              type="password"
              placeholder="PIN Privado"
              value={pinAdmin}
              onChange={(e) => setPinAdmin(e.target.value)}
              style={styles.input}
            />
            <button onClick={entrarAdmin} style={styles.button}>
              Entrar al Imperio 👑
            </button>
          </>
        )}

        {modo === "trabajador" && (
          <>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="PIN"
              value={pinTrabajador}
              onChange={(e) => setPinTrabajador(e.target.value)}
              style={styles.input}
            />
            <button onClick={entrarTrabajador} style={styles.button}>
              Entrar al Sistema 👤
            </button>
          </>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at center, #1a1a1a, #000)",
  },

  card: {
    width: 380,
    padding: 40,
    borderRadius: 25,
    background: "linear-gradient(145deg, #111, #1e1e1e)",
    boxShadow: "0 0 60px rgba(255,215,0,0.3)",
    textAlign: "center",
    animation: "fadeIn 0.8s ease-in-out",
  },

  logo: {
    fontSize: 28,
    fontWeight: "bold",
    background: "linear-gradient(90deg, gold, #ffcc00, gold)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 25,
  },

  tabs: {
    display: "flex",
    marginBottom: 25,
  },

  tab: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 10,
    border: "1px solid #333",
    background: "#222",
    color: "#aaa",
    cursor: "pointer",
  },

  activeTab: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 10,
    border: "1px solid gold",
    background: "#111",
    color: "gold",
    cursor: "pointer",
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 12,
    border: "none",
    background: "#222",
    color: "white",
    fontSize: 14,
  },

  button: {
    width: "100%",
    padding: 14,
    borderRadius: 15,
    border: "none",
    background: "linear-gradient(90deg, gold, #ffcc00)",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
};

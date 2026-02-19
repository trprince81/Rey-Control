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
        <h1 style={styles.title}>Imperio S&D 💰</h1>

        <div style={styles.switch}>
          <button onClick={() => setModo("admin")} style={styles.tab}>
            Admin 👑
          </button>
          <button onClick={() => setModo("trabajador")} style={styles.tab}>
            Trabajador 👤
          </button>
        </div>

        {modo === "admin" && (
          <>
            <input
              type="password"
              placeholder="PIN Admin"
              value={pinAdmin}
              onChange={(e) => setPinAdmin(e.target.value)}
              style={styles.input}
            />

            <button onClick={entrarAdmin} style={styles.button}>
              Entrar como Admin 👑
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
              Entrar como Trabajador 👤
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
    background: "linear-gradient(135deg,#0f0f0f,#1c1c1c)",
  },
  card: {
    background: "#1a1a1a",
    padding: 30,
    borderRadius: 20,
    width: 350,
    textAlign: "center",
    boxShadow: "0 0 40px rgba(255,215,0,0.5)",
  },
  title: {
    color: "gold",
    marginBottom: 20,
  },
  switch: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    margin: 5,
    padding: 10,
    background: "#333",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    border: "none",
  },
  button: {
    width: "100%",
    padding: 12,
    background: "gold",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
  },
};

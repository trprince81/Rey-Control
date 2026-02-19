import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [modo, setModo] = useState(null);
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");

  async function loginTrabajador() {
    const { data, error } = await supabase
      .from("trabajadores")
      .select("*")
      .eq("nombre", nombre)
      .eq("pin", pin)
      .single();

    if (error || !data) {
      alert("Nombre o PIN incorrecto ❌");
      return;
    }

    // 🔥 AQUÍ SE GUARDA EL TRABAJADOR
    localStorage.setItem("trabajador_id", data.id);
    localStorage.setItem("trabajador_nombre", data.nombre);

    window.location.href = "/trabajador";
  }

  function loginAdmin() {
    if (pin === "1234") {
      window.location.href = "/admin";
    } else {
      alert("PIN Admin incorrecto ❌");
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Imperio S&D 👑</h1>

      {!modo && (
        <div style={styles.menu}>
          <button style={styles.btn} onClick={() => setModo("admin")}>
            👑 Admin
          </button>

          <button style={styles.btn} onClick={() => setModo("trabajador")}>
            👤 Trabajador
          </button>
        </div>
      )}

      {modo && (
        <div style={styles.box}>
          {modo === "trabajador" && (
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={styles.input}
            />
          )}

          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={styles.input}
          />

          <button
            style={styles.btn}
            onClick={modo === "admin" ? loginAdmin : loginTrabajador}
          >
            Entrar 🚀
          </button>

          <button
            style={{ ...styles.btn, background: "gray" }}
            onClick={() => setModo(null)}
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "black",
    color: "gold",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: "40px",
    fontSize: "32px",
  },
  menu: {
    display: "flex",
    gap: "20px",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "250px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },
  btn: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "gold",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

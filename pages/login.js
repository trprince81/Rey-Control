import { useState } from "react";
import { supabase } from "../lib/supabase";

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

  // 🔥 AQUÍ ESTÁ LO IMPORTANTE
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
    <div style={styles.fondo}>
      <div style={styles.overlay}></div>

      <div style={styles.container}>
        <h1 style={styles.title}>Imperio S&D 👑</h1>

        {!modo && (
          <div style={styles.menu}>
            <div style={styles.circle} onClick={() => setModo("admin")}>
              👑
              <span>Admin</span>
            </div>

            <div style={styles.circle} onClick={() => setModo("trabajador")}>
              👤
              <span>Trabajador</span>
            </div>

            <div style={styles.circle}>
              ⚙
              <span>Config</span>
            </div>
          </div>
        )}

        {modo && (
          <div style={styles.loginBox}>
            {modo === "trabajador" && (
              <input
                placeholder="Nombre"
                style={styles.input}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            )}

            <input
              placeholder="PIN"
              type="password"
              style={styles.input}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />

            <button
              style={styles.button}
              onClick={modo === "admin" ? loginAdmin : loginTrabajador}
            >
              Entrar 🚀
            </button>

            <button style={styles.volver} onClick={() => setModo(null)}>
              Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  fondo: {
    backgroundImage: "url('/01.JPG')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backdropFilter: "blur(8px)",
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  container: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    color: "gold",
  },

  title: {
    fontSize: "42px",
    marginBottom: "50px",
    textShadow: "0 0 20px gold, 0 0 40px orange",
  },

  menu: {
    display: "flex",
    gap: "40px",
  },

  circle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "linear-gradient(145deg, #FFD700, #FFA500)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 20px gold",
    transition: "0.3s",
  },

  loginBox: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "260px",
    margin: "auto",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    fontSize: "16px",
  },

  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(45deg, gold, orange)",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 15px gold",
  },

  volver: {
    background: "transparent",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

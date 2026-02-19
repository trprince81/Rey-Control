import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Trabajador() {
  const [trabajadorId, setTrabajadorId] = useState(null);
  const [montoPersonalizado, setMontoPersonalizado] = useState("");
  const [mensaje, setMensaje] = useState("");

  // ⚡ IMPORTANTE: aquí debes poner el ID real del trabajador logueado
  // Por ahora lo dejamos manual (luego lo hacemos automático con login)
  const ID_TRABAJADOR = localStorage.getItem("trabajador_id");

  const registrarVenta = async (monto) => {
    if (!ID_TRABAJADOR) {
      alert("No hay trabajador logueado");
      return;
    }

    const total_trabajador = monto * 0.35;
    const total_dueno = monto * 0.15;
    const total_socio = monto * 0.5;

    const { error } = await supabase.from("ventas").insert([
      {
        trabajador_id: ID_TRABAJADOR,
        precio: monto,
        total_trabajador,
        total_dueno,
        total_socio,
      },
    ]);

    if (error) {
      console.log(error);
      setMensaje("❌ Error guardando venta");
    } else {
      setMensaje("🔥 Venta registrada");
      new Audio("/pasta.mp3").play().catch(()=>{});
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Panel Trabajador 👑</h1>

      <div style={styles.buttons}>
        <button style={styles.btn} onClick={() => registrarVenta(120)}>
          15 Min - 120
        </button>

        <button style={styles.btn} onClick={() => registrarVenta(180)}>
          30 Min - 180
        </button>

        <button style={styles.btn} onClick={() => registrarVenta(260)}>
          1 Hora - 260
        </button>

        <div style={{ marginTop: 20 }}>
          <input
            type="number"
            placeholder="Monto personalizado"
            value={montoPersonalizado}
            onChange={(e) => setMontoPersonalizado(e.target.value)}
            style={styles.input}
          />

          <button
            style={styles.btn}
            onClick={() =>
              registrarVenta(parseFloat(montoPersonalizado))
            }
          >
            Registrar Personalizado
          </button>
        </div>

        <p style={{ marginTop: 20 }}>{mensaje}</p>
      </div>
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
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "32px",
    marginBottom: "30px",
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  btn: {
    padding: "15px",
    background: "gold",
    color: "black",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "none",
  },
};

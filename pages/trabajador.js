import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Trabajador() {
  const [totalClientes, setTotalClientes] = useState(0)
  const [trabajadorId, setTrabajadorId] = useState(null)

  useEffect(() => {
    const id = localStorage.getItem("trabajador_id")
    if (id) {
      setTrabajadorId(id)
      cargarClientes(id)
    }
  }, [])

  async function cargarClientes(id) {
    const { data, error } = await supabase
      .from("ventas")
      .select("*")
      .eq("trabajador_id", id)

    if (!error && data) {
      setTotalClientes(data.length)
    }
  }

  async function agregarCliente() {
    if (!trabajadorId) return

    const confirmar = confirm("¿Seguro que quieres agregar un cliente?")
    if (!confirmar) return

    const { error } = await supabase.from("ventas").insert([
      {
        trabajador_id: trabajadorId,
        precio: 0
      }
    ])

    if (!error) {
      cargarClientes(trabajadorId)
    } else {
      alert("Error agregando cliente")
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>Panel del Trabajador 👑</h1>

      <div style={styles.card}>
        <h2 style={styles.label}>Total de Clientes 👑</h2>

        <div style={styles.numero}>
          {totalClientes}
        </div>

        <button onClick={agregarCliente} style={styles.boton}>
          Agregar Cliente 💰
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: "white",
    fontFamily: "Arial"
  },
  titulo: {
    fontSize: "32px",
    marginBottom: "30px",
    color: "gold",
    textShadow: "0 0 20px orange"
  },
  card: {
    background: "rgba(0,0,0,0.6)",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 0 40px rgba(255,215,0,0.4)"
  },
  label: {
    fontSize: "22px",
    marginBottom: "20px",
    color: "#ffd700"
  },
  numero: {
    fontSize: "80px",
    fontWeight: "bold",
    marginBottom: "30px",
    background: "linear-gradient(45deg, gold, orange)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 25px gold"
  },
  boton: {
    padding: "15px 40px",
    fontSize: "18px",
    borderRadius: "40px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(45deg, gold, orange)",
    boxShadow: "0 0 25px gold",
    fontWeight: "bold",
    transition: "0.3s"
  }
}

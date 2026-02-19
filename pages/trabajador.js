import { useState, useEffect } from "react"

export default function PanelTrabajador() {
  const [totalClientes, setTotalClientes] = useState(0)

  const agregarCliente = () => {
    const nuevoTotal = totalClientes + 1
    setTotalClientes(nuevoTotal)

    // 🔊 Voz dominicana
    const audio = new Audio("/pasta.mp3")
    audio.play().catch(() => {})

    // Vibración si es celular
    if (navigator.vibrate) {
      navigator.vibrate(100)
    }
  }

  return (
    <div style={{ textAlign: "center", paddingTop: "60px" }}>

      {/* CONTADOR ANIMADO */}
      <h1
        style={{
          fontSize: "60px",
          fontWeight: "bold",
          background: "linear-gradient(90deg, #FFD700, #FFA500)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 20px rgba(255,215,0,0.7)",
          transition: "all 0.3s ease"
        }}
      >
        {totalClientes}
      </h1>

      <p style={{ color: "white", fontSize: "20px", marginBottom: "40px" }}>
        Total de Clientes 👑
      </p>

      {/* BOTÓN GALÁCTICO */}
      <button
        onClick={agregarCliente}
        style={{
          position: "relative",
          padding: "20px 50px",
          fontSize: "22px",
          fontWeight: "bold",
          borderRadius: "20px",
          border: "none",
          cursor: "pointer",
          color: "black",
          background: "linear-gradient(135deg, #FFD700, #FFB700, #FFA500)",
          boxShadow: "0 0 20px #FFD700, 0 0 40px rgba(255,215,0,0.6)",
          overflow: "hidden",
          transition: "0.2s"
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        Agregar Cliente 💰
      </button>

    </div>
  )
}

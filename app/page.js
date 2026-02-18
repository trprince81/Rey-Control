export default function Home() {
  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>👑 Rey Control</h1>
      <hr />

      <div style={{ marginTop: 20 }}>
        <button style={{ padding: 10, marginRight: 10 }}>
          📦 Inventario
        </button>

        <button style={{ padding: 10, marginRight: 10 }}>
          👥 Clientes
        </button>

        <button style={{ padding: 10, marginRight: 10 }}>
          💰 Ventas
        </button>

        <button style={{ padding: 10 }}>
          ⚙️ Configuración
        </button>
      </div>
    </div>
  )
}

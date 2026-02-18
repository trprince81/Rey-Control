import Link from "next/link"

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>👑 Rey Control</h1>
      <hr />

      <div style={{ marginTop: 20 }}>
        <Link href="/inventario">
          <button style={{ padding: 10, marginRight: 10 }}>
            🛠️ Lo que has hecho
          </button>
        </Link>

        <button style={{ padding: 10, marginRight: 10 }}>
          💰 Clientes
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

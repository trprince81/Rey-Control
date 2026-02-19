"use client"

import { useState } from "react"
import Link from "next/link"

export default function Home() {

  const [clientes, setClientes] = useState(7) // número simulado

  return (
    <div style={{ padding: 40 }}>
      <h1>👑 Rey Control</h1>
      <hr />

      <div style={{ marginTop: 20 }}>
        <Link href="/inventario">
          <button style={{ padding: 10, marginRight: 10 }}>
            🛠️💵 Lo que has hecho
          </button>
        </Link>

        <button style={{ padding: 10, marginRight: 10 }}>
          💰 Clientes ({clientes})
        </button>

        <button style={{ padding: 10, marginRight: 10 }}>
          📊 Ventas
        </button>

        <button style={{ padding: 10 }}>
          ⚙️ Configuración
        </button>
      </div>
    </div>
  )
}
pages/
   index.js
   trabajador.js
   admin.js
   login.js

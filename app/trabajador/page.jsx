"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function WorkerPanel() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [monto, setMonto] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(storedUser);

    if (parsed.role !== "trabajador") {
      router.push("/login");
      return;
    }

    setUser(parsed);
    fetchClientes(parsed.id);
  }, []);

  const fetchClientes = async (trabajadorId) => {
    const { data } = await supabase
      .from("ventas")
      .select("*")
      .eq("trabajador_id", trabajadorId)
      .order("created_at", { ascending: false });

    if (data) setClientes(data);
  };

  const agregarCliente = async () => {
    if (!monto) return alert("Ingresa un monto");

    const confirmacion = confirm("¿Seguro que deseas agregar este cliente?");
    if (!confirmacion) return;

    await supabase.from("ventas").insert([
      {
        trabajador_id: user.id,
        precio: Number(monto),
        estado: "pagado", // 🔥 Se guarda automáticamente como pagado
      },
    ]);

    setMonto("");
    fetchClientes(user.id);
  };

  const eliminarCliente = async (id) => {
    const confirmacion = confirm("¿Eliminar este cliente?");
    if (!confirmacion) return;

    await supabase.from("ventas").delete().eq("id", id);
    fetchClientes(user.id);
  };

  // 🔥 Solo suma los que estén pagados
  const totalGanado = clientes
    .filter((c) => c.estado === "pagado")
    .reduce((acc, c) => acc + Number(c.precio) * 0.35, 0);

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: 40,
        fontFamily: "Segoe UI",
      }}
    >
      {/* PERFIL */}
      <div
        style={{
          background: "linear-gradient(135deg,#7f00ff,#e100ff)",
          padding: 20,
          borderRadius: 20,
          marginBottom: 30,
        }}
      >
        <h2>{user.nombre.toUpperCase()}</h2>
        <p>Panel de Trabajo</p>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          style={{
            marginTop: 10,
            background: "#ff004c",
            border: "none",
            padding: "8px 15px",
            borderRadius: 6,
            color: "white",
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* TOTAL */}
      <div
        style={{
          background: "linear-gradient(90deg,#ffd700,#ffae00)",
          padding: 15,
          borderRadius: 12,
          marginBottom: 30,
          color: "black",
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        💰 Total Ganado (35%): ${totalGanado.toFixed(2)}
      </div>

      {/* AGREGAR CLIENTE */}
      <h3>Agregar Cliente</h3>
      <div style={{ marginBottom: 30 }}>
        <input
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "none",
            marginRight: 10,
          }}
        />
        <button
          onClick={agregarCliente}
          style={{
            padding: 10,
            background: "#ffd700",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Agregar
        </button>
      </div>

      {/* LISTA CLIENTES */}
      <h3>Mis Clientes</h3>

      {clientes.map((c) => (
        <div
          key={c.id}
          style={{
            background: "#111",
            padding: 15,
            borderRadius: 12,
            marginBottom: 15,
            border: "1px solid #7f00ff",
          }}
        >
          <p>Monto: ${c.precio}</p>
          <p style={{ color: "#00ff88", fontWeight: "bold" }}>
            Estado: {c.estado}
          </p>

          <button
            style={{
              background: "#ff0033",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
            onClick={() => eliminarCliente(c.id)}
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}

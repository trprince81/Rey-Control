"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function TrabajadorPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.role !== "trabajador") {
      router.push("/login");
      return;
    }

    setUser(parsedUser);
    fetchClientes(parsedUser.id);
  }, []);

  const fetchClientes = async (trabajadorId) => {
    const { data } = await supabase
      .from("ventas")
      .select("*")
      .eq("trabajador_id", trabajadorId);

    if (data) setClientes(data);
  };

  const agregarCliente = async () => {
    if (!precio) return alert("Ingresa el monto");

    if (!confirm("¿Seguro que deseas agregar este cliente?")) return;

    await supabase.from("ventas").insert([
      {
        precio: Number(precio),
        trabajador_id: user.id,
      },
    ]);

    setPrecio("");
    fetchClientes(user.id);
  };

  const eliminarCliente = async (id) => {
    if (!confirm("¿Eliminar este cliente?")) return;

    await supabase.from("ventas").delete().eq("id", id);
    fetchClientes(user.id);
  };

  if (!user) return null;

  const total = clientes.reduce((acc, c) => acc + Number(c.precio), 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f0f0f,#1a1a1a)",
        color: "white",
        padding: 40,
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* PERFIL ESTILO CONSOLA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 40,
          padding: 25,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 20,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#6a00ff,#b000ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: "bold",
          }}
        >
          {user.nombre.charAt(0).toUpperCase()}
        </div>

        <div>
          <p style={{ margin: 0, color: "#aaa" }}>USUARIO ACTIVO</p>
          <h1 style={{ margin: 0 }}>{user.nombre.toUpperCase()}</h1>
        </div>
      </div>

      {/* RESUMEN */}
      <div style={{ marginBottom: 30 }}>
        <h2>Total Clientes: {clientes.length}</h2>
        <h2>Total Generado: ${total}</h2>
      </div>

      {/* AGREGAR CLIENTE */}
      <div style={{ marginBottom: 30 }}>
        <input
          placeholder="Monto pagado"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          style={{
            padding: 10,
            marginRight: 10,
            borderRadius: 6,
            border: "none",
          }}
        />

        <button
          onClick={agregarCliente}
          style={{
            padding: 10,
            background: "#6a00ff",
            border: "none",
            color: "white",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Agregar Cliente
        </button>
      </div>

      {/* LISTA CLIENTES */}
      {clientes.map((c) => (
        <div
          key={c.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
            marginBottom: 10,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 10,
          }}
        >
          <span>${c.precio}</span>

          <button
            onClick={() => eliminarCliente(c.id)}
            style={{
              background: "#8b0000",
              border: "none",
              color: "white",
              padding: 5,
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Eliminar
          </button>
        </div>
      ))}

      <button
        onClick={() => {
          localStorage.removeItem("user");
          router.push("/login");
        }}
        style={{
          marginTop: 30,
          background: "#800020",
          border: "none",
          padding: 12,
          color: "white",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

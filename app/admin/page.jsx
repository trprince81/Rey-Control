"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPin, setNuevoPin] = useState("");
  const [nuevoPinAdmin, setNuevoPinAdmin] = useState("");
  const [modoClaro, setModoClaro] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return router.push("/login");

    const parsed = JSON.parse(storedUser);
    if (parsed.role !== "admin") return router.push("/login");

    setUser(parsed);
    fetchClientes();
    fetchTrabajadores();

    const tema = localStorage.getItem("tema");
    if (tema === "claro") setModoClaro(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("tema", modoClaro ? "claro" : "oscuro");
  }, [modoClaro]);

  const fetchClientes = async () => {
    const { data } = await supabase
      .from("ventas")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setClientes(data);
  };

  const fetchTrabajadores = async () => {
    const { data } = await supabase
      .from("trabajadores")
      .select("*")
      .eq("role", "trabajador");

    if (data) setTrabajadores(data);
  };

  const eliminarCliente = async (id) => {
    if (!confirm("¿Eliminar cliente?")) return;
    await supabase.from("ventas").delete().eq("id", id);
    fetchClientes();
  };

  const agregarTrabajador = async () => {
    if (!nuevoNombre || !nuevoPin) return alert("Completa los campos");

    await supabase.from("trabajadores").insert([
      { nombre: nuevoNombre, pin: nuevoPin, role: "trabajador" },
    ]);

    setNuevoNombre("");
    setNuevoPin("");
    fetchTrabajadores();
  };

  const cambiarPinAdmin = async () => {
    if (!nuevoPinAdmin) return alert("Ingresa nuevo PIN");

    await supabase
      .from("trabajadores")
      .update({ pin: nuevoPinAdmin })
      .eq("id", user.id);

    alert("PIN actualizado");
    setNuevoPinAdmin("");
  };

  const totalIngresos = clientes.reduce(
    (acc, c) => acc + Number(c.precio),
    0
  );

  const totalTrabajador = totalIngresos * 0.35;
  const totalDueno = totalIngresos * 0.15;
  const totalSocio = totalIngresos * 0.5;

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: modoClaro
          ? "#f4f4f4"
          : "linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.9)), url('/01.JPG')",
        backgroundSize: "cover",
        color: modoClaro ? "black" : "white",
        fontFamily: "Segoe UI",
        padding: 40,
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ color: "#d4af37" }}>Imperio S&D 👑</h1>

        <div style={{ display: "flex", gap: 15, marginTop: 15 }}>
          <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          <button onClick={() => setActiveTab("clientes")}>Clientes</button>
          <button onClick={() => setActiveTab("usuarios")}>Usuarios</button>
          <button onClick={() => setActiveTab("config")}>Configuración</button>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          style={{
            background: "#ff004c",
            border: "none",
            padding: "8px 14px",
            color: "white",
            borderRadius: 6,
            cursor: "pointer",
            marginTop: 15,
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <CardBig title="Ingresos Totales" value={`$${totalIngresos.toFixed(2)}`} />
            <CardSmall title="Dueño (15%)" value={`$${totalDueno.toFixed(2)}`} />
            <CardSmall title="Socio (50%)" value={`$${totalSocio.toFixed(2)}`} />
          </div>
        </>
      )}

      {/* CLIENTES */}
      {activeTab === "clientes" &&
        clientes.map((c) => (
          <div key={c.id} style={{ marginTop: 15 }}>
            ${c.precio} - {c.estado}
            <button onClick={() => eliminarCliente(c.id)}>Eliminar</button>
          </div>
        ))}

      {/* USUARIOS */}
      {activeTab === "usuarios" && (
        <>
          <h3>Agregar Trabajador</h3>
          <input
            placeholder="Nombre"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
          <input
            placeholder="PIN"
            value={nuevoPin}
            onChange={(e) => setNuevoPin(e.target.value)}
          />
          <button onClick={agregarTrabajador}>Agregar</button>
        </>
      )}

      {/* CONFIG */}
      {activeTab === "config" && (
        <>
          <h3>Cambiar PIN</h3>
          <input
            placeholder="Nuevo PIN"
            value={nuevoPinAdmin}
            onChange={(e) => setNuevoPinAdmin(e.target.value)}
          />
          <button onClick={cambiarPinAdmin}>Actualizar PIN</button>

          <h3 style={{ marginTop: 30 }}>Modo</h3>
          <button onClick={() => setModoClaro(!modoClaro)}>
            {modoClaro ? "Modo Oscuro" : "Modo Claro"}
          </button>
        </>
      )}
    </div>
  );
}

const CardBig = ({ title, value }) => (
  <div
    style={{
      background: "linear-gradient(90deg,#ffd700,#ffae00)",
      padding: 25,
      borderRadius: 15,
      minWidth: 260,
      color: "black",
      fontWeight: "bold",
    }}
  >
    <h3>{title}</h3>
    <h1>{value}</h1>
  </div>
);

const CardSmall = ({ title, value }) => (
  <div
    style={{
      background: "rgba(0,0,0,0.6)",
      padding: 15,
      borderRadius: 10,
      minWidth: 180,
    }}
  >
    <h4>{title}</h4>
    <h2 style={{ color: "#d4af37" }}>{value}</h2>
  </div>
);

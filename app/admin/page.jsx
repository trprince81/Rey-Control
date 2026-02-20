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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      router.push("/login");
      return;
    }

    setUser(parsedUser);
    fetchClientes();
    fetchTrabajadores();
  }, []);

  const fetchClientes = async () => {
    const { data } = await supabase.from("ventas").select("*");
    if (data) setClientes(data);
  };

  const fetchTrabajadores = async () => {
    const { data } = await supabase.from("trabajadores").select("*");
    if (data) setTrabajadores(data);
  };

  const eliminarCliente = async (id) => {
    if (!confirm("¿Eliminar cliente?")) return;
    await supabase.from("ventas").delete().eq("id", id);
    fetchClientes();
  };

  const eliminarTrabajador = async (id) => {
    if (!confirm("¿Eliminar trabajador?")) return;
    await supabase.from("trabajadores").delete().eq("id", id);
    fetchTrabajadores();
  };

  const agregarTrabajador = async () => {
    if (!nuevoNombre || !nuevoPin) {
      alert("Completa nombre y PIN");
      return;
    }

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

  if (!user) return null;

  const getBackground = () => {
    switch (activeTab) {
      case "dashboard":
        return "/bg-dashboard.jpg";
      case "clientes":
        return "/bg-clientes.jpg";
      case "usuarios":
        return "/bg-usuarios.jpg";
      case "config":
        return "/bg-config.jpg";
      default:
        return "/bg-dashboard.jpg";
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        minHeight: "100vh",
        backgroundImage: `url(${getBackground()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "white",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          zIndex: 0,
        }}
      />

      <div style={{ display: "flex", width: "100%", position: "relative", zIndex: 1 }}>

        {/* Sidebar */}
        <div style={{ width: 260, padding: 40, background: "rgba(0,0,0,0.8)" }}>
          <h2 style={{ color: "#d4af37" }}>Imperio S&D 👑</h2>

          <div style={menuItem(activeTab === "dashboard")} onClick={() => setActiveTab("dashboard")}>Dashboard</div>
          <div style={menuItem(activeTab === "clientes")} onClick={() => setActiveTab("clientes")}>Clientes</div>
          <div style={menuItem(activeTab === "usuarios")} onClick={() => setActiveTab("usuarios")}>Usuarios</div>
          <div style={menuItem(activeTab === "config")} onClick={() => setActiveTab("config")}>Configuración</div>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              router.push("/login");
            }}
            style={{
              marginTop: 30,
              background: "#800020",
              border: "none",
              padding: 10,
              width: "100%",
              color: "white",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: 60 }}>

          {/* PERFIL PS5 */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 40,
            padding: 20,
            background: "rgba(0,0,0,0.6)",
            borderRadius: 15
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#d4af37,#8b7500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: "bold",
              color: "#000"
            }}>
              {user.nombre.charAt(0).toUpperCase()}
            </div>

            <div>
              <p style={{ margin: 0, color: "#aaa" }}>BIENVENIDO</p>
              <h1 style={{ margin: 0, color: "#d4af37" }}>
                {user.nombre.toUpperCase()}
              </h1>
            </div>
          </div>

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div style={{ display: "flex", gap: 20 }}>
              <Card title="Clientes" value={clientes.length} />
              <Card title="Ingresos" value={`$${totalIngresos}`} />
              <Card title="Trabajadores" value={trabajadores.length} />
            </div>
          )}

          {/* CLIENTES */}
          {activeTab === "clientes" &&
            clientes.map((c) => (
              <Line key={c.id}>
                ${c.precio}
                <DeleteBtn onClick={() => eliminarCliente(c.id)} />
              </Line>
            ))}

          {/* USUARIOS */}
          {activeTab === "usuarios" && (
            <>
              <h3>Agregar Trabajador</h3>
              <input placeholder="Nombre" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} />
              <input placeholder="PIN" value={nuevoPin} onChange={(e) => setNuevoPin(e.target.value)} />
              <button onClick={agregarTrabajador}>Agregar</button>

              {trabajadores.map((t) => (
                <Line key={t.id}>
                  {t.nombre}
                  <DeleteBtn onClick={() => eliminarTrabajador(t.id)} />
                </Line>
              ))}
            </>
          )}

          {/* CONFIG */}
          {activeTab === "config" && (
            <>
              <h3>Cambiar mi PIN</h3>
              <input
                placeholder="Nuevo PIN"
                value={nuevoPinAdmin}
                onChange={(e) => setNuevoPinAdmin(e.target.value)}
              />
              <button onClick={cambiarPinAdmin}>Actualizar PIN</button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

/* ESTILOS */

const menuItem = (active) => ({
  marginBottom: 15,
  cursor: "pointer",
  color: active ? "#d4af37" : "#aaa",
});

const Card = ({ title, value }) => (
  <div style={{ background: "rgba(0,0,0,0.6)", padding: 20, borderRadius: 10 }}>
    <h3>{title}</h3>
    <h1>{value}</h1>
  </div>
);

const Line = ({ children }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: 10, marginTop: 10, background: "rgba(0,0,0,0.6)", borderRadius: 8 }}>
    {children}
  </div>
);

const DeleteBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ background: "#8b0000", color: "white", border: "none", padding: 5 }}>
    Eliminar
  </button>
);

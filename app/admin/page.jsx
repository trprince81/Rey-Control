"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [ventas, setVentas] = useState([]);
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
    fetchVentas();
    fetchTrabajadores();
  }, []);

  const fetchVentas = async () => {
    const { data } = await supabase.from("ventas").select("*");
    if (data) setVentas(data);
  };

  const fetchTrabajadores = async () => {
    const { data } = await supabase.from("trabajadores").select("*");
    if (data) setTrabajadores(data);
  };

  const eliminarVenta = async (id) => {
    if (!confirm("¿Eliminar venta?")) return;
    await supabase.from("ventas").delete().eq("id", id);
    fetchVentas();
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

  const totalIngresos = ventas.reduce(
    (acc, v) => acc + Number(v.precio),
    0
  );

  if (!user) return null;

  const getBackgroundImage = () => {
    switch (activeTab) {
      case "dashboard":
        return "/bg-dashboard.jpg";
      case "ventas":
        return "/bg-ventas.jpg";
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
        display: "flex",
        minHeight: "100vh",
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "white",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Overlay oscuro */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          zIndex: 0,
        }}
      />

      {/* Contenido encima */}
      <div style={{ display: "flex", width: "100%", position: "relative", zIndex: 1 }}>

        {/* Sidebar */}
        <div style={{ width: 260, padding: 40, background: "rgba(0,0,0,0.8)" }}>
          <h2 style={{ color: "#d4af37" }}>Imperio S&D 👑</h2>

          <div style={menuItem(activeTab === "dashboard")} onClick={() => setActiveTab("dashboard")}>Dashboard</div>
          <div style={menuItem(activeTab === "ventas")} onClick={() => setActiveTab("ventas")}>Ventas</div>
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
        <div style={{ flex: 1, padding: 50 }}>

          <h1 style={{ color: "#d4af37" }}>
            BIENVENIDO {user.nombre.toUpperCase()}
          </h1>

          {activeTab === "dashboard" && (
            <div style={{ display: "flex", gap: 20 }}>
              <Card title="Ventas" value={ventas.length} />
              <Card title="Ingresos" value={`$${totalIngresos}`} />
              <Card title="Trabajadores" value={trabajadores.length} />
            </div>
          )}

          {activeTab === "ventas" &&
            ventas.map((v) => (
              <Line key={v.id}>
                ${v.precio}
                <DeleteBtn onClick={() => eliminarVenta(v.id)} />
              </Line>
            ))}

          {activeTab === "usuarios" && (
            <>
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

          {activeTab === "config" && (
            <>
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

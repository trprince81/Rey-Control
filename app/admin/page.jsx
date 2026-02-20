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

  const [modoClaro, setModoClaro] = useState(false);
  const [colorTema, setColorTema] = useState("#d4af37");

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
    if (!confirm("¿Eliminar esta venta?")) return;
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

  const backgroundColor = modoClaro ? "#f5f5f5" : "#0a0a0a";
  const textColor = modoClaro ? "#000" : "#fff";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: backgroundColor,
        color: textColor,
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 260,
          background: modoClaro ? "#ddd" : "#111",
          padding: 40,
        }}
      >
        <h2 style={{ color: colorTema }}>Imperio S&D 👑</h2>

        <div style={menuItem(activeTab === "dashboard", colorTema)} onClick={() => setActiveTab("dashboard")}>Dashboard</div>
        <div style={menuItem(activeTab === "ventas", colorTema)} onClick={() => setActiveTab("ventas")}>Ventas</div>
        <div style={menuItem(activeTab === "usuarios", colorTema)} onClick={() => setActiveTab("usuarios")}>Usuarios</div>
        <div style={menuItem(activeTab === "config", colorTema)} onClick={() => setActiveTab("config")}>Configuración</div>

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

      {/* Contenido */}
      <div style={{ flex: 1, padding: 50 }}>

        <h1 style={{ color: colorTema }}>
          BIENVENIDO {user.nombre.toUpperCase()}
        </h1>

        {activeTab === "dashboard" && (
          <div style={{ display: "flex", gap: 20 }}>
            <Card title="Ventas" value={ventas.length} />
            <Card title="Ingresos" value={`$${totalIngresos}`} color={colorTema} />
            <Card title="Trabajadores" value={trabajadores.length} />
          </div>
        )}

        {activeTab === "ventas" && (
          <>
            <h2>Ventas</h2>
            {ventas.map((v) => (
              <Line key={v.id}>
                ${v.precio}
                <DeleteBtn onClick={() => eliminarVenta(v.id)} />
              </Line>
            ))}
          </>
        )}

        {activeTab === "usuarios" && (
          <>
            <h2>Agregar Trabajador</h2>

            <input placeholder="Nombre" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} />
            <input placeholder="PIN" value={nuevoPin} onChange={(e) => setNuevoPin(e.target.value)} />
            <button onClick={agregarTrabajador}>Agregar</button>

            <h2>Lista</h2>
            {trabajadores.map((t) => (
              <Line key={t.id}>
                {t.nombre} ({t.role})
                <DeleteBtn onClick={() => eliminarTrabajador(t.id)} />
              </Line>
            ))}
          </>
        )}

        {activeTab === "config" && (
          <>
            <h2>Configuración</h2>

            <h3>Cambiar mi PIN</h3>
            <input
              placeholder="Nuevo PIN"
              value={nuevoPinAdmin}
              onChange={(e) => setNuevoPinAdmin(e.target.value)}
            />
            <button onClick={cambiarPinAdmin}>Actualizar PIN</button>

            <h3>Modo Visual</h3>
            <button onClick={() => setModoClaro(!modoClaro)}>
              {modoClaro ? "Modo Oscuro" : "Modo Claro"}
            </button>

            <h3>Cambiar Color del Tema</h3>
            <button onClick={() => setColorTema("#d4af37")}>Dorado</button>
            <button onClick={() => setColorTema("#9b59b6")}>Morado</button>
            <button onClick={() => setColorTema("#3498db")}>Azul</button>

            <h3>Información del Sistema</h3>
            <p>Total Ventas: {ventas.length}</p>
            <p>Total Trabajadores: {trabajadores.length}</p>
            <p>Versión: 1.0 Imperio</p>
          </>
        )}
      </div>
    </div>
  );
}

/* COMPONENTES */

const menuItem = (active, color) => ({
  marginBottom: 15,
  cursor: "pointer",
  color: active ? color : "gray",
});

const Card = ({ title, value, color }) => (
  <div style={{ background: "#1c1c1c", padding: 20, borderRadius: 10 }}>
    <h3>{title}</h3>
    <h1 style={{ color: color || "white" }}>{value}</h1>
  </div>
);

const Line = ({ children }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: 10, marginTop: 10, background: "#1c1c1c", borderRadius: 8 }}>
    {children}
  </div>
);

const DeleteBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ background: "#8b0000", color: "white", border: "none", padding: 5 }}>
    Eliminar
  </button>
);

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
    if (!confirm("¿Seguro que deseas eliminar esta venta?")) return;
    await supabase.from("ventas").delete().eq("id", id);
    fetchVentas();
  };

  const eliminarTrabajador = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este trabajador?")) return;
    await supabase.from("trabajadores").delete().eq("id", id);
    fetchTrabajadores();
  };

  const agregarTrabajador = async () => {
    if (!nuevoNombre || !nuevoPin) {
      alert("Completa nombre y PIN");
      return;
    }

    await supabase.from("trabajadores").insert([
      {
        nombre: nuevoNombre,
        pin: nuevoPin,
        role: "trabajador",
      },
    ]);

    setNuevoNombre("");
    setNuevoPin("");
    fetchTrabajadores();
  };

  const totalIngresos = ventas.reduce(
    (acc, v) => acc + Number(v.precio),
    0
  );

  if (!user) return null;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #1a1a1a, #0a0a0a 70%)",
        color: "white",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          background: "#111",
          padding: "40px 25px",
          borderRight: "1px solid #222",
        }}
      >
        <h2 style={{ color: "#d4af37", marginBottom: "50px" }}>
          Imperio S&D 👑
        </h2>

        <div style={menuItem(activeTab === "dashboard")} onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </div>
        <div style={menuItem(activeTab === "ventas")} onClick={() => setActiveTab("ventas")}>
          Ventas
        </div>
        <div style={menuItem(activeTab === "usuarios")} onClick={() => setActiveTab("usuarios")}>
          Usuarios
        </div>
        <div style={menuItem(activeTab === "config")} onClick={() => setActiveTab("config")}>
          Configuración
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          style={{
            marginTop: 50,
            background: "#800020",
            border: "none",
            padding: 12,
            width: "100%",
            color: "white",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, padding: 60 }}>

        {/* Perfil */}
        <div style={profileBox}>
          <div style={avatarStyle}>
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
          <div style={{ display: "flex", gap: 30 }}>
            <div style={cardStyle}>
              <h3>Total Ventas</h3>
              <h1>{ventas.length}</h1>
            </div>
            <div style={cardStyle}>
              <h3>Ingresos</h3>
              <h1 style={{ color: "#d4af37" }}>${totalIngresos}</h1>
            </div>
            <div style={cardStyle}>
              <h3>Trabajadores</h3>
              <h1>{trabajadores.length}</h1>
            </div>
          </div>
        )}

        {/* VENTAS */}
        {activeTab === "ventas" && (
          <>
            <h2>Ventas</h2>
            {ventas.map((venta) => (
              <div key={venta.id} style={cardLine}>
                <span>${venta.precio}</span>
                <button onClick={() => eliminarVenta(venta.id)} style={deleteBtn}>
                  Eliminar
                </button>
              </div>
            ))}
          </>
        )}

        {/* USUARIOS */}
        {activeTab === "usuarios" && (
          <>
            <h2>Agregar Trabajador</h2>

            <div style={{ marginBottom: 20 }}>
              <input
                placeholder="Nombre"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="PIN"
                value={nuevoPin}
                onChange={(e) => setNuevoPin(e.target.value)}
                style={inputStyle}
              />
              <button onClick={agregarTrabajador} style={addBtn}>
                Agregar
              </button>
            </div>

            <h2>Lista de Trabajadores</h2>
            {trabajadores.map((t) => (
              <div key={t.id} style={cardLine}>
                <span>{t.nombre} ({t.role})</span>
                <button onClick={() => eliminarTrabajador(t.id)} style={deleteBtn}>
                  Eliminar
                </button>
              </div>
            ))}
          </>
        )}

        {/* CONFIG */}
        {activeTab === "config" && (
          <h2>Configuración próximamente...</h2>
        )}

      </div>
    </div>
  );
}

/* ESTILOS */

const menuItem = (active) => ({
  marginBottom: 22,
  color: active ? "#d4af37" : "#aaa",
  cursor: "pointer",
});

const cardStyle = {
  flex: 1,
  background: "#1c1c1c",
  padding: 30,
  borderRadius: 15,
  border: "1px solid #222",
};

const cardLine = {
  display: "flex",
  justifyContent: "space-between",
  padding: 15,
  background: "#1c1c1c",
  marginTop: 10,
  borderRadius: 10,
  border: "1px solid #222",
};

const deleteBtn = {
  background: "#8b0000",
  border: "none",
  padding: "6px 12px",
  color: "white",
  borderRadius: 6,
  cursor: "pointer",
};

const addBtn = {
  background: "#d4af37",
  border: "none",
  padding: "8px 14px",
  marginLeft: 10,
  color: "black",
  borderRadius: 6,
  cursor: "pointer",
};

const inputStyle = {
  padding: 8,
  marginRight: 10,
  borderRadius: 6,
  border: "1px solid #333",
  background: "#111",
  color: "white",
};

const profileBox = {
  display: "flex",
  alignItems: "center",
  gap: 25,
  marginBottom: 50,
  padding: 25,
  background: "#151515",
  borderRadius: 20,
  border: "1px solid #222",
};

const avatarStyle = {
  width: 80,
  height: 80,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #d4af37, #8b7500)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 30,
  fontWeight: "bold",
  color: "#000",
};

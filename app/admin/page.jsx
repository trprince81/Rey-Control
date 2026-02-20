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
        display: "flex",
        minHeight: "100vh",
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)),
          url(${getBackground()})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "white",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: 260,
          padding: 40,
          background: "rgba(0,0,0,0.85)",
        }}
      >
        <h2 style={{ color: "#d4af37" }}>Imperio S&D 👑</h2>

        <div style={menuItem(activeTab === "dashboard")} onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </div>

        <div style={menuItem(activeTab === "clientes")} onClick={() => setActiveTab("clientes")}>
          Clientes
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
            marginTop: 30,
            background: "#800020",
            border: "none",
            padding: 12,
            width: "100%",
            color: "white",
            cursor: "pointer",
            borderRadius: 6,
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 60 }}>

        {/* PERFIL ESTILO PS5 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 40,
            padding: 25,
            background: "rgba(0,0,0,0.6)",
            borderRadius: 15,
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#d4af37,#8b7500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 35,
              fontWeight: "bold",
              color: "#000",
            }}
          >
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

              <button onClick={agregarTrabajador} style={goldButton}>
                Agregar
              </button>
            </div>

            {trabajadores.map((t) => (
              <Line key={t.id}>
                {t.nombre}
                <DeleteBtn onClick={() => eliminarTrabajador(t.id)} />
              </Line>
            ))}
          </>
        )}

        {/* CONFIGURACIÓN COMPLETA */}
        {activeTab === "config" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>

            <div
              style={{
                background: "rgba(0,0,0,0.6)",
                padding: 25,
                borderRadius: 15,
              }}
            >
              <h2 style={{ color: "#d4af37" }}>Resumen del Imperio 👑</h2>
              <p>Total Clientes: {clientes.length}</p>
              <p>Total Trabajadores: {trabajadores.length}</p>
              <p>Ingresos Totales: ${totalIngresos}</p>
            </div>

            <div
              style={{
                background: "rgba(0,0,0,0.6)",
                padding: 25,
                borderRadius: 15,
              }}
            >
              <h3 style={{ color: "#d4af37" }}>Cambiar mi PIN</h3>

              <input
                placeholder="Nuevo PIN"
                value={nuevoPinAdmin}
                onChange={(e) => setNuevoPinAdmin(e.target.value)}
                style={inputStyle}
              />

              <button onClick={cambiarPinAdmin} style={goldButton}>
                Actualizar PIN
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

/* ESTILOS */

const menuItem = (active) => ({
  marginBottom: 18,
  cursor: "pointer",
  color: active ? "#d4af37" : "#aaa",
  fontWeight: active ? "bold" : "normal",
});

const Card = ({ title, value }) => (
  <div
    style={{
      background: "rgba(0,0,0,0.6)",
      padding: 25,
      borderRadius: 12,
      minWidth: 200,
    }}
  >
    <h3>{title}</h3>
    <h1>{value}</h1>
  </div>
);

const Line = ({ children }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: 12,
      marginTop: 12,
      background: "rgba(0,0,0,0.6)",
      borderRadius: 8,
    }}
  >
    {children}
  </div>
);

const DeleteBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: "#8b0000",
      color: "white",
      border: "none",
      padding: 6,
      borderRadius: 4,
      cursor: "pointer",
    }}
  >
    Eliminar
  </button>
);

const inputStyle = {
  padding: 10,
  marginRight: 10,
  borderRadius: 6,
  border: "none",
  marginBottom: 10,
};

const goldButton = {
  padding: 10,
  background: "#d4af37",
  border: "none",
  color: "black",
  fontWeight: "bold",
  cursor: "pointer",
  borderRadius: 6,
};

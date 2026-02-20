"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ventas, setVentas] = useState([]);

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
  }, []);

  const fetchVentas = async () => {
    const { data } = await supabase.from("ventas").select("*");
    if (data) setVentas(data);
  };

  const eliminarVenta = async (id) => {
    const confirmacion = confirm("¿Seguro que deseas eliminar esta venta?");
    if (!confirmacion) return;

    await supabase.from("ventas").delete().eq("id", id);
    fetchVentas();
  };

  const totalIngresos = ventas.reduce((acc, v) => acc + Number(v.precio), 0);

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
          background: "linear-gradient(180deg, #111, #0d0d0d)",
          padding: "40px 25px",
          borderRight: "1px solid #222",
          boxShadow: "0 0 25px rgba(212,175,55,0.08)",
        }}
      >
        <h2
          style={{
            color: "#d4af37",
            fontSize: "22px",
            marginBottom: "50px",
            textShadow: "0 0 15px rgba(212,175,55,0.6)",
          }}
        >
          Imperio S&D 👑
        </h2>

        <div style={menuStyle}>Dashboard</div>
        <div style={menuStyle}>Ventas</div>
        <div style={menuStyle}>Usuarios</div>
        <div style={menuStyle}>Configuración</div>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          style={{
            marginTop: 50,
            background: "linear-gradient(90deg, #800020, #a00030)",
            border: "none",
            padding: 12,
            width: "100%",
            color: "white",
            borderRadius: 8,
            cursor: "pointer",
            boxShadow: "0 0 15px rgba(160,0,48,0.6)",
            transition: "0.3s",
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, padding: 60 }}>
        <h1 style={{ marginBottom: 40 }}>
          Bienvenido,{" "}
          <span
            style={{
              color: "#d4af37",
              textShadow: "0 0 15px rgba(212,175,55,0.6)",
            }}
          >
            {user.nombre}
          </span>
        </h1>

        {/* Cards */}
        <div style={{ display: "flex", gap: 30, marginBottom: 50 }}>
          <div style={cardStyle}>
            <h3 style={{ color: "#aaa" }}>Total Ventas</h3>
            <h1 style={{ fontSize: 40 }}>{ventas.length}</h1>
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: "#aaa" }}>Ingresos Totales</h3>
            <h1
              style={{
                fontSize: 40,
                color: "#d4af37",
                textShadow: "0 0 15px rgba(212,175,55,0.6)",
              }}
            >
              ${totalIngresos}
            </h1>
          </div>
        </div>

        {/* Lista Ventas */}
        <h2 style={{ marginBottom: 20 }}>Ventas Registradas</h2>

        {ventas.length === 0 ? (
          <p style={{ color: "#777" }}>No hay ventas registradas</p>
        ) : (
          ventas.map((venta) => (
            <div key={venta.id} style={ventaCardStyle}>
              <div>
                <p>
                  Monto:{" "}
                  <span style={{ color: "#d4af37" }}>
                    ${venta.precio}
                  </span>
                </p>
              </div>

              <button
                onClick={() => eliminarVenta(venta.id)}
                style={{
                  background: "#8b0000",
                  border: "none",
                  padding: "6px 14px",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: 6,
                  boxShadow: "0 0 10px rgba(139,0,0,0.6)",
                }}
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* Estilos reutilizables */

const menuStyle = {
  marginBottom: 22,
  color: "#aaa",
  cursor: "pointer",
  transition: "0.3s",
};

const cardStyle = {
  flex: 1,
  background: "linear-gradient(145deg, #1c1c1c, #151515)",
  padding: 30,
  borderRadius: 15,
  border: "1px solid #222",
  boxShadow: "0 0 25px rgba(0,0,0,0.6)",
};

const ventaCardStyle = {
  background: "linear-gradient(145deg, #1c1c1c, #151515)",
  padding: 20,
  borderRadius: 12,
  marginBottom: 15,
  border: "1px solid #222",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 0 15px rgba(0,0,0,0.5)",
};

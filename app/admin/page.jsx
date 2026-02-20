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
    if (!confirm("¿Seguro que quieres eliminar esta venta?")) return;
    await supabase.from("ventas").delete().eq("id", id);
    fetchVentas();
  };

  const totalIngresos = ventas.reduce((acc, v) => acc + Number(v.precio), 0);

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", color: "white" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "240px",
        background: "#111",
        padding: "30px 20px",
        borderRight: "1px solid #222"
      }}>
        <h2 style={{ color: "#d4af37", marginBottom: "40px" }}>
          Imperio S&D 👑
        </h2>

        <p style={{ marginBottom: 20, color: "#aaa" }}>Dashboard</p>
        <p style={{ marginBottom: 20, color: "#aaa" }}>Ventas</p>
        <p style={{ marginBottom: 20, color: "#aaa" }}>Usuarios</p>
        <p style={{ marginBottom: 20, color: "#aaa" }}>Configuración</p>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          style={{
            marginTop: 40,
            background: "#800020",
            border: "none",
            padding: 10,
            width: "100%",
            color: "white",
            cursor: "pointer"
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, padding: 40 }}>
        
        <h1 style={{ marginBottom: 30 }}>
          Bienvenido, <span style={{ color: "#d4af37" }}>{user.nombre}</span>
        </h1>

        {/* Tarjetas estadísticas */}
        <div style={{ display: "flex", gap: 20, marginBottom: 40 }}>
          
          <div style={{
            flex: 1,
            background: "#1a1a1a",
            padding: 20,
            borderRadius: 10,
            border: "1px solid #222"
          }}>
            <h3 style={{ color: "#aaa" }}>Total Ventas</h3>
            <h2>{ventas.length}</h2>
          </div>

          <div style={{
            flex: 1,
            background: "#1a1a1a",
            padding: 20,
            borderRadius: 10,
            border: "1px solid #222"
          }}>
            <h3 style={{ color: "#aaa" }}>Ingresos Totales</h3>
            <h2 style={{ color: "#d4af37" }}>${totalIngresos}</h2>
          </div>

        </div>

        {/* Lista de ventas */}
        <h2 style={{ marginBottom: 20 }}>Ventas Registradas</h2>

        {ventas.length === 0 ? (
          <p style={{ color: "#777" }}>No hay ventas registradas</p>
        ) : (
          ventas.map((venta) => (
            <div
              key={venta.id}
              style={{
                background: "#1a1a1a",
                padding: 15,
                borderRadius: 8,
                marginBottom: 15,
                border: "1px solid #222",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <p>Monto: <span style={{ color: "#d4af37" }}>${venta.precio}</span></p>
              </div>

              <button
                onClick={() => eliminarVenta(venta.id)}
                style={{
                  background: "#8b0000",
                  border: "none",
                  padding: "6px 12px",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: 4
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

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
    const { data, error } = await supabase
      .from("ventas")
      .select("*");

    if (!error) {
      setVentas(data);
    }
  };

  const eliminarVenta = async (id) => {
    await supabase.from("ventas").delete().eq("id", id);
    fetchVentas();
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "black", color: "white", padding: 40 }}>
      <h1 style={{ color: "yellow" }}>Panel Admin 👑</h1>
      <p>Bienvenido, {user.nombre}</p>

      <h2 style={{ marginTop: 30 }}>Ventas Registradas</h2>

      {ventas.length === 0 ? (
        <p>No hay ventas registradas</p>
      ) : (
        ventas.map((venta) => (
          <div
            key={venta.id}
            style={{
              background: "#222",
              padding: 15,
              marginTop: 10,
              borderRadius: 8
            }}
          >
            <p>Monto: ${venta.precio}</p>
            <button
              onClick={() => eliminarVenta(venta.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: 6,
                cursor: "pointer"
              }}
            >
              Eliminar
            </button>
          </div>
        ))
      )}
    </div>
  );
}

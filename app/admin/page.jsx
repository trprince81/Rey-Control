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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return router.push("/login");

    const parsed = JSON.parse(storedUser);
    if (parsed.role !== "admin") return router.push("/login");

    setUser(parsed);
    fetchClientes();
    fetchTrabajadores();
  }, []);

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

  // 🔥 TOTAL GENERAL
  const totalIngresos = clientes.reduce(
    (acc, c) => acc + Number(c.precio),
    0
  );

  // 🔥 DIVISIÓN REAL
  const totalTrabajador = totalIngresos * 0.35;
  const totalDueno = totalIngresos * 0.15;
  const totalSocio = totalIngresos * 0.5;

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.9)), url('/01.JPG')",
        backgroundSize: "cover",
        color: "white",
        fontFamily: "Segoe UI",
        padding: 40,
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ color: "#d4af37" }}>
          Imperio S&D 👑
        </h1>
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
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <>
          {/* CARDS PRINCIPALES */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <CardBig
              title="Ingresos Totales"
              value={`$${totalIngresos.toFixed(2)}`}
            />

            <CardSmall
              title="Dueño (15%)"
              value={`$${totalDueno.toFixed(2)}`}
            />

            <CardSmall
              title="Socio (50%)"
              value={`$${totalSocio.toFixed(2)}`}
            />
          </div>

          {/* TOTALES POR TRABAJADOR */}
          <h2 style={{ marginTop: 50, color: "#d4af37" }}>
            Totales de los Trabajadores
          </h2>

          <div
            style={{
              display: "flex",
              gap: 30,
              flexWrap: "wrap",
              marginTop: 20,
            }}
          >
            {trabajadores.map((t) => {
              const totalIndividual = clientes
                .filter((c) => c.trabajador_id === t.id)
                .reduce(
                  (acc, c) => acc + Number(c.precio) * 0.35,
                  0
                );

              return (
                <div
                  key={t.id}
                  style={{ textAlign: "center" }}
                >
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg,#8000ff,#d4af37)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: 18,
                      boxShadow: "0 0 25px #8000ff",
                    }}
                  >
                    ${totalIndividual.toFixed(2)}
                  </div>
                  <p style={{ marginTop: 10 }}>
                    {t.nombre}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ÚLTIMOS CLIENTES */}
          <h2 style={{ marginTop: 60, color: "#d4af37" }}>
            Últimos Clientes
          </h2>

          {clientes.slice(0, 5).map((c) => (
            <div
              key={c.id}
              style={{
                background: "rgba(0,0,0,0.6)",
                padding: 15,
                borderRadius: 10,
                marginTop: 10,
                border: "1px solid #8000ff",
              }}
            >
              ${c.precio} - {c.estado}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* COMPONENTES */

const CardBig = ({ title, value }) => (
  <div
    style={{
      background:
        "linear-gradient(90deg,#ffd700,#ffae00)",
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
    <h2 style={{ color: "#d4af37" }}>
      {value}
    </h2>
  </div>
);

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

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") return router.push("/login");

    setUser(parsedUser);
    fetchClientes();
    fetchTrabajadores();
  }, []);

  const fetchClientes = async () => {
    const { data } = await supabase
      .from("ventas")
      .select(`*, trabajadores ( nombre )`)
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

  const cambiarEstado = async (cliente) => {
    const precio = Number(cliente.precio);

    const total_trabajador = precio * 0.35;
    const total_dueno = precio * 0.15;
    const total_socio = precio * 0.5;

    await supabase
      .from("ventas")
      .update({
        estado: "pagado",
        total_trabajador,
        total_dueno,
        total_socio,
      })
      .eq("id", cliente.id);

    fetchClientes();
  };

  const totalIngresos = clientes
    .filter((c) => c.estado === "pagado")
    .reduce((acc, c) => acc + Number(c.precio), 0);

  const totalDueno = clientes
    .filter((c) => c.estado === "pagado")
    .reduce((acc, c) => acc + Number(c.total_dueno || 0), 0);

  const totalSocio = clientes
    .filter((c) => c.estado === "pagado")
    .reduce((acc, c) => acc + Number(c.total_socio || 0), 0);

  const totalTrabajador = (id) =>
    clientes
      .filter(
        (c) => c.estado === "pagado" && c.trabajador_id === id
      )
      .reduce((acc, c) => acc + Number(c.total_trabajador || 0), 0);

  if (!user) return null;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/bg-dashboard.jpg')",
        backgroundSize: "cover",
        color: "white",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: 260,
          padding: 40,
          background: "rgba(0,0,0,0.9)",
        }}
      >
        <h2 style={{ color: "#d4af37" }}>Imperio S&D 👑</h2>

        <div style={menu(activeTab === "dashboard")} onClick={() => setActiveTab("dashboard")}>Dashboard</div>
        <div style={menu(activeTab === "clientes")} onClick={() => setActiveTab("clientes")}>Clientes</div>
        <div style={menu(activeTab === "config")} onClick={() => setActiveTab("config")}>Configuración</div>

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

        <div style={cardBig}>
          <div style={avatar}>{user.nombre.charAt(0)}</div>
          <div>
            <p style={{ margin: 0, color: "#aaa" }}>BIENVENIDO</p>
            <h1 style={{ margin: 0, color: "#d4af37" }}>
              {user.nombre.toUpperCase()}
            </h1>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <>
            <div style={{ display: "flex", gap: 20 }}>
              <Card title="Ingresos Totales" value={`$${totalIngresos}`} />
              <Card title="Dueño (15%)" value={`$${totalDueno}`} />
              <Card title="Socio (50%)" value={`$${totalSocio}`} />
            </div>

            <div style={{ marginTop: 40 }}>
              <h3 style={{ color: "#d4af37" }}>Últimos Clientes</h3>
              {clientes.slice(0, 5).map((c) => (
                <Line key={c.id}>
                  {c.trabajadores?.nombre} — ${c.precio} — {c.estado}
                </Line>
              ))}
            </div>
          </>
        )}

        {activeTab === "clientes" &&
          clientes.map((c) => (
            <Line key={c.id}>
              <div>
                <p>Trabajador: {c.trabajadores?.nombre}</p>
                <p>Monto: ${c.precio}</p>
                <p>Estado: {c.estado}</p>

                {c.estado !== "pagado" && (
                  <button
                    onClick={() => cambiarEstado(c)}
                    style={greenBtn}
                  >
                    Marcar como Pagado
                  </button>
                )}
              </div>
              <DeleteBtn onClick={() => eliminarCliente(c.id)} />
            </Line>
          ))}

        {activeTab === "config" && (
          <>
            <h2 style={{ color: "#d4af37" }}>Ganancias Trabajadores (35%)</h2>

            {trabajadores.map((t) => (
              <Line key={t.id}>
                {t.nombre} — ${totalTrabajador(t.id)}
              </Line>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ESTILOS */

const menu = (active) => ({
  marginBottom: 18,
  cursor: "pointer",
  color: active ? "#d4af37" : "#aaa",
  fontWeight: active ? "bold" : "normal",
});

const cardBig = {
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 40,
  padding: 25,
  background: "rgba(0,0,0,0.6)",
  borderRadius: 15,
};

const avatar = {
  width: 80,
  height: 80,
  borderRadius: "50%",
  background: "linear-gradient(135deg,#d4af37,#8b7500)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 30,
  fontWeight: "bold",
  color: "#000",
};

const Card = ({ title, value }) => (
  <div style={{
    background: "rgba(0,0,0,0.6)",
    padding: 25,
    borderRadius: 12,
    minWidth: 220
  }}>
    <h3>{title}</h3>
    <h1 style={{ color: "#d4af37" }}>{value}</h1>
  </div>
);

const Line = ({ children }) => (
  <div style={{
    marginTop: 12,
    padding: 15,
    background: "rgba(0,0,0,0.6)",
    borderRadius: 8
  }}>
    {children}
  </div>
);

const DeleteBtn = ({ onClick }) => (
  <button onClick={onClick} style={{
    marginTop: 8,
    background: "#8b0000",
    border: "none",
    padding: 6,
    color: "white",
    borderRadius: 4,
    cursor: "pointer"
  }}>
    Eliminar
  </button>
);

const greenBtn = {
  marginTop: 6,
  background: "#00c853",
  border: "none",
  padding: 6,
  borderRadius: 4,
  cursor: "pointer",
  fontWeight: "bold",
};

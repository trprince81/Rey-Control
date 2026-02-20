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
    const { data } = await supabase
      .from("ventas")
      .select(`
        *,
        trabajadores ( nombre )
      `)
      .order("created_at", { ascending: false });

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

  const cambiarEstado = async (cliente) => {
    const precio = Number(cliente.precio);

    const total_trabajador = precio * 0.35;
    const total_dueno = precio * 0.15;
    const total_socio = precio * 0.50;

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

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#111", color: "white" }}>
      
      <div style={{ width: 260, padding: 40, background: "#000" }}>
        <h2 style={{ color: "#d4af37" }}>Imperio S&D 👑</h2>

        <div onClick={() => setActiveTab("dashboard")} style={{ marginBottom: 15, cursor: "pointer" }}>Dashboard</div>
        <div onClick={() => setActiveTab("clientes")} style={{ marginBottom: 15, cursor: "pointer" }}>Clientes</div>
        <div onClick={() => setActiveTab("config")} style={{ marginBottom: 15, cursor: "pointer" }}>Configuración</div>
      </div>

      <div style={{ flex: 1, padding: 60 }}>

        {activeTab === "dashboard" && (
          <>
            <h1>Bienvenido {user.nombre}</h1>

            <p>Total Clientes: {clientes.length}</p>
            <p>Ingresos Totales: ${totalIngresos}</p>
            <p>Total Dueño (15%): ${totalDueno}</p>
            <p>Total Socio (50%): ${totalSocio}</p>

            <h3 style={{ marginTop: 30 }}>Últimos Clientes</h3>

            {clientes.slice(0, 5).map((c) => (
              <div key={c.id} style={{ marginTop: 10 }}>
                {c.trabajadores?.nombre} — ${c.precio} — {c.estado}
              </div>
            ))}
          </>
        )}

        {activeTab === "clientes" &&
          clientes.map((c) => (
            <div key={c.id} style={{ marginTop: 15 }}>
              Trabajador: {c.trabajadores?.nombre} <br />
              Monto: ${c.precio} <br />
              Estado: {c.estado} <br />

              {c.estado !== "pagado" && (
                <button onClick={() => cambiarEstado(c)}>
                  Marcar como Pagado
                </button>
              )}

              <button onClick={() => eliminarCliente(c.id)}>
                Eliminar
              </button>
            </div>
          ))}

        {activeTab === "config" && (
          <>
            <h2>Ganancias por Trabajador (35%)</h2>

            {trabajadores.map((t) => {
              const total = clientes
                .filter(
                  (c) =>
                    c.estado === "pagado" &&
                    c.trabajadores?.nombre === t.nombre
                )
                .reduce((acc, c) => acc + Number(c.total_trabajador || 0), 0);

              return (
                <p key={t.id}>
                  {t.nombre} — ${total}
                </p>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

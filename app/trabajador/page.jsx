"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function TrabajadorPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return router.push("/login");

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "trabajador") return router.push("/login");

    setUser(parsedUser);
    fetchClientes(parsedUser.id);
  }, []);

  const fetchClientes = async (id) => {
    const { data } = await supabase
      .from("ventas")
      .select("*")
      .eq("trabajador_id", id)
      .order("created_at", { ascending: false });

    if (data) setClientes(data);
  };

  const agregarCliente = async () => {
    if (!precio) return alert("Ingresa monto");
    if (!confirm("¿Seguro que deseas agregar este cliente?")) return;

    await supabase.from("ventas").insert([
      {
        trabajador_id: user.id,
        precio,
        estado: "pendiente",
      },
    ]);

    setPrecio("");
    fetchClientes(user.id);
  };

  const cambiarEstado = async (cliente, nuevoEstado) => {
    await supabase
      .from("ventas")
      .update({ estado: nuevoEstado })
      .eq("id", cliente.id);

    fetchClientes(user.id);
  };

  const total = clientes
    .filter((c) => c.estado === "pagado")
    .reduce((acc, c) => acc + Number(c.total_trabajador || 0), 0);

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('/bg-dashboard.jpg')",
        backgroundSize: "cover",
        color: "white",
        padding: 40,
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* PERFIL PS5 */}
      <div style={profileCard}>
        <div style={avatar}>{user.nombre.charAt(0)}</div>
        <div>
          <h2 style={{ margin: 0, color: "#d4af37" }}>
            {user.nombre.toUpperCase()}
          </h2>
          <p style={{ margin: 0 }}>Panel de Trabajo</p>
        </div>
      </div>

      {/* TOTAL */}
      <div style={totalCard}>
        💰 Total Ganado (35%): <b>${total}</b>
      </div>

      {/* AGREGAR CLIENTE */}
      <div style={box}>
        <h3>Agregar Cliente</h3>
        <input
          placeholder="Monto"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          style={inputStyle}
        />
        <button onClick={agregarCliente} style={goldButton}>
          Agregar
        </button>
      </div>

      {/* LISTA CLIENTES */}
      <div style={{ marginTop: 30 }}>
        <h3>Mis Clientes</h3>

        {clientes.map((c) => (
          <div key={c.id} style={clienteCard}>
            <p>Monto: ${c.precio}</p>
            <p>Estado: <span style={estadoColor(c.estado)}>{c.estado}</span></p>

            <div style={{ marginTop: 10 }}>
              <button onClick={() => cambiarEstado(c, "va a llamar")} style={btnBlue}>Va a llamar</button>
              <button onClick={() => cambiarEstado(c, "en camino")} style={btnOrange}>En camino</button>
              <button onClick={() => cambiarEstado(c, "llego")} style={btnPurple}>Llegó</button>
              <button onClick={() => cambiarEstado(c, "entro")} style={btnYellow}>Entró</button>
              <button onClick={() => cambiarEstado(c, "pagado")} style={btnGreen}>Pagado</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ESTILOS */

const profileCard = {
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 30,
  padding: 20,
  background: "rgba(0,0,0,0.6)",
  borderRadius: 15,
  boxShadow: "0 0 20px #8000ff",
};

const avatar = {
  width: 80,
  height: 80,
  borderRadius: "50%",
  background: "linear-gradient(135deg,#8000ff,#d4af37)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 30,
  fontWeight: "bold",
};

const totalCard = {
  padding: 15,
  marginBottom: 20,
  background: "rgba(0,0,0,0.6)",
  borderRadius: 12,
  boxShadow: "0 0 15px #d4af37",
};

const box = {
  padding: 20,
  background: "rgba(0,0,0,0.6)",
  borderRadius: 12,
};

const clienteCard = {
  marginTop: 15,
  padding: 15,
  background: "rgba(0,0,0,0.6)",
  borderRadius: 10,
  boxShadow: "0 0 10px #8000ff",
};

const inputStyle = {
  padding: 10,
  marginRight: 10,
  borderRadius: 6,
  border: "none",
};

const goldButton = {
  padding: 10,
  background: "#d4af37",
  border: "none",
  color: "black",
  fontWeight: "bold",
  borderRadius: 6,
  cursor: "pointer",
};

const estadoColor = (estado) => {
  switch (estado) {
    case "va a llamar":
      return { color: "#2196f3" };
    case "en camino":
      return { color: "#ff9800" };
    case "llego":
      return { color: "#9c27b0" };
    case "entro":
      return { color: "#ffc107" };
    case "pagado":
      return { color: "#00c853" };
    default:
      return { color: "white" };
  }
};

const btnBlue = { marginRight: 5, background: "#2196f3", color: "white", border: "none", padding: 5 };
const btnOrange = { marginRight: 5, background: "#ff9800", color: "white", border: "none", padding: 5 };
const btnPurple = { marginRight: 5, background: "#9c27b0", color: "white", border: "none", padding: 5 };
const btnYellow = { marginRight: 5, background: "#ffc107", color: "black", border: "none", padding: 5 };
const btnGreen = { marginRight: 5, background: "#00c853", color: "black", border: "none", padding: 5 };

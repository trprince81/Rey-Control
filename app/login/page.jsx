"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");
  const [selectedRole, setSelectedRole] = useState("trabajador");

  const handleLogin = async () => {
    if (!nombre || !pin) return alert("Completa los datos");

    const { data } = await supabase
      .from("trabajadores")
      .select("*")
      .eq("nombre", nombre)
      .eq("pin", pin)
      .single();

    if (!data) return alert("Datos incorrectos");

    localStorage.setItem("user", JSON.stringify(data));

    if (data.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/trabajador");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/01.JPG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        fontFamily: "Segoe UI, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: 420,
          padding: 40,
          background: "rgba(0,0,0,0.7)",
          borderRadius: 20,
          boxShadow: "0 0 30px #8000ff",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#d4af37", marginBottom: 20 }}>
          Imperio S&D 👑
        </h1>

        {/* SELECTOR TIPO PS5 */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 25 }}>
          <div
            onClick={() => setSelectedRole("admin")}
            style={profileStyle(selectedRole === "admin")}
          >
            👑
            <p>Admin</p>
          </div>

          <div
            onClick={() => setSelectedRole("trabajador")}
            style={profileStyle(selectedRole === "trabajador")}
          >
            🎮
            <p>Trabajador</p>
          </div>
        </div>

        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleLogin} style={goldButton}>
          Entrar
        </button>

        {/* SERVICIOS */}
        <div style={{ marginTop: 35 }}>
          <h3 style={{ color: "#8000ff" }}>Servicios</h3>

          <p>Renta de Proxy</p>
          <p>Renta de Cuenta</p>
          <p>Paquetes de Programas y Proxies</p>
          <p>Mantenimiento y más</p>

          <div style={{ marginTop: 15 }}>
            📲 WhatsApp: <b>(849) 524-7737</b>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ESTILOS */

const profileStyle = (active) => ({
  width: 100,
  height: 100,
  borderRadius: "50%",
  background: active
    ? "linear-gradient(135deg,#8000ff,#d4af37)"
    : "rgba(255,255,255,0.1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  boxShadow: active ? "0 0 20px #8000ff" : "none",
});

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 15,
  borderRadius: 8,
  border: "none",
};

const goldButton = {
  width: "100%",
  padding: 12,
  background: "#d4af37",
  border: "none",
  color: "black",
  fontWeight: "bold",
  cursor: "pointer",
  borderRadius: 8,
};

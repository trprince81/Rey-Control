"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const { data, error } = await supabase
      .from("trabajadores")
      .select("*")
      .eq("nombre", nombre)
      .eq("pin", pin)
      .single();

    if (error || !data) {
      setError("Usuario o PIN incorrecto");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));

    if (data.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/trabajador");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "black", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "#111", padding: 40, borderRadius: 10, width: 300 }}>
        <h2 style={{ color: "yellow" }}>Imperio S&D</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <button
          onClick={handleLogin}
          style={{ width: "100%", padding: 10, background: "purple", color: "white", border: "none" }}
        >
          Entrar
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

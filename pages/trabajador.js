import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Trabajador() {
  const [trabajador, setTrabajador] = useState(null);
  const [totalClientes, setTotalClientes] = useState(0);
  const [animado, setAnimado] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("trabajador");
    if (!data) {
      window.location.href = "/login";
      return;
    }

    const parsed = JSON.parse(data);
    setTrabajador(parsed);
    cargarClientes(parsed.id);
  }, []);

  async function cargarClientes(id) {
    const { count } = await supabase
      .from("ventas")
      .select("*", { count: "exact", head: true })
      .eq("trabajador_id", id);

    setTotalClientes(count || 0);
  }

  // Animación de números estilo contador
  useEffect(() => {
    let inicio = 0;
    const intervalo = setInterval(() => {
      inicio++;
      setAnimado(inicio);
      if (inicio >= totalClientes) {
        clearInterval(intervalo);
      }
    }, 50);
  }, [totalClientes]);

  async function agregarCliente() {
    if (!trabajador) return;

    const confirmar = confirm("¿Seguro que quieres agregar un cliente?");
    if (!confirmar) return;

    const { error } = await supabase.from("ventas").insert([
      {
        trabajador_id: trabajador.id,
        precio: 1,
      },
    ]);

    if (error) {
      alert("Error agregando cliente");
      return;
    }

    // 🔊 SONIDO DOMINICANO
    const audio = new Audio("/pasta.mp3");
    audio.play();

    cargarClientes(trabajador.id);
  }

  return (
    <div
      style={{
        height: "100vh",
        background: "radial-gradient(circle at top, #111, #000)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        flexDirection: "column",
      }}
    >
      <img
        src="/IMG_6992.JPG"
        style={{
          width: "120px",
          borderRadius: "50%",
          marginBottom: "15px",
          boxShadow: "0 0 20px gold",
        }}
      />

      <h2 style={{ marginBottom: "10px" }}>
        {trabajador?.nombre}
      </h2>

      <h1
        style={{
          fontSize: "60px",
          background: "linear-gradient(45deg, gold, orange)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          marginBottom: "10px",
        }}
      >
        {animado}
      </h1>

      <p style={{ marginBottom: "20px" }}>👥 Total de Clientes</p>

      <button
        onClick={agregarCliente}
        style={{
          padding: "15px 40px",
          fontSize: "18px",
          borderRadius: "40px",
          border: "none",
          background: "linear-gradient(45deg, gold, orange)",
          cursor: "pointer",
          boxShadow: "0 0 25px gold",
          fontWeight: "bold",
        }}
      >
        💰 Agregar Cliente
      </button>
    </div>
  );
}

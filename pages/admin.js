import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);

  const [clientes, setClientes] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    cargarTrabajadores();
  }, []);

  async function cargarTrabajadores() {
    const { data } = await supabase.from("trabajadores").select("*");
    setTrabajadores(data || []);
  }

  async function crearTrabajador() {
    if (!nombre || !pin) return alert("Completa nombre y PIN");

    await supabase.from("trabajadores").insert([{ nombre, pin }]);
    setNombre("");
    setPin("");
    cargarTrabajadores();
  }

  async function eliminarTrabajador(id) {
    await supabase.from("trabajadores").delete().eq("id", id);
    cargarTrabajadores();
  }

  async function registrarVenta(precio) {
    if (!seleccionado) return alert("Selecciona un trabajador");

    await supabase.from("ventas").insert([
      { trabajador_id: seleccionado, precio },
    ]);

    setClientes(prev => prev + 1);
    setTotal(prev => prev + precio);
  }

  const trabajadorGanancia = total * 0.35;
  const tu = total * 0.15;
  const socio = total * 0.5;

  return (
    <div style={{ padding: 20, background: "#111", minHeight: "100vh", color: "white" }}>
      <h1>Imperio S&D 👑</h1>

      <h2>Crear Trabajador</h2>

      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <button onClick={crearTrabajador}>Crear</button>

      <h2>Lista de Trabajadores</h2>

      {trabajadores.map((t) => (
        <div key={t.id} style={{ marginBottom: 10 }}>
          {t.nombre}
          <button onClick={() => setSeleccionado(t.id)}>
            Seleccionar
          </button>
          <button onClick={() => eliminarTrabajador(t.id)}>
            Eliminar
          </button>
        </div>
      ))}

      <hr />

      <h2>Ventas</h2>

      <button onClick={() => registrarVenta(120)}>15 min - $120</button>
      <button onClick={() => registrarVenta(180)}>30 min - $180</button>
      <button onClick={() => registrarVenta(260)}>1 hora - $260</button>

      <h3>Clientes: {clientes}</h3>
      <h3>Total: ${total}</h3>
      <h3>Trabajador 35%: ${trabajadorGanancia}</h3>
      <h3>Tu 15%: ${tu}</h3>
      <h3>Socio 50%: ${socio}</h3>
    </div>
  );
}

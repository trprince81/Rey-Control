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
    const { data, error } = await supabase
      .from("trabajadores")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Error cargando trabajadores");
      return;
    }

    setTrabajadores(data || []);
  }

  async function crearTrabajador() {
    if (!nombre || !pin) {
      alert("Completa nombre y PIN");
      return;
    }

    const { error } = await supabase
      .from("trabajadores")
      .insert([{ nombre, pin }]);

    if (error) {
      console.error(error);
      alert("Error creando trabajador");
      return;
    }

    alert("Trabajador creado correctamente 🔥");

    setNombre("");
    setPin("");
    cargarTrabajadores();
  }

  async function eliminarTrabajador(id) {
    const confirmar = confirm("¿Eliminar este trabajador?");
    if (!confirmar) return;

    const { error } = await supabase
      .from("trabajadores")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Error eliminando trabajador");
      return;
    }

    alert("Trabajador eliminado");
    cargarTrabajadores();
  }

  async function registrarVenta(precio) {
    if (!seleccionado) {
      alert("Selecciona un trabajador primero");
      return;
    }

    const { error } = await supabase
      .from("ventas")
      .insert([
        {
          trabajador_id: seleccionado,
          precio,
        },
      ]);

    if (error) {
      console.error(error);
      alert("Error registrando venta");
      return;
    }

    setClientes((prev) => prev + 1);
    setTotal((prev) => prev + precio);
  }

  const trabajadorGanancia = total * 0.35;
  const tuGanancia = total * 0.15;
  const socioGanancia = total * 0.5;

  return (
    <div style={{ padding: 20, background: "#111", minHeight: "100vh", color: "white" }}>
      <h1>Imperio S&D 👑</h1>

      <h2>Crear Trabajador</h2>

      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ marginRight: 10 }}
      />

      <input
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        style={{ marginRight: 10 }}
      />

      <button onClick={crearTrabajador}>Crear</button>

      <hr style={{ margin: "20px 0" }} />

      <h2>Lista de Trabajadores</h2>

      {trabajadores.map((t) => (
        <div key={t.id} style={{ marginBottom: 10 }}>
          <strong>{t.nombre}</strong>

          <button
            onClick={() => setSeleccionado(t.id)}
            style={{ marginLeft: 10 }}
          >
            Seleccionar
          </button>

          <button
            onClick={() => eliminarTrabajador(t.id)}
            style={{ marginLeft: 10 }}
          >
            Eliminar
          </button>
        </div>
      ))}

      <hr style={{ margin: "20px 0" }} />

      <h2>Ventas</h2>

      <button onClick={() => registrarVenta(120)}>15 min - $120</button>
      <button onClick={() => registrarVenta(180)} style={{ marginLeft: 10 }}>
        30 min - $180
      </button>
      <button onClick={() => registrarVenta(260)} style={{ marginLeft: 10 }}>
        1 hora - $260
      </button>

      <hr style={{ margin: "20px 0" }} />

      <h3>Clientes 👤: {clientes}</h3>
      <h3>Total Vendido 💰: ${total}</h3>
      <h3>Trabajador 35%: ${trabajadorGanancia}</h3>
      <h3>Tu 15% 👑: ${tuGanancia}</h3>
      <h3>Socio 50%: ${socioGanancia}</h3>
    </div>
  );
}

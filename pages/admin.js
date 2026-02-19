import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Admin() {
  const [ventas, setVentas] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    const { data } = await supabase
      .from("ventas")
      .select("*, trabajadores(nombre)");

    if (data) {
      setVentas(data);

      const suma = data.reduce((acc, v) => acc + Number(v.precio), 0);
      setTotal(suma);
    }
  };

  const tu15 = total * 0.15;
  const socio50 = total * 0.5;
  const trabajador35 = total * 0.35;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Panel Admin 👑</h1>

      <h2>Total Generado: ${total}</h2>
      <h3>Tu 15% 👑: ${tu15}</h3>
      <h3>Socio 50% 🤝: ${socio50}</h3>
      <h3>Trabajadores 35% 👤: ${trabajador35}</h3>

      <hr />

      <h2>Ventas Registradas</h2>

      {ventas.map((venta) => (
        <div key={venta.id} style={styles.card}>
          <p>Trabajador: {venta.trabajadores?.nombre}</p>
          <p>Monto: ${venta.precio}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#111",
    minHeight: "100vh",
    color: "white",
  },
  title: {
    color: "gold",
  },
  card: {
    background: "#222",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "10px",
  },
};

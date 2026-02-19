import { useState } from "react";

export default function Admin() {
  const [clientes, setClientes] = useState(0);
  const [total, setTotal] = useState(0);
  const [cerrado, setCerrado] = useState(false);

  function registrarVenta(precio) {
    if (cerrado) return;
    setClientes(clientes + 1);
    setTotal(total + precio);
  }

  const trabajador = total * 0.35;
  const tu = total * 0.15;
  const socio = total * 0.5;

  function cerrarDia() {
    setCerrado(true);
    alert("Día cerrado 🔒");
  }

  return (
    <div style={styles.container}>
      <h2>Panel Admin - Imperio S&D 👑</h2>

      <p>Clientes: {clientes}</p>
      <p>Total Vendido: ${total}</p>
      <p>Trabajador 35%: ${trabajador}</p>
      <p>Tu 15%: ${tu}</p>
      <p>Socio 50%: ${socio}</p>

      {!cerrado && (
        <>
          <button onClick={() => registrarVenta(120)}>15 min - $120</button>
          <button onClick={() => registrarVenta(180)}>30 min - $180</button>
          <button onClick={() => registrarVenta(260)}>1 Hora - $260</button>

          <button onClick={cerrarDia}>Cerrar Día 🔒</button>
        </>
      )}

      {cerrado && <p>Día Cerrado</p>}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#000",
    color: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    padding: 10,
    margin: 10,
  },
  button: {
    padding: 12,
    margin: 5,
    backgroundColor: "gold",
    border: "none",
    cursor: "pointer",
  },
};

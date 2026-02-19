import { useState } from "react";

export default function Trabajador() {
  const [clientes, setClientes] = useState(0);
  const [total, setTotal] = useState(0);

  function registrarVenta(precio) {
    setClientes(clientes + 1);
    setTotal(total + precio);
  }

  const comision = total * 0.35;

  return (
    <div style={styles.container}>
      <h2>Panel Trabajador</h2>

      <p>Clientes: {clientes}</p>
      <p>Total Vendido: ${total}</p>
      <p>Tu 35%: ${comision}</p>

      <button onClick={() => registrarVenta(120)}>15 min - $120</button>
      <button onClick={() => registrarVenta(180)}>30 min - $180</button>
      <button onClick={() => registrarVenta(260)}>1 Hora - $260</button>
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

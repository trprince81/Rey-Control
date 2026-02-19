import { useEffect, useState } from "react";

export default function Admin() {
  const [ventas, setVentas] = useState([]);
  const [totalGeneral, setTotalGeneral] = useState(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("ventas")) || [];
    setVentas(data);

    const total = data.reduce((acc, venta) => acc + venta.monto, 0);
    setTotalGeneral(total);
  }, []);

  const trabajador35 = totalGeneral * 0.35;
  const tu15 = totalGeneral * 0.15;
  const socio50 = totalGeneral * 0.5;

  return (
    <div style={styles.fondo}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Panel Admin 👑</h2>

        <h1 style={styles.total}>${totalGeneral}</h1>
        <p>Total General Generado</p>

        <div style={styles.resumen}>
          <h3>Trabajadores 35%: ${trabajador35}</h3>
          <h3>Tu 15% 👑: ${tu15}</h3>
          <h3>Socio 50%: ${socio50}</h3>
        </div>

        <div style={styles.lista}>
          <h3>Historial de Ventas</h3>
          {ventas.map((venta, index) => (
            <div key={index} style={styles.item}>
              <p><strong>{venta.trabajador}</strong></p>
              <p>${venta.monto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  fondo: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #141e30, #243b55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#111",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 0 40px gold",
    color: "white",
    width: "500px",
  },
  titulo: {
    color: "gold",
    textAlign: "center",
  },
  total: {
    fontSize: "50px",
    textAlign: "center",
    color: "gold",
  },
  resumen: {
    background: "#222",
    padding: "15px",
    borderRadius: "15px",
    marginTop: "20px",
  },
  lista: {
    marginTop: "20px",
  },
  item: {
    background: "#1a1a1a",
    padding: "10px",
    borderRadius: "10px",
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
  },
};

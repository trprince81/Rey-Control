import { useState, useEffect } from "react";

export default function Trabajador() {
  const [nombre, setNombre] = useState("");
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalGenerado, setTotalGenerado] = useState(0);

  const precios = {
    quince: 120,
    treinta: 180,
    hora: 260,
  };

  useEffect(() => {
    const user = localStorage.getItem("trabajadorNombre");
    if (!user) {
      window.location.href = "/login";
    } else {
      setNombre(user);
    }
  }, []);

  const agregarVenta = (monto) => {
    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];

    const nuevaVenta = {
      trabajador: nombre,
      monto: monto,
      fecha: new Date().toISOString(),
    };

    ventas.push(nuevaVenta);
    localStorage.setItem("ventas", JSON.stringify(ventas));

    setTotalClientes(totalClientes + 1);
    setTotalGenerado(totalGenerado + monto);

    const audio = new Audio("/pasta.mp3");
    audio.play();
  };

  const montoEditable = () => {
    const monto = parseFloat(prompt("Ingresa el monto personalizado"));
    if (!isNaN(monto)) {
      agregarVenta(monto);
    }
  };

  const trabajador35 = totalGenerado * 0.35;
  const tu15 = totalGenerado * 0.15;
  const socio50 = totalGenerado * 0.5;

  return (
    <div style={styles.fondo}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Trabajador 👤</h2>
        <h3>{nombre}</h3>

        <h1 style={styles.numero}>{totalClientes}</h1>
        <p>Total de Clientes</p>

        <div style={styles.botones}>
          <button style={styles.boton} onClick={() => agregarVenta(precios.quince)}>
            15 Min - $120
          </button>

          <button style={styles.boton} onClick={() => agregarVenta(precios.treinta)}>
            30 Min - $180
          </button>

          <button style={styles.boton} onClick={() => agregarVenta(precios.hora)}>
            1 Hora - $260
          </button>

          <button style={styles.botonEspecial} onClick={montoEditable}>
            Monto Personalizado 💰
          </button>
        </div>

        <div style={styles.resumen}>
          <h3>Total Generado: ${totalGenerado}</h3>
          <h3>Trabajador 35%: ${trabajador35}</h3>
          <h3>Tu 15% 👑: ${tu15}</h3>
          <h3>Socio 50%: ${socio50}</h3>
        </div>
      </div>
    </div>
  );
}

const styles = {
  fondo: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#111",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 0 40px gold",
    textAlign: "center",
    color: "white",
    width: "400px",
  },
  titulo: {
    color: "gold",
  },
  numero: {
    fontSize: "60px",
    margin: "10px 0",
    color: "gold",
  },
  botones: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },
  boton: {
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "gold",
    fontWeight: "bold",
    cursor: "pointer",
  },
  botonEspecial: {
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(45deg, gold, orange)",
    fontWeight: "bold",
    cursor: "pointer",
  },
  resumen: {
    marginTop: "20px",
    background: "#222",
    padding: "15px",
    borderRadius: "15px",
  },
};

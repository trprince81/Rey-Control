import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Trabajador() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [trabajadorId, setTrabajadorId] = useState(null);
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem("trabajador_id");
    const nombreGuardado = localStorage.getItem("trabajador_nombre");

    if (!id) {
      router.push("/login");
      return;
    }

    setTrabajadorId(id);
    setNombre(nombreGuardado);

    cargarVentas(id);
  }, []);

  async function cargarVentas(id) {
    const { data } = await supabase
      .from("ventas")
      .select("*")
      .eq("trabajador_id", id);

    setVentas(data || []);
  }

  async function agregarCliente(precio) {
    if (!confirm("¿Seguro que deseas agregar este cliente?")) return;

    await supabase.from("ventas").insert([
      {
        trabajador_id: trabajadorId,
        precio: precio,
      },
    ]);

    cargarVentas(trabajadorId);
  }

  const totalClientes = ventas.length;
  const totalVendido = ventas.reduce((acc, v) => acc + Number(v.precio), 0);
  const ganancia = totalVendido * 0.35;

  function cerrarSesion() {
    localStorage.clear();
    router.push("/login");
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <img
          src="/IMG_6992.JPG"
          alt="Avatar"
          style={styles.avatar}
        />

        <h2 style={styles.nombre}>{nombre}</h2>

        <hr style={styles.linea} />

        <h3>Total de Clientes 👥</h3>
        <p style={styles.numero}>{totalClientes}</p>

        <h3>Tu 35% 💰</h3>
        <p style={styles.numero}>${ganancia}</p>

        <hr style={styles.linea} />

        <h3>Agregar Cliente ⏱</h3>

        <button style={styles.boton} onClick={() => agregarCliente(120)}>
          15 Min — $120
        </button>

        <button style={styles.boton} onClick={() => agregarCliente(180)}>
          30 Min — $180
        </button>

        <button style={styles.boton} onClick={() => agregarCliente(260)}>
          1 Hora — $260
        </button>

        <button style={styles.botonSalir} onClick={cerrarSesion}>
          Cerrar sesión
        </button>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },

  card: {
    background: "#1c1c1c",
    padding: 30,
    borderRadius: 20,
    width: 350,
    textAlign: "center",
    boxShadow: "0 0 30px rgba(255, 215, 0, 0.4)",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    margin: "0 auto 15px auto",
    boxShadow: "0 0 25px rgba(0, 100, 255, 0.7)",
  },

  nombre: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  linea: {
    width: "100%",
    margin: "20px 0",
    opacity: 0.3,
  },

  numero: {
    fontSize: 28,
    color: "gold",
    marginBottom: 15,
  },

  boton: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    border: "none",
    background: "gold",
    fontWeight: "bold",
    cursor: "pointer",
  },

  botonSalir: {
    marginTop: 15,
    padding: 10,
    width: "100%",
    background: "red",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: 8,
  }
};

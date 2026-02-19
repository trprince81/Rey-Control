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

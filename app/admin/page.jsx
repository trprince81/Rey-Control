<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 25,
    marginBottom: 60,
    padding: 25,
    background: "linear-gradient(145deg, #1a1a1a, #101010)",
    borderRadius: 20,
    border: "1px solid #222",
    boxShadow: "0 0 40px rgba(0,0,0,0.8)"
  }}
>
  {/* Avatar tipo PS5 */}
  <div
    style={{
      width: 95,
      height: 95,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #d4af37, #8b7500)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 38,
      fontWeight: "bold",
      color: "#000",
      boxShadow: "0 0 25px rgba(212,175,55,0.9)"
    }}
  >
    {user.nombre.charAt(0).toUpperCase()}
  </div>

  {/* Texto */}
  <div>
    <p
      style={{
        margin: 0,
        fontSize: 18,
        color: "#aaa",
        letterSpacing: 2
      }}
    >
      BIENVENIDO
    </p>

    <h1
      style={{
        margin: 0,
        fontSize: 42,
        color: "#d4af37",
        textShadow: "0 0 20px rgba(212,175,55,0.9)",
        fontWeight: "bold"
      }}
    >
      {user.nombre.toUpperCase()}
    </h1>
  </div>
</div>

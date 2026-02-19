import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");

  const entrarTrabajador = () => {
    if (!nombre || !pin) {
      alert("Completa nombre y PIN");
      return;
    }
    router.push("/trabajador");
  };

  const entrarAdmin = () => {
    if (pin !== "1234") {
      alert("PIN incorrecto");
      return;
    }
    router.push("/admin");
  };

  return (
    <div className="container">
      <div className="overlay"></div>

      <div className="card">
        <h1>Imperio S&D 👑</h1>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <button onClick={entrarTrabajador}>
          Entrar como Trabajador 🎮
        </button>

        <button className="adminBtn" onClick={entrarAdmin}>
          Entrar como Admin 👑
        </button>
      </div>

      <style jsx>{`
        .container {
          height: 100vh;
          background: url("/01.JPG") center center / cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
        }

        .card {
          position: relative;
          z-index: 2;
          width: 360px;
          padding: 40px;
          border-radius: 25px;
          background: rgba(20, 20, 25, 0.95);
          text-align: center;
          box-shadow:
            0 0 30px rgba(255, 215, 0, 0.4),
            0 0 60px rgba(255, 215, 0, 0.2);
          animation: fadeIn 0.6s ease;
        }

        h1 {
          color: gold;
          margin-bottom: 25px;
          font-size: 24px;
          letter-spacing: 1px;
        }

        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 12px;
          border: none;
          background: #2b2b35;
          color: white;
          font-size: 14px;
        }

        input:focus {
          outline: none;
          box-shadow: 0 0 10px gold;
        }

        button {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          border-radius: 20px;
          border: none;
          background: linear-gradient(145deg, gold, #c9a000);
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }

        button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px gold;
        }

        .adminBtn {
          background: linear-gradient(145deg, #444, #222);
          color: gold;
          border: 1px solid gold;
        }

        .adminBtn:hover {
          box-shadow: 0 0 15px gold;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

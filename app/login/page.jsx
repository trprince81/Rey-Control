"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const { data, error } = await supabase
      .from("trabajadores")
      .select("*")
      .eq("nombre", nombre)
      .eq("pin", pin)
      .single();

    if (error || !data) {
      setError("Usuario o PIN incorrecto");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));

    if (data.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/trabajador");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white relative">

      <div className="absolute inset-0 bg-[url('/01.JPG')] bg-cover bg-center opacity-20"></div>

      <div className="relative z-10 bg-gray-900/80 p-10 rounded-2xl shadow-2xl w-96 border border-purple-600">

        <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">
          Imperio S&D
        </h1>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-black border border-purple-500 focus:outline-none"
        />

        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-black border border-purple-500 focus:outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded font-bold"
        >
          Entrar
        </button>

        {error && (
          <p className="text-red-500 mt-3 text-center">{error}</p>
        )}

        <div className="mt-8 text-sm text-gray-300">
          <h2 className="text-purple-400 mb-2 font-semibold">Servicios:</h2>
          <ul className="space-y-1">
            <li>• Renta de proxy</li>
            <li>• Renta de cuenta</li>
            <li>• Paquetes de programas y proxys</li>
            <li>• Mantenimiento y más</li>
          </ul>

          <div className="mt-4 text-green-400 font-semibold">
            WhatsApp: (849) 524-7737
          </div>
        </div>

      </div>
    </div>
  );
}

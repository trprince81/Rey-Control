"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TrabajadorPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.role !== "trabajador") {
      router.push("/login");
      return;
    }

    setUser(parsedUser);
  }, []);

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "black", color: "white", padding: 40 }}>
      <h1 style={{ color: "purple" }}>Panel Trabajador 💼</h1>
      <p>Bienvenido, {user.nombre}</p>
    </div>
  );
}

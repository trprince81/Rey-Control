"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.role !== "admin") {
      router.push("/login");
      return;
    }

    setUser(parsedUser);
  }, []);

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "black", color: "white", padding: 40 }}>
      <h1 style={{ color: "yellow" }}>Panel Admin 👑</h1>
      <p>Bienvenido, {user.nombre}</p>
    </div>
  );
}

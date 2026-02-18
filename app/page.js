"use client"

import { useEffect } from "react"
import { supabase } from "../lib/supabase"

export default function Home() {

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from("test").select("*")
      console.log(data, error)
    }

    testConnection()
  }, [])

  return (
    <h1>Rey Control  - Conectando...</h1>
  )
}

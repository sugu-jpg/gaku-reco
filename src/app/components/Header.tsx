// src/components/Header.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Header() {
  const [userName, setUserName] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const name = user?.user_metadata?.name || user?.email?.split("@")[0] || null
      setUserName(name)
    }

    fetchUser() // 最初に一回取得

    // 🔥 ログイン／ログアウト時に自動で再取得
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        fetchUser()
      }
    })

    // アンマウント時に解除
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    alert("ログアウトしました！")
    router.refresh()
  }

  return (
    <header className="bg-gray-100 p-4 mb-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">📘 GakuReco</h1>
      {userName ? (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>👋 {userName} さん、こんにちは！</span>
          <button
            onClick={handleLogout}
            className="text-blue-500 underline hover:text-blue-700"
          >
            ログアウト
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">未ログイン</p>
      )}
    </header>
  )
}

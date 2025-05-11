// src/components/Header.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Header() {
  const [userName, setUserName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      const name = user?.user_metadata?.name || user?.email?.split("@")[0] || null
      setUserName(name)
      setIsLoading(false)
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
    setIsMenuOpen(false)
    router.refresh()
    router.push("/")
  }

  return (
    <header className="bg-white shadow-sm p-4 mb-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📘</span>
          <h1 className="text-xl font-bold">GakuReco</h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/posts/classes" className="text-gray-700 hover:text-blue-500 transition-colors">
              授業を探す
            </Link>
            <Link href="/posts/foods" className="text-gray-700 hover:text-green-500 transition-colors">
              飲食店を探す
            </Link>
            {userName && (
              <Link href="/create" className="text-gray-700 hover:text-yellow-500 transition-colors">
                投稿する
              </Link>
            )}
          </nav>
          
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : userName ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full hover:bg-blue-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline">{userName}</span>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    {userName}
                  </div>
                  <Link href="/create" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    投稿する
                  </Link>
                  <Link href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    プロフィール設定
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 text-blue-500 hover:text-blue-700 transition-colors">
                ログイン
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                新規登録
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

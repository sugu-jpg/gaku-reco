// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("ログインに失敗しました：" + error.message);
    } else {
      alert("ログイン成功！");
      router.push("/"); // トップページなど、好きな場所へリダイレクト
      router.refresh();
    }
  };

  return (
    <main className="max-w-md mx-auto mt-12 p-4">
      <h1 className="text-xl font-bold mb-4">ログイン</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          ログインする
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        アカウントをお持ちでない方は{" "}
        <a href="/signup" className="text-blue-500 hover:underline">
          新規登録はこちら
        </a>
      </p>
    </main>
  );
}

// src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userName, // ← user_metadata に入る
        },
      },
    });

    if (error) {
      alert("サインアップに失敗しました：" + error.message);
    } else {
      alert("確認メールを送信しました。メールをチェックしてください！");
      router.push("/login"); // サインアップ後、ログイン画面へ遷移（任意）
    }
  };

  return (
    <main className="max-w-md mx-auto mt-12 p-4">
      <h1 className="text-xl font-bold mb-4">新規登録</h1>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="text"
          placeholder="ユーザー名"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border p-2 w-full"
          required
        />

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
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          登録する
        </button>
      </form>
    </main>
  );
}

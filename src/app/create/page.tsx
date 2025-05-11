"use client";

import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import MapSearchInput from "../components/MapSearchInput";

// 地図コンポーネントはSSR無効で読み込み
const MapPicker = dynamic(() => import("../components/MapPicker"), {
  ssr: false,
});

export default function CreatePostPage() {
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();
  const [category, setCategory] = useState("class");

  // state
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('投稿にはログインが必要です');
        router.push('/login');
      }
    };
    
    checkLogin();
  }, [router]);

  const onSubmit = async (data: any) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("投稿するにはログインが必要です");
        return;
      }

      const userId = session?.user.id;
      const userEmail = session?.user.email;
      const userName = session?.user.user_metadata?.name || "";

      console.log("送信データ:", {
        ...data,
        userId,
        userEmail,
        userName,
        rating: Number(data.rating),
        period: data.period ? Number(data.period) : null,
        lat,
        lng,
      });

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId,
          userEmail,
          userName,
          rating: Number(data.rating),
          period: data.period ? Number(data.period) : null,
          lat,
          lng,
        }),
      });

      const responseData = await res.json();
      
      if (res.ok) {
        alert("投稿が完了しました！");
        router.push("/");
      } else {
        console.error("APIレスポンスエラー:", responseData);
        alert(`エラー: ${responseData.error || "不明なエラーが発生しました"}`);
      }
    } catch (error) {
      console.error("投稿送信エラー:", error);
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">投稿作成</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* カテゴリ選択 */}
        <select
          {...register("category")}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="class">📘 授業</option>
          <option value="food">🍽 飲食店</option>
        </select>

        {/* 共通項目 */}
        <input
          {...register("title")}
          placeholder="タイトル"
          className="border p-2 w-full"
        />
        <textarea
          {...register("content")}
          placeholder="内容"
          className="border p-2 w-full"
        />
        <input
          {...register("rating")}
          type="number"
          min={1}
          max={5}
          placeholder="評価（1〜5）"
          className="border p-2 w-full"
        />

        {/* 授業用フィールド */}
        {category === "class" && (
          <>
            <select {...register("dayOfWeek")} className="border p-2 w-full">
              <option value="">曜日を選択</option>
              <option value="月">月</option>
              <option value="火">火</option>
              <option value="水">水</option>
              <option value="木">木</option>
              <option value="金">金</option>
              <option value="土">土</option>
            </select>
            <select {...register("period")} className="border p-2 w-full">
              <option value="">時限を選択</option>
              <option value="1">1限</option>
              <option value="2">2限</option>
              <option value="3">3限</option>
              <option value="4">4限</option>
              <option value="5">5限</option>
            </select>

            <input
              {...register("professorName")}
              placeholder="担当教員"
              className="border p-2 w-full"
            />
            <input
              {...register("faculty")}
              placeholder="学部・学科"
              className="border p-2 w-full"
            />
          </>
        )}

        {/* 飲食店用フィールド */}
        {category === "food" && (
          <>
            <input
              {...register("address")}
              placeholder="住所"
              className="border p-2 w-full"
            />
            <input
              {...register("foodTag")}
              placeholder="ジャンル（例: ラーメン）"
              className="border p-2 w-full"
            />
            <MapSearchInput setLat={setLat} setLng={setLng} />
            <MapPicker setLat={setLat} setLng={setLng} lat={lat} lng={lng} />
            {lat && lng && (
              <p className="text-sm">
                📍 緯度: {lat}, 経度: {lng}
              </p>
            )}
          </>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          投稿する
        </button>
      </form>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import BackButton from "@/app/components/BackButton";

// 地図コンポーネントを動的にインポート（SSRなし）
const MapDisplay = dynamic(() => import("@/app/components/MapDisplay"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-gray-100 flex items-center justify-center">
      地図を読み込み中...
    </div>
  ),
});

// 投稿の型を定義
interface Post {
  id: string;
  title: string;
  content: string | null;
  category: string;
  rating: number;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  createdAt: string;
  // 飲食店関連
  address: string | null;
  lat: number | null;
  lng: number | null;
  foodTag: string | null;
  // 授業関連
  dayOfWeek: string | null;
  period: number | null;
  professorName: string | null;
  faculty: string | null;
}

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // APIから投稿データを取得
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        if (!res.ok) {
          throw new Error("投稿の取得に失敗しました");
        }
        const data = await res.json();
        setPost(data.post);
      } catch (error) {
        console.error("投稿取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <p>投稿が見つかりません</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-6 text-center">
        <BackButton/>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-sm text-gray-500 mt-1">カテゴリ：{post.category}</p>
      </div>

      <div className="bg-white shadow rounded p-4 space-y-3">
        <p>
          <strong>評価：</strong>
          {"★".repeat(post.rating)}
          {"☆".repeat(5 - post.rating)}（{post.rating} / 5）
        </p>

        {post.address && (
          <p>
            <strong>住所：</strong> {post.address}
          </p>
        )}

        {post.foodTag && (
          <p>
            <strong>ジャンル：</strong> {post.foodTag}
          </p>
        )}

        {post.professorName && (
          <p>
            <strong>担当教員：</strong> {post.professorName}
          </p>
        )}
      </div>

      {post.content && (
        <div className="mt-6 bg-gray-50 rounded p-4 whitespace-pre-wrap">
          {post.content}
        </div>
      )}

      {post.lat && post.lng && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">場所</h3>
          <div className="h-64 w-full rounded-lg overflow-hidden">
            <MapDisplay lat={post.lat} lng={post.lng} />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            📍 {post.address || `緯度: ${post.lat}, 経度: ${post.lng}`}
          </p>
        </div>
      )}
    </main>
  );
}

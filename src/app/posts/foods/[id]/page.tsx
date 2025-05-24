"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import BackButton from "@/app/components/BackButton";
import { Card, CardContent } from "@/components/ui/card";

// 地図コンポーネントを動的にインポート（SSRなし）
const MapDisplay = dynamic(() => import("@/app/components/MapDisplay"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-gray-100 flex items-center justify-center">
      地図を読み込み中...
    </div>
  ),
});

// 投稿の型（飲食店用に絞る）
interface Post {
  id: string;
  title: string;
  content: string | null;
  category: string;
  rating: number;
  userName: string | null;
  createdAt: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  foodTag: string | null;
}

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        if (!res.ok) throw new Error("投稿の取得に失敗しました");
        const data = await res.json();
        setPost(data.post);
      } catch (error) {
        console.error("投稿取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchPost();
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
        <BackButton />
        <h1 className="text-3xl font-bold mt-2">{post.title}</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="py-6 space-y-4">
          {/* カテゴリ */}
          <div className="text-sm text-gray-500">カテゴリ：{post.category}</div>

          {/* 投稿者 */}
          <div className="text-sm text-gray-500">投稿者：{post.userName || "匿名"}</div>

          {/* 評価・ジャンル */}
          <div>
            <strong>評価：</strong>
            <span className="text-yellow-500 font-bold">
              {"★".repeat(post.rating)}
              {"☆".repeat(5 - post.rating)}
            </span>
            <span className="ml-2 text-gray-600">（{post.rating} / 5）</span>
          </div>
          {post.foodTag && (
            <div>
              <strong>ジャンル：</strong> {post.foodTag}
            </div>
          )}
          {post.address && (
            <div>
              <strong>住所：</strong> {post.address}
            </div>
          )}

          {/* コメント（本文） */}
          {post.content && (
            <div className="bg-gray-50 rounded p-4 whitespace-pre-wrap">
              {post.content}
            </div>
          )}

          {/* 地図 */}
          {post.lat && post.lng && (
            <div>
              <h3 className="text-lg font-medium mb-2">場所</h3>
              <div className="h-64 w-full rounded-lg overflow-hidden mb-2">
                <MapDisplay lat={post.lat} lng={post.lng} />
              </div>
              <p className="text-sm text-gray-500">
                📍 {post.address || `緯度: ${post.lat}, 経度: ${post.lng}`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      
      // ユーザー情報を取得
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("ログインが必要です");
        router.push("/login");
        return;
      }
      
      try {
        // ユーザーの投稿を取得 (Prisma APIを使用)
        const response = await fetch(`/api/posts/user?userId=${user.id}`);
        if (!response.ok) {
          throw new Error("投稿の取得に失敗しました");
        }
        
        const data = await response.json();
        console.log("取得されたデータ:", data);
        
        setProfile({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || "名前未設定",
        });
        
        setPosts(data.posts || []);
      } catch (error) {
        console.error("データ取得エラー:", error);
        alert(`エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [router]);
  
  if (loading) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* 戻るボタンを追加 */}
      <div className="mb-4">
        <Link 
          href="/" 
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          トップページに戻る
        </Link>
      </div>

      {/* プロフィールカード */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl">
            {profile?.name?.charAt(0).toUpperCase() || "?"}
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile?.name}</h1>
            <p className="text-gray-500">{profile?.email}</p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg text-center min-w-[100px]">
            <div className="text-2xl font-bold">{posts.length}</div>
            <div className="text-sm text-gray-500">投稿</div>
          </div>
        </div>
      </div>
      
      {/* 投稿一覧 */}
      <h2 className="text-xl font-bold mb-4 border-b pb-2">あなたの投稿</h2>
      
      {posts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">まだ投稿がありません</p>
          <Link 
            href="/create" 
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            最初の投稿を作成する
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <Link href={`/posts/${post.category}s/${post.id}`} key={post.id}>
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 h-full">
                <div className="flex items-center mb-2">
                  <span className={`text-sm px-2 py-1 rounded ${
                    post.category === 'class' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {post.category === 'class' ? '授業' : '飲食店'}
                  </span>
                  <span className="ml-auto text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <div className="text-yellow-500 mb-2">
                  {"★".repeat(post.rating)}{"☆".repeat(5 - post.rating)}
                </div>
                <p className="text-gray-600 line-clamp-3">{post.content}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

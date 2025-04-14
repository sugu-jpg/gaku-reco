import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { PostType } from "types/post"

export default async function HomePage() {
  const popularClasses = await prisma.post.findMany({
    where: { category: "class" },
    orderBy: { rating: "desc" },
    take: 3,
    include: { user: true },
  })

  const popularFoods = await prisma.post.findMany({
    where: { category: "food" },
    orderBy: { rating: "desc" },
    take: 3,
    include: { user: true },
  })

  return (
    <main className="p-6 space-y-12">
      {/* Hero セクション */}
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold">👋 GakuRecoへようこそ！</h1>
        <p className="text-gray-600">学生のおすすめ授業・飲食店をみんなで共有しよう</p>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="/posts/classes" className="bg-blue-500 text-white px-4 py-2 rounded">
            📘 授業を探す
          </Link>
          <Link href="/posts/foods" className="bg-green-500 text-white px-4 py-2 rounded">
            🍽 飲食店を探す
          </Link>
          <Link href="/create" className="bg-yellow-500 text-white px-4 py-2 rounded">
            ✏️ 投稿する
          </Link>
        </div>
      </section>

      {/* 人気の投稿 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">🔥 人気の投稿（★評価順）</h2>

        {/* 授業の人気投稿 */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">📘 授業</h3>
          <div className="flex gap-4 overflow-x-auto">
            {popularClasses.map((post: PostType) => (
              <div key={post.id} className="min-w-[200px] p-4 border rounded shadow">
                <p className="font-bold">{post.title}</p>
                <p className="text-sm text-gray-600">評価: ★{post.rating}</p>
                <p className="text-sm text-gray-500">{post.user?.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 飲食店の人気投稿 */}
        <div>
          <h3 className="text-xl font-bold mb-2">🍽️ 飲食店</h3>
          <div className="flex gap-4 overflow-x-auto">
            {popularFoods.map((post: PostType) => (
              <div key={post.id} className="min-w-[200px] p-4 border rounded shadow">
                <p className="font-bold">{post.title}</p>
                <p className="text-sm text-gray-600">評価: ★{post.rating}</p>
                <p className="text-sm text-gray-500">{post.user?.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 未ログイン向けの案内（あとで条件分岐で表示） */}
      <section className="text-center border-t pt-6">
        <p className="text-sm text-gray-500">投稿にはログインが必要です。</p>
        <Link href="/login" className="text-blue-500 underline">🔐 ログインして投稿する</Link>
      </section>

      {/* フッター */}
      <footer className="text-center text-sm text-gray-400 border-t pt-6">
        <p>© 2025 GakuReco</p>
        <p>このアプリについて / GitHub（任意） / 注意事項など</p>
      </footer>
    </main>
  )
}

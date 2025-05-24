import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { PostType } from "types/post"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

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
    <main className="max-w-6xl mx-auto p-6 space-y-16">
      {/* Hero セクション */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-sm">
        <h1 className="text-4xl font-bold mb-4">👋 GakuRecoへようこそ！</h1>
        <p className="text-gray-600 text-lg mb-8">学生のおすすめ授業・飲食店をみんなで共有しよう</p>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Link href="/posts/classes" className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-6 py-3 rounded-lg shadow-md flex items-center">
            <span className="text-xl mr-2">📘</span> 授業を探す
          </Link>
          <Link href="/posts/foods" className="bg-green-500 hover:bg-green-600 transition-colors text-white px-6 py-3 rounded-lg shadow-md flex items-center">
            <span className="text-xl mr-2">🍽</span> 飲食店を探す
          </Link>
          <Link href="/create" className="bg-yellow-500 hover:bg-yellow-600 transition-colors text-white px-6 py-3 rounded-lg shadow-md flex items-center">
            <span className="text-xl mr-2">✏️</span> 投稿する
          </Link>
        </div>
      </section>

      {/* 人気の投稿 */}
      <section>
        <h2 className="text-2xl font-semibold mb-8 border-b pb-2">🔥 人気の投稿（★評価順）</h2>

        {/* 授業の人気投稿 */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-blue-100 p-2 rounded-full mr-2">📘</span> 授業
            <Link href="/posts/classes" className="ml-auto text-sm text-blue-500 hover:underline">もっと見る →</Link>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularClasses.map((post: PostType) => (
              <Link href={`/posts/classes/${post.id}`} key={post.id} className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <div className="text-yellow-500 font-bold">★{post.rating}</div>
                      <div className="ml-2 text-sm text-gray-600">/ 5.0</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm text-gray-500 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2 font-medium">
                        {post.user?.name?.charAt(0) || "?"}
                      </div>
                      {post.user?.name}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 飲食店の人気投稿 */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="bg-green-100 p-2 rounded-full mr-2">🍽️</span> 飲食店
            <Link href="/posts/foods" className="ml-auto text-sm text-green-500 hover:underline">もっと見る →</Link>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularFoods.map((post: PostType) => (
              <Link href={`/posts/foods/${post.id}`} key={post.id} className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <div className="text-yellow-500 font-bold">★{post.rating}</div>
                      <div className="ml-2 text-sm text-gray-600">/ 5.0</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm text-gray-500 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mr-2 font-medium">
                        {post.user?.name?.charAt(0) || "?"}
                      </div>
                      {post.user?.name}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 未ログイン向けの案内 */}
      <section className="text-center p-8 border rounded-lg bg-blue-50">
        <p className="text-lg mb-4">アカウントをお持ちですか？</p>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="bg-white text-blue-500 border border-blue-500 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">🔐 ログイン</Link>
          <Link href="/signup" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">✨ 新規登録</Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="text-center text-sm text-gray-500 border-t pt-8">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/about" className="hover:text-blue-500 transition-colors">このアプリについて</Link>
          <Link href="https://github.com/your-repo/gaku-reco" className="hover:text-blue-500 transition-colors">GitHub</Link>
          <Link href="/terms" className="hover:text-blue-500 transition-colors">利用規約</Link>
        </div>
        <p>© 2025 GakuReco</p>
      </footer>

      {/* 投稿ボタン */}
      <div className="fixed bottom-6 right-6 z-10">
        <Link 
          href="/create" 
          className="flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>

      
    </main>
  )
}
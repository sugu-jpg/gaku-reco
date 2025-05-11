import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BackButton from "@/app/components/BackButton";

export default async function ClassPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!post || post.category !== "class") {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <BackButton className="text-blue-500 hover:underline mb-6 inline-block" />
      
      <article className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center mb-4">
          <div className="text-yellow-500 font-bold text-xl">★{post.rating}</div>
          <div className="ml-2 text-gray-600">/ 5.0</div>
        </div>
        
        {/* 授業情報セクション */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-lg mb-3 border-b pb-2">授業情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {post.dayOfWeek && post.period && (
              <div className="flex">
                <span className="font-medium w-24">開講日時:</span>
                <span>{post.dayOfWeek}曜 {post.period}限</span>
              </div>
            )}
            
            {post.professorName && (
              <div className="flex">
                <span className="font-medium w-24">担当教員:</span>
                <span>{post.professorName}</span>
              </div>
            )}
            
            {post.faculty && (
              <div className="flex">
                <span className="font-medium w-24">学部・学科:</span>
                <span>{post.faculty}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-6 text-sm text-gray-500">
          投稿者: {post.user?.name || "匿名"}
        </div>
        
        {post.content && (
          <div className="mt-4">
            <h2 className="font-semibold text-lg mb-2">レビュー内容</h2>
            <div className="prose max-w-none whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {post.content}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}

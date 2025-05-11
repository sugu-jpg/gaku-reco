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
        
        <div className="mb-6 text-sm text-gray-500">
          投稿者: {post.user?.name || "匿名"}
        </div>
        
        <div className="prose max-w-none">
          {post.content}
        </div>
      </article>
    </main>
  );
}

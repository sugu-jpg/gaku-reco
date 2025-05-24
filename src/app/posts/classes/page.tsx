// src/app/posts/classes/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";

export default async function ClassListPage() {
  const classPosts = await prisma.post.findMany({
    where: { category: "class" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-4xl mx-auto p-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">📘 授業一覧</h1>
      <div className="grid gap-4">
        {classPosts.map((post) => (
          <Link href={`/posts/classes/${post.id}`} key={post.id} className="block">
            <div className="border p-4 rounded shadow hover:shadow-md transition-shadow cursor-pointer">
              <h2 className="text-lg font-bold">{post.title}</h2>
              <p>評価：{post.rating} / 5</p>
              {post.professorName && <p>担当教員：{post.professorName}</p>}
              {post.dayOfWeek && post.period && (
                <p>
                  曜日・時限：{post.dayOfWeek}・{post.period}限
                </p>
              )}
              {post.faculty && <p>学部：{post.faculty}</p>}
              {post.content && (
                <p className="text-sm text-gray-600 mt-2">{post.content}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

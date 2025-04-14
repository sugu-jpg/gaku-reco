// src/app/posts/classes/page.tsx
import BackButton from "@/app/components/BackButton";
import MiniMap from "@/app/components/MiniMap";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ClassListPage() {
  const classPosts = await prisma.post.findMany({
    where: { category: "food" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-4xl mx-auto p-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">📘 飲食店一覧</h1>
      <div className="grid gap-4">
        {classPosts.map((post) => (
          <div key={post.id} className="border p-4 rounded shadow flex gap-4">
            {/* 左側：情報エリア（リンク付き） */}
            <Link
              href={`/posts/foods/${post.id}`}
              className="flex-1 hover:opacity-80"
            >
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
            </Link>

            {/* 右側：地図エリア（リンク外） */}
            {post.lat && post.lng && (
              <div className="w-48 h-36">
                <MiniMap lat={post.lat} lng={post.lng} />
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

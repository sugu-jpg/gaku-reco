// src/app/posts/classes/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";

export default async function ClassListPage({ searchParams }: { searchParams: { dayOfWeek?: string; period?: string } }) {
  const { dayOfWeek, period } = searchParams || {};

  const where: any = { category: "class" };
  if (dayOfWeek) where.dayOfWeek = dayOfWeek;
  if (period) where.period = Number(period);

  const classPosts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-4xl mx-auto p-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">📘 授業一覧</h1>
      <form method="GET" className="mb-4 flex gap-2">
        <select name="dayOfWeek" defaultValue={dayOfWeek || ""} className="border rounded p-1">
          <option value="">曜日を選択</option>
          <option value="月">月</option>
          <option value="火">火</option>
          <option value="水">水</option>
          <option value="木">木</option>
          <option value="金">金</option>
        </select>
        <select name="period" defaultValue={period || ""} className="border rounded p-1">
          <option value="">時限を選択</option>
          <option value="1">1限</option>
          <option value="2">2限</option>
          <option value="3">3限</option>
          <option value="4">4限</option>
          <option value="5">5限</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">絞り込み</button>
      </form>
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

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostMap from "@/app/components/PostMap";
import BackButton from "@/app/components/BackButton";

type Props = {
  params: {
    id: string;
  };
};

export default async function PostDetailPage({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    return notFound;
  }


  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
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

      {post.lat && post.lng && <PostMap lat={post.lat} lng={post.lng} />}
    </main>
  );
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: { id: string } };

export async function GET(request: Request, { params }: Params) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json(
        { error: "投稿IDが必要です" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: "投稿が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("投稿取得エラー:", error);
    return NextResponse.json(
      { error: "投稿の取得に失敗しました", details: String(error) },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // URL から投稿IDを取得
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // 末尾のID部分を取得

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

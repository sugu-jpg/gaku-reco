import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  
  if (!userId) {
    return NextResponse.json({ error: "ユーザーIDが必要です" }, { status: 400 })
  }
  
  try {
    const posts = await prisma.post.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    })
    
    console.log(`ユーザー ${userId} の投稿を ${posts.length} 件取得しました`)
    
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("投稿取得エラー:", error)
    return NextResponse.json(
      { error: "投稿の取得に失敗しました", details: String(error) },
      { status: 500 }
    )
  }
}

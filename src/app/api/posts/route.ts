import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("受信したリクエストボディ:", body)
    
    const {
      category,
      title,
      content,
      rating,
      userId,
      userEmail,
      userName,

      // 授業用
      dayOfWeek,
      period,
      professorName,
      faculty,

      // 飲食店用
      address,
      lat,
      lng,
      foodTag,
    } = body

    // ユーザーIDの確認
    if (!userId) {
      console.error("ユーザーIDがありません")
      return NextResponse.json(
        { error: "ユーザーIDが必要です" },
        { status: 400 }
      )
    }

    // 必須フィールドの確認
    if (!title || !category || !rating) {
      console.error("必須フィールドが不足しています")
      return NextResponse.json(
        { error: "タイトル、カテゴリ、評価は必須です" },
        { status: 400 }
      )
    }

    console.log("ユーザーupsert実行:", { userId, userName, userEmail })

    // ✅ 投稿前にユーザーが存在しない場合は作成（upsert）
    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: {}, // 更新しない
        create: {
          id: userId,
          name: userName || "名前なし",
          email: userEmail || `user-${userId}@example.com`,
        },
      })
    } catch (userError) {
      console.error("ユーザー作成エラー:", userError)
      return NextResponse.json(
        { error: "ユーザー作成に失敗しました", details: String(userError) },
        { status: 500 }
      )
    }

    console.log("投稿データ作成準備:", {
      title,
      category,
      rating: Number(rating),
    })

    // 投稿作成
    try {
      const newPost = await prisma.post.create({
        data: {
          title,
          content: content || "",
          category,
          rating: Number(rating),
          userId,
          userName: userName || null,
          userEmail: userEmail || null,

          // 授業用
          dayOfWeek: dayOfWeek || null,
          period: period ? Number(period) : null,
          professorName: professorName || null,
          faculty: faculty || null,

          // 飲食店用
          address: address || null,
          lat: lat ? parseFloat(String(lat)) : null,
          lng: lng ? parseFloat(String(lng)) : null,
          foodTag: foodTag || null,
        },
      })

      console.log("投稿作成成功:", newPost.id)
      return NextResponse.json(newPost, { status: 201 })
    } catch (postError) {
      console.error("投稿作成エラー:", postError)
      return NextResponse.json(
        { error: "投稿作成に失敗しました", details: String(postError) },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("APIエラー:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました", details: String(error) },
      { status: 500 }
    )
  }
}

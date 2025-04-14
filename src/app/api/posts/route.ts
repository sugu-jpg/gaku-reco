import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
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

  // ✅ 投稿前にユーザーが存在しない場合は作成（upsert）
  await prisma.user.upsert({
    where: { id: userId },
    update: {}, // 更新しない
    create: {
      id: userId,
      name: userName,
      email: userEmail,
    },
  })

  // 投稿作成
  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      category,
      rating: Number(rating),
      userId,
      userName,
      userEmail,

      // 授業用
      dayOfWeek,
      period: period ? Number(period) : null,
      professorName,
      faculty,

      // 飲食店用
      address,
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      foodTag,
    },
  })

  return NextResponse.json(newPost, { status: 201 })
}

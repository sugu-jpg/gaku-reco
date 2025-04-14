import { supabase } from "@/lib/supabase"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json([], { status: 200 }) // ←空配列で返すと map が安全！
  }

  const posts = await prisma.post.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(posts)
}

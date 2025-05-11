import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { id, email, name } = await request.json();

    if (!id || !email) {
      return NextResponse.json(
        { error: "ユーザーIDとメールアドレスは必須です" },
        { status: 400 }
      );
    }

    // ユーザーをupsert（存在しなければ作成、存在すれば更新しない）
    const user = await prisma.user.upsert({
      where: { id },
      update: {}, // 既存のユーザーは更新しない
      create: {
        id,
        email,
        name: name || "名前なし",
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('ユーザー作成エラー:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '不明なエラー' },
      { status: 500 }
    );
  }
}

"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button variant="outline" onClick={() => router.back()}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      戻る
    </Button>
  );
}

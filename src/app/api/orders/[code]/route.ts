import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shapeOrder } from "../route";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const row = await db.order.findUnique({
    where: { code },
    include: { restaurant: { select: { name: true, image: true } } },
  });
  if (!row) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ order: shapeOrder(row) });
}

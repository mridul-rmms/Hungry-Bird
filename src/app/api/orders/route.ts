import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Demo lifecycle: order advances on its own so live tracking feels real.
 *  placed 0-45s → confirmed 45-105s → cooking 105-255s → picked 255-390s → delivered 390s+ */
export function effectiveStatus(createdAt: Date, stored: string): string {
  if (stored === "delivered" || stored === "cancelled") return stored;
  const t = (Date.now() - createdAt.getTime()) / 1000;
  if (t < 45) return "placed";
  if (t < 105) return "confirmed";
  if (t < 255) return "cooking";
  if (t < 390) return "picked";
  return "delivered";
}

export function shapeOrder(o: {
  id: string; code: string; status: string; eta: number; createdAt: Date;
  items: string; subtotal: number; delivery: number; taxes: number; discount: number;
  total: number; coupon: string | null; address: string; payment: string;
  restaurant: { name: string; image: string };
}) {
  return {
    id: o.id,
    code: o.code,
    restaurantName: o.restaurant.name,
    restaurantImage: o.restaurant.image,
    items: JSON.parse(o.items) as unknown[],
    subtotal: o.subtotal,
    delivery: o.delivery,
    taxes: o.taxes,
    discount: o.discount,
    total: o.total,
    coupon: o.coupon,
    address: o.address,
    payment: o.payment,
    status: effectiveStatus(o.createdAt, o.status) as never,
    eta: o.eta,
    createdAt: o.createdAt.toISOString(),
  };
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const rows = await db.order.findMany({
    where: email ? { email } : undefined,
    include: { restaurant: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return NextResponse.json({ orders: rows.map(shapeOrder) });
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    if (!Array.isArray(b.items) || b.items.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    if (!b.address || String(b.address).trim().length < 8) return NextResponse.json({ error: "Delivery address required" }, { status: 400 });

    const restaurant = await db.restaurant.findUnique({ where: { slug: b.restaurantSlug } });
    if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });

    let user = null;
    if (b.email) {
      user = await db.user.upsert({ where: { email: b.email }, update: {}, create: { email: b.email } });
    }

    const eta = restaurant.etaMax + 4;
    const code = `HB${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now() % 100}`;

    const created = await db.order.create({
      data: {
        code,
        userId: user?.id ?? null,
        email: b.email ?? null,
        restaurantId: restaurant.id,
        items: JSON.stringify(b.items),
        subtotal: Math.round(b.subtotal),
        delivery: Math.round(b.delivery),
        taxes: Math.round(b.taxes),
        discount: Math.round(b.discount ?? 0),
        total: Math.round(b.total),
        coupon: b.coupon ?? null,
        address: String(b.address).slice(0, 300),
        payment: b.payment ?? "upi",
        eta,
      },
      include: { restaurant: { select: { name: true, image: true } } },
    });

    return NextResponse.json({ order: shapeOrder(created) });
  } catch {
    return NextResponse.json({ error: "Could not place order" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.restaurant.findMany({
    include: { dishes: { orderBy: [{ bestseller: "desc" }, { rating: "desc" }] } },
  });

  const restaurants = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    cuisines: r.cuisines.split(","),
    rating: r.rating,
    ratingCount: r.ratingCount,
    etaMin: r.etaMin,
    etaMax: r.etaMax,
    distance: r.distance,
    fee: r.fee,
    costForTwo: r.costForTwo,
    pureVeg: r.pureVeg,
    promoted: r.promoted,
    image: r.image,
    moods: r.moods.split(",").filter(Boolean),
    menu: r.dishes.map((d) => ({
      id: d.id,
      restaurantId: d.restaurantId,
      restaurantSlug: r.slug,
      restaurantName: r.name,
      name: d.name,
      desc: d.desc,
      price: d.price,
      rating: d.rating,
      section: d.section,
      veg: d.veg,
      spice: d.spice,
      kcal: d.kcal,
      prepMin: d.prepMin,
      image: d.image,
      bestseller: d.bestseller,
    })),
  }));

  return NextResponse.json({ restaurants });
}

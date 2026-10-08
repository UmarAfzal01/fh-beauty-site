import { notFound } from "next/navigation";
import ItemDetailClient from "@/components/ItemDetailClient";
import ProductReviews from "@/components/ProductReviews";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

async function getItemData(type, slug) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/items?type=${type}&slug=${slug}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const data = await res.json();

    const items = Array.isArray(data) ? data : data.items || [data];
    const found = items.find(
      (item) =>
        item.slug?.toLowerCase() === slug.toLowerCase() &&
        item.type?.toLowerCase() === type.toLowerCase(),
    );
    return found || null;
  } catch (err) {
    console.error("Failed to fetch item details:", err);
    return null;
  }
}

export default async function DynamicItemPage({ params }) {
  const { type, slug } = await params;
  const item = await getItemData(type, slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Header/>
      <ItemDetailClient item={item} />
      <ProductReviews itemId={item._id} initialReviews={item.reviews || []} />
      <Footer />
    </>
  );
}

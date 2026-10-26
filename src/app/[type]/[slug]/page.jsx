import { cache } from "react";
import { notFound } from "next/navigation";
import ItemDetailClient from "@/components/ItemDetailClient";
import ProductReviews from "@/components/ProductReviews";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

// Use your live domain as the fallback base URL for production on Vercel
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = "Dr Warda Sikander";

// cache() makes generateMetadata and the page share ONE fetch per request
const getItemData = cache(async (type, slug) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/items?type=${type}&slug=${slug}`,
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
});

// Strip HTML tags / extra whitespace and trim to a good meta-description length
function toMetaDescription(text, maxLength = 160) {
  const clean = (text || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength - 1).replace(/\s+\S*$/, "") + "…";
}

export async function generateMetadata({ params }) {
  const { type, slug } = await params;
  const item = await getItemData(type, slug);

  if (!item) {
    return {
      title: "Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${item.name} | ${SITE_NAME}`;
  const description =
    toMetaDescription(item.description) ||
    `Learn more about ${item.name} and book your appointment with ${SITE_NAME}.`;

  const canonicalUrl = `${BASE_URL}/${type}/${slug}`;

  const images = (item.images || [])
    .filter((img) => img?.url)
    .slice(0, 4)
    .map((img) => ({
      url: img.url,
      alt: img.alt || item.name,
    }));

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      images,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title,
      description,
      images: images.map((img) => img.url),
    },
  };
}

export default async function DynamicItemPage({ params }) {
  const { type, slug } = await params;
  const item = await getItemData(type, slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Header />
      <ItemDetailClient item={item} />
      <ProductReviews itemId={item._id} initialReviews={item.reviews || []} />
      <Footer />
    </>
  );
}

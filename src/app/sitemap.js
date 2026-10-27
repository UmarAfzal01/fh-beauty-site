import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product"; // adjust to your model

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://drwardasikandar.com";

// Regenerate at most once an hour so new products show up without a redeploy
export const revalidate = 3600;

export default async function sitemap() {
  // Static pages: edit this list to match your real routes
  const staticRoutes = ["", "/about", "/services", "/contact", "/appointment", "/products", "/bundles"].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.7,
    }),
  );

  // Dynamic pages: /product/[slug]
  let productRoutes = [];
  try {
    await dbConnect();
    const products = await Product.find({}, "slug updatedAt").lean();
    productRoutes = products
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${BASE_URL}/product/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
  } catch (err) {
    // Don't fail the sitemap (or the build) if the DB is unreachable
    console.error("Sitemap: failed to load products", err);
  }

  return [...staticRoutes, ...productRoutes];
}
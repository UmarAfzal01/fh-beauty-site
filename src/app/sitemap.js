import dbConnect from "@/lib/dbConnect";
import { Item } from "@/models/Item"; // named export; adjust the path if your file is named differently

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://drwardasikandar.com";

export const revalidate = 3600;

// URL prefix for each Item type. Edit these to match your real detail routes.
const TYPE_PATHS = {
  Product: "/product",
  Bundle: "/bundle",
  Service: "/service",
};

export default async function sitemap() {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/contact",
    "/appointment",
    "/products",
    "/bundles",
    "/doctors",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  let itemRoutes = [];
  try {
    await dbConnect();
    // Projection keeps the reviews array (and other heavy fields) out of the query
    const items = await Item.find({}, "slug type updatedAt").lean();
    itemRoutes = items
      .filter((item) => item.slug && TYPE_PATHS[item.type])
      .map((item) => ({
        url: `${BASE_URL}${TYPE_PATHS[item.type]}/${item.slug}`,
        lastModified: item.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: item.type === "Product" ? 0.8 : 0.7,
      }));
  } catch (err) {
    console.error("Sitemap: failed to load items", err);
  }

  return [...staticRoutes, ...itemRoutes];
}
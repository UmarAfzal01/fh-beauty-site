const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://drwardasikandar.com";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}   
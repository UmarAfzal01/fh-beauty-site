import { Suspense } from "react";
import dbConnect from "@/lib/dbConnect";
import { Item } from "@/models/Item"; // <-- adjust this path to wherever your Item model lives
import AppointmentForm from "../../components/AppointmentForm";

// Always read fresh services from the database
export const dynamic = "force-dynamic";

async function getServices() {
  try {
    await dbConnect();
    // Fetch only items where type is "Service"
    const services = await Item.find({ type: "Service" }).lean();
    return JSON.parse(JSON.stringify(services));
  } catch (err) {
    console.error("Failed to fetch services:", err);
    return [];
  }
}

export default async function AppointmentPage() {
  const services = await getServices();

  // The client form only needs the service names
  const serviceNames = services.map((s) => s.name).filter(Boolean);

  return (
    // useSearchParams() in the client component needs a Suspense boundary
    <Suspense fallback={null}>
      <AppointmentForm services={serviceNames} />
    </Suspense>
  );
}

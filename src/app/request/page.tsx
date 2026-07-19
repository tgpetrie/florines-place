import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { StayRequestForm } from "@/components/stay-request-form";
import { formatIsoDate } from "@/lib/date-ranges";

export const metadata: Metadata = { title: "Request a Stay" };

export const dynamic = "force-dynamic";

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ arrival?: string; departure?: string }>;
}) {
  const params = await searchParams;
  const initialArrival = /^\d{4}-\d{2}-\d{2}$/.test(params.arrival ?? "") ? params.arrival : "";
  const initialDeparture = /^\d{4}-\d{2}-\d{2}$/.test(params.departure ?? "") ? params.departure : "";
  const minimumDate = formatIsoDate(new Date());

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Request a Stay"
        title="Ask for your days on the canal"
        lede="Tell the family when you'd like to come and who's coming with you. Someone will get back to you — usually quickly, always warmly."
      />
      <div className="px-4 sm:px-6">
        <StayRequestForm
          initialArrival={initialArrival}
          initialDeparture={initialDeparture}
          minimumDate={minimumDate}
        />
      </div>
    </div>
  );
}

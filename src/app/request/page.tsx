import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { StayRequestForm } from "@/components/stay-request-form";

export const metadata: Metadata = { title: "Request a Stay" };

export default function RequestPage() {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Request a Stay"
        title="Ask for your days on the canal"
        lede="Tell the family when you'd like to come and who's coming with you. Someone will get back to you — usually quickly, always warmly."
      />
      <div className="px-4 sm:px-6">
        <StayRequestForm />
      </div>
    </div>
  );
}

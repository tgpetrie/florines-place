import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { AccessRequestForm } from "@/components/access-request-form";

export const metadata: Metadata = { title: "Request Access" };

export default function RequestAccessPage() {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Request Access"
        title="Ask to join the family"
        lede="Florine's Place is invite-only. Tell us who you are and a family admin will follow up."
      />
      <div className="px-4 sm:px-6">
        <AccessRequestForm />
      </div>
    </div>
  );
}

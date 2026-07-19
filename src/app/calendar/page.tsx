import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CalendarPageClient } from "@/components/calendar-page-client";
import { APP_MODE, DEMO_START_MONTH } from "@/lib/app-mode";
import { formatIsoDate, monthWindow } from "@/lib/date-ranges";
import { familyPlans } from "@/data/calendar";

export const metadata: Metadata = { title: "Availability" };
export const dynamic = "force-dynamic";

export default function CalendarPage() {
  const now = new Date();
  const liveStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const months = monthWindow(APP_MODE === "demo" ? DEMO_START_MONTH : liveStart);
  const today = formatIsoDate(now);

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Availability"
        title="When can people go?"
        lede="See who's requested dates, what's approved, and what the family is quietly considering — so nobody overlaps and everybody gets their days on the water."
      />

      <CalendarPageClient
        mode={APP_MODE}
        months={months}
        today={today}
        demoFamilyPlans={APP_MODE === "demo" ? familyPlans : []}
      />
    </div>
  );
}

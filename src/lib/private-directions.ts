import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

export const approverChoices = [
  { id: "tom", name: "Tom" },
  { id: "kate", name: "Kate" },
  { id: "peggy", name: "Peggy" },
  { id: "greg", name: "Greg" },
] as const;

export type ApproverId = (typeof approverChoices)[number]["id"];

const approverEnv: Record<ApproverId, string | undefined> = {
  tom: process.env.DIRECTIONS_APPROVER_TOM,
  kate: process.env.DIRECTIONS_APPROVER_KATE,
  peggy: process.env.DIRECTIONS_APPROVER_PEGGY,
  greg: process.env.DIRECTIONS_APPROVER_GREG,
};

export function getPrivateDirectionsConfig() {
  const address = process.env.CABIN_PRIVATE_ADDRESS?.trim();
  const passcode = process.env.CABIN_DIRECTIONS_PASSCODE?.trim();
  const wifiName = process.env.CABIN_WIFI_NAME?.trim();
  const wifiPassword = process.env.CABIN_WIFI_PASSWORD?.trim();
  const doorCode = process.env.CABIN_DOOR_CODE?.trim();

  if (!address || !passcode || !wifiName || !wifiPassword || !doorCode) return null;
  return { address, passcode, wifiName, wifiPassword, doorCode };
}

export function isApproverId(value: string): value is ApproverId {
  return approverChoices.some((choice) => choice.id === value);
}

export function getApprover(value: string) {
  if (!isApproverId(value)) return null;
  const email = approverEnv[value]?.trim();
  const choice = approverChoices.find((item) => item.id === value);
  if (!email || !choice) return null;
  return { ...choice, email };
}

export function passcodeMatches(received: string, expected: string): boolean {
  const receivedHash = createHash("sha256").update(received).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(receivedHash, expectedHash);
}

export function googleMapsDirectionsUrl(address: string): string {
  const query = new URLSearchParams({
    api: "1",
    destination: address,
    travelmode: "driving",
    dir_action: "navigate",
  });
  return `https://www.google.com/maps/dir/?${query.toString()}`;
}

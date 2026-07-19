import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Shared plumbing for the open, anonymous public boards (Porch Notes,
 * Guestbook): parse + validate a posted form, optionally upload an image,
 * and resolve a stored image path to a public URL.
 */

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()0-9][0-9\s().-]{6,}$/;

export interface ParsedBoardPost {
  posterName: string;
  contact: string;
  message: string;
  category?: string;
  imageFile: File | null;
}

export type ParseResult =
  | { ok: true; post: ParsedBoardPost }
  | { ok: false; error: string };

function clean(value: FormDataEntryValue | null, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export function isValidContact(contact: string): boolean {
  return EMAIL_PATTERN.test(contact) || PHONE_PATTERN.test(contact);
}

export async function parseBoardPostForm(
  request: Request,
  options: { categories?: readonly string[] } = {},
): Promise<ParseResult> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return { ok: false, error: "Complete the form before sending." };
  }

  const posterName = clean(form.get("posterName"), 80);
  const contact = clean(form.get("contact"), 160);
  const message = clean(form.get("message"), 1000);
  const category = options.categories ? clean(form.get("category"), 40) : undefined;

  if (posterName.length < 2) {
    return { ok: false, error: "Enter your first name and last initial." };
  }
  if (!isValidContact(contact)) {
    return { ok: false, error: "Enter a phone number or email so the family can reach you if needed." };
  }
  if (message.length < 1) {
    return { ok: false, error: "Write a message before sending." };
  }
  if (options.categories && (!category || !(options.categories as string[]).includes(category))) {
    return { ok: false, error: "Choose what kind of note this is." };
  }

  const imageEntry = form.get("image");
  let imageFile: File | null = null;
  if (imageEntry instanceof File && imageEntry.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.has(imageEntry.type)) {
      return { ok: false, error: "Images must be JPEG, PNG, WEBP, or GIF." };
    }
    if (imageEntry.size > MAX_IMAGE_BYTES) {
      return { ok: false, error: "Images must be under 8 MB." };
    }
    imageFile = imageEntry;
  }

  return { ok: true, post: { posterName, contact, message, category, imageFile } };
}

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function uploadBoardImage(
  file: File,
  folder: string,
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const supabase = createSupabaseAdmin();
  const extension = EXTENSION_BY_TYPE[file.type] ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("board-uploads")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return { ok: false, error: "The image could not be uploaded." };
  return { ok: true, path };
}

export function publicImageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  const supabase = createSupabaseAdmin();
  const { data } = supabase.storage.from("board-uploads").getPublicUrl(path);
  return data.publicUrl;
}

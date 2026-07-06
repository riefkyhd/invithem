import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getStoragePublicUrl } from "@/lib/supabase/storage";

describe("getStoragePublicUrl", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  });

  it("builds public storage URL", () => {
    expect(getStoragePublicUrl("gallery", "proj-1/photo.jpg")).toBe(
      "https://test.supabase.co/storage/v1/object/public/gallery/proj-1/photo.jpg"
    );
  });
});

import { Suspense } from "react";
import { InvitationPage } from "@/components/invitation/InvitationPage";
import { createClient } from "@/lib/supabase/server";
import type { AdminSettings, Wish } from "@/lib/types/database";

export const dynamic = "force-dynamic";

async function getSettings(): Promise<AdminSettings | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("admin_settings")
      .select("*")
      .eq("id", 1)
      .single();
    return data as AdminSettings | null;
  } catch {
    return null;
  }
}

async function getWishes(): Promise<Wish[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("wishes")
      .select("*")
      .eq("is_hidden", false)
      .order("created_at", { ascending: false })
      .limit(50);
    return (data as Wish[]) ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [settings, wishes] = await Promise.all([getSettings(), getWishes()]);

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <InvitationPage settings={settings} wishes={wishes} />
    </Suspense>
  );
}

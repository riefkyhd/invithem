import { getAccountProfile } from "@/app/admin/actions";
import { AccountSettingsClient } from "@/components/admin/AccountSettingsClient";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const profile = await getAccountProfile();

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader
        title="Account settings"
        description="Your Invithem account — separate from individual wedding projects."
      />
      {profile ? (
        <AccountSettingsClient email={profile.email} createdAt={profile.createdAt} />
      ) : (
        <p className="text-sm text-muted">Unable to load account.</p>
      )}
    </div>
  );
}

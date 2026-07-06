"use client";

import { signOut } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";

interface AccountSettingsClientProps {
  email: string;
  createdAt: string;
}

export function AccountSettingsClient({
  email,
  createdAt,
}: AccountSettingsClientProps) {
  const joined = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      <FormSection
        title="Profile"
        description="Signed-in account for all your invitation projects."
      >
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-muted">
              Email
            </dt>
            <dd className="mt-1 font-medium">{email}</dd>
          </div>
          {joined && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted">
                Member since
              </dt>
              <dd className="mt-1">{joined}</dd>
            </div>
          )}
        </dl>
      </FormSection>

      <FormSection
        title="Session"
        description="Sign out of Invithem on this device."
      >
        <form action={signOut}>
          <Button type="submit" variant="secondary">
            Sign out
          </Button>
        </form>
      </FormSection>

      <p className="text-xs text-muted">
        Project-specific settings (couple names, events, guests, design) live inside
        each project under <strong>Settings</strong> in the project navigation.
      </p>
    </div>
  );
}

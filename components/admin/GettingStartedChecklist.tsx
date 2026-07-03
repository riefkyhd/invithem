import Link from "next/link";
import {
  getGettingStartedProgress,
  updateProjectStatus,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

interface GettingStartedChecklistProps {
  projectId: string;
}

const items = [
  {
    key: "hasNames" as const,
    label: "Add couple names",
    href: (id: string) => `/admin/projects/${id}/settings`,
  },
  {
    key: "hasTemplate" as const,
    label: "Choose a design template",
    href: (id: string) => `/admin/projects/${id}/design`,
  },
  {
    key: "hasEvent" as const,
    label: "Set ceremony & reception details",
    href: (id: string) => `/admin/projects/${id}/settings`,
  },
  {
    key: "hasGuest" as const,
    label: "Add at least one guest",
    href: (id: string) => `/admin/projects/${id}/guests`,
  },
  {
    key: "isPublished" as const,
    label: "Publish your invitation",
    href: null,
  },
];

export async function GettingStartedChecklist({
  projectId,
}: GettingStartedChecklistProps) {
  const progress = await getGettingStartedProgress(projectId);

  if (progress.completed) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
        <p className="font-display text-lg text-accent">
          You&apos;re all set!
        </p>
        <p className="mt-1 text-sm text-muted">
          Your invitation is published and ready to share with guests.
        </p>
      </div>
    );
  }

  async function publish() {
    "use server";
    await updateProjectStatus(projectId, "published");
  }

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6">
      <h2 className="font-display text-xl">Getting started</h2>
      <p className="mt-1 text-sm text-muted">
        Complete these steps to launch your invitation.
      </p>
      <ul className="mt-6 space-y-3">
        {items.map((item) => {
          const done = progress[item.key];
          return (
            <li key={item.key} className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                  done
                    ? "bg-accent/20 text-accent"
                    : "border border-card-border text-muted"
                }`}
              >
                {done ? "✓" : ""}
              </span>
              {item.href && !done ? (
                <Link
                  href={item.href(projectId)}
                  className="text-sm text-accent hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`text-sm ${done ? "text-muted line-through" : "text-foreground"}`}
                >
                  {item.label}
                </span>
              )}
              {item.key === "isPublished" && !done && (
                <form action={publish} className="ml-auto">
                  <Button type="submit" size="sm" variant="secondary">
                    Publish
                  </Button>
                </form>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

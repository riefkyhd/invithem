import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-muted">Digital Invitations</p>
      <h1 className="font-display mt-4 text-5xl tracking-tight md:text-7xl">
        Invithem
      </h1>
      <p className="mt-6 max-w-md text-muted">
        Beautiful, personalized wedding invitations — manage guests, RSVPs, and
        designs from one place.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/admin/login"
          className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Sign in
        </Link>
        <Link
          href="/admin/projects"
          className="rounded-full border border-card-border px-8 py-3 text-sm transition-colors hover:border-accent"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}

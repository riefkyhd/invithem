import { Button } from "@/components/ui/Button";

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
        <Button href="/admin/login" variant="primary" size="lg">
          Sign in
        </Button>
        <Button href="/admin/projects" variant="secondary" size="lg">
          Dashboard
        </Button>
      </div>
    </div>
  );
}

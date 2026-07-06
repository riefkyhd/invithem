import { Fraunces, Inter } from "next/font/google";
import { getAccountProfile, listProjects } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { isAuthDisabled } from "@/lib/auth/disabled";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const dynamic = "force-dynamic";

export default async function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await listProjects();
  const profile = await getAccountProfile();

  return (
    <div
      className={`${fraunces.variable} ${inter.variable} min-h-screen bg-background`}
    >
      <AdminShell
        projects={projects}
        accountEmail={profile?.email}
        authDisabled={isAuthDisabled()}
      >
        {children}
      </AdminShell>
    </div>
  );
}

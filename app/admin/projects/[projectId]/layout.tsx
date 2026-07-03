import { Fraunces, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { getProject, listProjects } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";

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

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [project, projects] = await Promise.all([
    getProject(projectId),
    listProjects(),
  ]);

  if (!project) notFound();

  return (
    <div
      className={`${fraunces.variable} ${inter.variable} min-h-screen bg-background`}
    >
      <AdminNav projectId={projectId} projects={projects} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}

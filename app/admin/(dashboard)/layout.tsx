import { Fraunces, Inter } from "next/font/google";
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

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${fraunces.variable} ${inter.variable} min-h-screen bg-background`}
    >
      <AdminNav />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}

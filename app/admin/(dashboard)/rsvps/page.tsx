import { redirect } from "next/navigation";

export default function AdminRsvpsRedirect() {
  redirect("/admin/projects");
}

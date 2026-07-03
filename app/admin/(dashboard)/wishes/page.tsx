import { redirect } from "next/navigation";

export default function AdminWishesRedirect() {
  redirect("/admin/projects");
}

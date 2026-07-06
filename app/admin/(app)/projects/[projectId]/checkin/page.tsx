import { CheckinScanner } from "@/components/admin/CheckinScanner";

export default async function CheckinPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <CheckinScanner projectId={projectId} />;
}

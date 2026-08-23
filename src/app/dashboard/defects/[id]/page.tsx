import { DefectDetail } from "@/components/dashboard/defect-detail";

export default async function DefectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DefectDetail defectId={id} />;
}

import { ReviewDetail } from "@/components/dashboard/review-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReviewDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ReviewDetail defectId={decodeURIComponent(id)} />;
}

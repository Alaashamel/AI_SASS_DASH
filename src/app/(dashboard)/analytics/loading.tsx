import { CardListSkeleton } from "@/components/loading-skeletons";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-72 bg-muted animate-pulse rounded" />
      </div>
      <CardListSkeleton count={4} />
    </div>
  );
}

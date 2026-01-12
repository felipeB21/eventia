import { Skeleton } from "../ui/skeleton";

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
      <Skeleton className="w-full h-60" />
      <Skeleton className="w-full h-60" />
      <Skeleton className="w-full h-60" />
      <Skeleton className="w-full h-60" />
    </div>
  );
}

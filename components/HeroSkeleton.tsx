import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-muted">
      {/* Background Skeleton */}
      <Skeleton className="absolute inset-0 z-0" />

      {/* Content Skeleton */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6 animate-pulse">
        {/* Title Skeleton */}
        <Skeleton className="h-20 md:h-24 lg:h-32 w-3/4 mx-auto" />
        
        {/* Subtitle Skeleton */}
        <Skeleton className="h-8 md:h-10 w-2/3 mx-auto" />
        
        {/* Buttons Skeleton */}
        <div className="flex gap-4 justify-center flex-wrap pt-4">
          <Skeleton className="h-14 w-48" />
          <Skeleton className="h-14 w-48" />
        </div>
      </div>

      {/* Scroll Indicator Skeleton */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <Skeleton className="w-6 h-6 rounded-full" />
      </div>
    </section>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function CarouselSkeleton() {
  return (
    <div className="w-full px-4 md:px-8">
      <Skeleton className="h-9 w-64 mb-6" />
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="basis-[280px] md:basis-[300px] lg:basis-[320px] flex-shrink-0">
            <Card className="h-full border-0">
              <CardContent className="p-0">
                <Skeleton className="w-full h-80 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-5/6 mb-2" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}


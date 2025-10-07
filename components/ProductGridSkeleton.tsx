import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ProductGridSkeleton() {
  return (
    <div className="w-full py-8 px-4 md:px-8">
      <Skeleton className="h-9 w-64 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index} className="h-full border-0">
            <CardContent className="p-0">
              <Skeleton className="w-full h-80 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-3/4 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


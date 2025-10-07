"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Product {
  id: number;
  title: string;
  description: string;
  value: number;
  image: string;
  route: string;
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  return (
    <div className="w-full px-4 md:px-8">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-[280px] md:basis-[300px] lg:basis-[320px]">
              <Link href={product.route}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-0">
                  <CardContent className="p-0">
                    <div className="relative w-full mb-2 h-80 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <CardTitle className="text-base mb-0 line-clamp-1 font-normal">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm mb-2">
                      {product.description}
                    </CardDescription>
                    <CardFooter className="p-0 pt-0">
                    <p className="text-2xl text-base">
                      ${product.value.toFixed(2)}
                    </p>
                  </CardFooter>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}


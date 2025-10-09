import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  route: string;
};

type ProductGridProps = {
  products: Product[];
  title?: string;
};

export default function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <div className="w-full py-8 px-4 md:px-8">
      {title && (
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
        {products.map((product) => (
          <Link key={product.id} href={product.route}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-0">
              <CardContent className="p-0">
                <div className="relative w-full mb-2 h-80 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
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
                    R$ {product.price.toFixed(2)}
                  </p>
                </CardFooter>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}


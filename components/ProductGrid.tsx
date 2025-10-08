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
  showEmpty?: boolean;
};

export default function ProductGrid({ products, title, showEmpty = false }: ProductGridProps) {
  if (showEmpty && products.length === 0) {
    return (
      <div className="w-full py-16 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <svg 
            className="w-16 h-16 text-muted-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" 
            />
          </svg>
          <h3 className="text-xl font-semibold">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros para ver mais resultados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 transition-all duration-300">
        {products.map((product, index) => (
          <Link 
            key={product.id} 
            href={product.route}
            style={{ 
              animation: `fadeIn 0.4s ease-out ${index * 0.05}s both` 
            }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-0">
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


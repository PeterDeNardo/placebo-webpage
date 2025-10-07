"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import productDataFallback from "@/Data/productData.json";
import { appConfig } from "@/config/app.config";

interface ProductMedia {
  type: "image" | "video";
  url: string;
  alt: string;
}

interface ProductData {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  media: ProductMedia;
  features: string[];
  specifications: Record<string, string>;
  stock: boolean;
  category: string;
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // Se configurado para usar dados locais
        if (appConfig.USE_LOCAL_DATA) {
          console.log('📦 Produto: Usando dados locais');
          setProduct(productDataFallback as ProductData);
          setLoading(false);
          return;
        }

        // Faz fetch da API
        const productUrl = `${appConfig.API_BASE_URL}/products/${params.id}`;
        console.log('🌐 Produto: Buscando da API:', productUrl);

        const response = await fetch(productUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: ProductData = await response.json();
        setProduct(data);
        console.log('✅ Produto: Dados carregados com sucesso');
      } catch (err) {
        console.error('❌ Produto: Erro ao buscar dados:', err);
        // Fallback para dados locais em caso de erro
        setProduct(productDataFallback as ProductData);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-32">
          <div className="animate-pulse text-lg">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-32">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-8rem)]">
          {/* Left Side - Media */}
          <div className="relative bg-muted">
            {product.media.type === "video" ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={product.media.url} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={product.media.url}
                alt={product.media.alt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>

          {/* Right Side - Details */}
          <div className="flex flex-col justify-center p-8 lg:p-16 max-w-2xl">
            {/* Category */}
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">{product.currency}</span>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                <dl className="grid grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b pb-2">
                      <dt className="text-sm text-muted-foreground">{key}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <Button size="lg" className="flex-1" disabled={!product.stock}>
                {product.stock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button size="lg" variant="outline">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Button>
            </div>

            {/* Stock Status */}
            {product.stock && (
              <p className="text-sm text-green-600 mt-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                In Stock - Ships within 24 hours
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


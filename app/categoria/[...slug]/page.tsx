"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ProductGrid from "@/components/ProductGrid";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import EmptyState from "@/components/EmptyState";
import { appConfig } from "@/config/app.config";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  route: string;
};

type CategoryData = {
  title: string;
  products: Product[];
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string[];
  
  const [data, setData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      // Constrói o caminho baseado no slug
      // Exemplos: 
      // /categoria/novidades -> categories/novidades
      // /categoria/marcas/nike -> categories/marcas/nike
      // /categoria/roupas/camisetas -> categories/roupas/camisetas
      const categoryPath = slug.join('/');

      if (appConfig.USE_LOCAL_DATA) {
        // Fallback para dados locais
        try {
          const localData = await import(`@/Data/categories/${categoryPath}.json`);
          setData(localData.default);
        } catch (err) {
          console.error("Error loading local data:", err);
          setError(true);
        }
      } else {
        // Buscar do backend
        try {
          const response = await fetch(
            `${appConfig.API_BASE_URL}${appConfig.CATEGORIES_ENDPOINT}/${categoryPath}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const result = await response.json();
          setData(result);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError(true);
        }
      }

      setLoading(false);
    };

    if (slug && slug.length > 0) {
      fetchData();
    }
  }, [slug]);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32">
        {loading && <ProductGridSkeleton />}
        {error && (
          <EmptyState
            message="Erro ao carregar produtos"
            description="Não foi possível carregar os produtos. Tente novamente."
            type="error"
            onRetry={handleRetry}
          />
        )}
        {!loading && !error && data && (
          <>
            {data.products.length === 0 ? (
              <EmptyState
                message="Nenhum produto encontrado"
                description="Não há produtos disponíveis nesta categoria no momento."
                type="empty"
              />
            ) : (
              <ProductGrid products={data.products} title={data.title} />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}


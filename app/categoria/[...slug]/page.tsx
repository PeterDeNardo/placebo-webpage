"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import CategoryHero from "@/components/CategoryHero";
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

type HeroData = {
  enabled: boolean;
  title: string;
  description?: string;
  mediaType?: "image" | "video";
  mediaSrc?: string;
  videoFormat?: string;
  posterImage?: string | null;
};

type CategoryData = {
  title: string;
  hero?: HeroData;
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
        // Usa dados locais em desenvolvimento
        console.log('📁 Categoria: Usando dados locais:', categoryPath);
        try {
          const localData = await import(`@/Data/categories/${categoryPath}.json`);
          setData(localData.default);
        } catch (err) {
          console.error("❌ Erro ao carregar dados locais:", err);
          setError(true);
        }
      } else {
        // Busca do backend em produção
        const apiUrl = `${appConfig.API_BASE_URL}${appConfig.CATEGORIES_ENDPOINT}/${categoryPath}`;
        console.log('🌐 Categoria: Buscando da API:', apiUrl);
        
        try {
          const response = await fetch(apiUrl);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          setData(result);
          console.log('✅ Categoria: Dados carregados com sucesso');
        } catch (err) {
          console.error("❌ Erro ao buscar da API:", err);
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
      <main className="flex-1">
        {loading && (
          <>
            <div className="h-32" /> {/* Spacer for fixed header */}
            <ProductGridSkeleton />
          </>
        )}
        {error && (
          <>
            <div className="h-32" /> {/* Spacer for fixed header */}
            <EmptyState
              message="Erro ao carregar produtos"
              description="Não foi possível carregar os produtos. Tente novamente."
              type="error"
              onRetry={handleRetry}
            />
          </>
        )}
        {!loading && !error && data && (
          <>
            {/* Hero Section */}
            {data.hero?.enabled && (
              <CategoryHero
                title={data.hero.title}
                description={data.hero.description}
                mediaType={data.hero.mediaType}
                mediaSrc={data.hero.mediaSrc}
                videoFormat={data.hero.videoFormat}
                posterImage={data.hero.posterImage}
              />
            )}
            
            {/* Products Grid */}
            {data.products.length === 0 ? (
              <div className={data.hero?.enabled ? "" : "pt-32"}>
                <EmptyState
                  message="Nenhum produto encontrado"
                  description="Não há produtos disponíveis nesta categoria no momento."
                  type="empty"
                />
              </div>
            ) : (
              <ProductGrid products={data.products} title={data.hero?.enabled ? undefined : data.title} />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}


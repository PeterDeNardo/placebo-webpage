"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Hero from "@/components/Hero";
import HeroSkeleton from "@/components/HeroSkeleton";
import ProductCarousel from "@/components/ProductCarousel";
import CarouselSkeleton from "@/components/CarouselSkeleton";
import EmptyState from "@/components/EmptyState";
import homeFeedDataFallback from "@/Data/homeFeedData.json";
import heroDataFallback from "@/Data/heroData.json";
import { appConfig } from "@/config/app.config";

interface Product {
  id: number;
  title: string;
  description: string;
  value: number;
  image: string;
  route: string;
}

interface Carousel {
  title: string;
  products: Product[];
}

interface HomeFeedData {
  carousels: Carousel[];
}

interface HeroButton {
  text: string;
  href: string;
  variant: "primary" | "outline";
}

interface HeroContent {
  title: string;
  subtitle: string;
  buttons: HeroButton[];
}

interface HeroData {
  enabled: boolean;
  mediaType: "image" | "video";
  mediaSrc: string;
  videoFormat: "mp4" | "webm" | "ogg";
  posterImage: string | null;
  overlayOpacity: number;
  content: HeroContent;
  showScrollIndicator: boolean;
}

export default function Home() {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [carouselsLoading, setCarouselsLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);
  const [carouselsError, setCarouselsError] = useState(false);

  // Fetch Hero (independente)
  const fetchHero = async () => {
    try {
      setHeroLoading(true);
      
      // Se configurado para usar dados locais
      if (appConfig.USE_LOCAL_DATA) {
        console.log('🎨 Hero: Usando dados locais');
        setHeroData(heroDataFallback as HeroData);
        setHeroLoading(false);
        return;
      }
      
      // Faz fetch da API
      const heroUrl = `${appConfig.API_BASE_URL}${appConfig.HERO_ENDPOINT}`;
      console.log('🌐 Hero: Buscando da API:', heroUrl);
      
      const response = await fetch(heroUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: HeroData = await response.json();
      setHeroData(data);
      console.log('✅ Hero: Dados carregados com sucesso');
    } catch (err) {
      console.error('❌ Hero: Erro ao buscar dados:', err);
      // Hero falha silenciosamente - não mostra na tela
      setHeroData(null);
    } finally {
      setHeroLoading(false);
    }
  };

  // Fetch Carousels (independente)
  const fetchCarousels = async () => {
    try {
      setCarouselsLoading(true);
      setCarouselsError(false);
      
      // Se configurado para usar dados locais
      if (appConfig.USE_LOCAL_DATA) {
        console.log('🎠 Carrosséis: Usando dados locais');
        setCarousels(homeFeedDataFallback.carousels);
        setCarouselsLoading(false);
        return;
      }
      
      // Faz fetch da API
      const carouselsUrl = `${appConfig.API_BASE_URL}${appConfig.CAROUSELS_ENDPOINT}`;
      console.log('🌐 Carrosséis: Buscando da API:', carouselsUrl);
      
      const response = await fetch(carouselsUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: HomeFeedData = await response.json();
      setCarousels(data.carousels);
      console.log('✅ Carrosséis: Dados carregados com sucesso');
    } catch (err) {
      console.error('❌ Carrosséis: Erro ao buscar dados:', err);
      // Mostra estado de erro para carrosséis
      setCarouselsError(true);
      setCarousels([]);
    } finally {
      setCarouselsLoading(false);
    }
  };

  useEffect(() => {
    // Log de ambiente (uma vez)
    console.log('🔍 Ambiente:', {
      NODE_ENV: appConfig.NODE_ENV,
      isDevelopment: appConfig.IS_DEVELOPMENT,
      useLocalData: appConfig.USE_LOCAL_DATA,
    });
    
    // Busca Hero e Carrosséis em paralelo, mas independentes
    fetchHero();
    fetchCarousels();
  }, []);

  return (
    <div className="font-sans flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      {heroLoading ? (
        <HeroSkeleton />
      ) : heroData?.enabled ? (
        <Hero 
          mediaType={heroData.mediaType}
          mediaSrc={heroData.mediaSrc}
          videoFormat={heroData.videoFormat}
          posterImage={heroData.posterImage}
          overlayOpacity={heroData.overlayOpacity}
          content={heroData.content}
          showScrollIndicator={heroData.showScrollIndicator}
        />
      ) : null}
      
      {/* Products Section */}
      <main className="flex flex-col gap-[64px] items-center w-full py-16 flex-1">
        {carouselsLoading ? (
          <>
            <CarouselSkeleton />
            <CarouselSkeleton />
          </>
        ) : carouselsError ? (
          <EmptyState 
            type="error"
            message="Unable to load products" 
            description="There was an error connecting to the server. Please check your connection and try again."
            onRetry={fetchCarousels}
          />
        ) : carousels.length === 0 ? (
          <EmptyState 
            type="empty"
            message="No products available"
            description="There are no products to display at the moment. Please check back later."
          />
        ) : (
          carousels.map((carousel, index) => (
            <ProductCarousel
              key={index}
              title={carousel.title}
              products={carousel.products}
            />
          ))
        )}
      </main>
      
      <Footer />
    </div>
  );
}

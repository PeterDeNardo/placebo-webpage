"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { appConfig } from "@/config/app.config";

type Author = {
  name: string;
  avatar: string;
  role: string;
};

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  author: Author;
  category: string;
  image: string;
  publishedAt: string;
  readTime: string;
};

type FeaturedPost = BlogPost & {
  content: string;
};

type BlogData = {
  hero: {
    title: string;
    description: string;
  };
  featuredPost: FeaturedPost;
  posts: BlogPost[];
  categories: string[];
};

export default function BlogPage() {
  const [data, setData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (appConfig.USE_LOCAL_DATA) {
        try {
          const localData = await import("@/Data/blogData.json");
          setData(localData.default);
        } catch (err) {
          console.error("Erro ao carregar dados locais:", err);
        }
      } else {
        try {
          const response = await fetch(`${appConfig.API_BASE_URL}/blog`);
          if (response.ok) {
            const result = await response.json();
            setData(result);
          }
        } catch (err) {
          console.error("Erro ao buscar da API:", err);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const filteredPosts = data?.posts.filter(
    (post) => selectedCategory === "Todos" || post.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-32 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-muted rounded w-1/3"></div>
              <div className="h-96 bg-muted rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">{data.hero.title}</h1>
            <p className="text-xl text-muted-foreground">{data.hero.description}</p>
          </div>

          {/* Featured Post */}
          <Link href={`/blog/${data.featuredPost.id}`}>
            <Card className="mb-12 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src={data.featuredPost.image}
                    alt={data.featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    Destaque
                  </Badge>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-4">
                    {data.featuredPost.category}
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {data.featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {data.featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4">
                    <Image
                      src={data.featuredPost.author.avatar}
                      alt={data.featuredPost.author.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{data.featuredPost.author.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.featuredPost.author.role}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{formatDate(data.featuredPost.publishedAt)}</p>
                      <p>{data.featuredPost.readTime} de leitura</p>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {data.categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts?.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                style={{
                  animation: `fadeIn 0.4s ease-out ${index * 0.1}s both`,
                }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <Badge
                      variant="secondary"
                      className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm"
                    >
                      {post.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center gap-3">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{post.author.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts?.length === 0 && (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 text-muted-foreground mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">
                Nenhum post encontrado
              </h3>
              <p className="text-muted-foreground">
                Não há posts nesta categoria ainda.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


"use client";

import React, { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlog } from "@/hooks/useBlog";

export default function BlogPage() {
  const { data, loading, error, refetch } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extrai categorias únicas
  const categories = data ? Array.from(new Set(data.posts.map(post => post.category))).sort() : [];

  // Filtra posts
  const filteredPosts = data?.posts.filter(post =>
    selectedCategory ? post.category === selectedCategory : true
  ) || [];

  const featuredPost = filteredPosts.find(post => post.featured);
  const otherPosts = filteredPosts.filter(post => !post.featured);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-32 px-4 md:px-8">
          <div className="max-w-7xl mx-auto animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-32 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center py-16">
            <h1 className="text-4xl font-bold mb-4">Erro ao carregar o Blog</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Não foi possível carregar os posts do blog. Tente novamente mais tarde.
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[400px] bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-center px-4">
          <div className="z-10">
            <h1 className="text-5xl font-bold mb-4">{data.hero.title}</h1>
            <p className="text-xl">{data.hero.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
          {/* Categories Filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="cursor-pointer hover:bg-primary/90 transition-colors"
            >
              Todas
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="cursor-pointer hover:bg-primary/90 transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">Nenhum post encontrado</h2>
              <p className="text-muted-foreground">Tente selecionar outra categoria ou volte mais tarde.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`} className="block mb-12 group">
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-0 flex flex-col md:flex-row">
                      <div className="relative w-full md:w-2/3 h-64 md:h-96 flex-shrink-0">
                        <Image
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 66vw"
                        />
                      </div>
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                        <Badge variant="secondary" className="mb-2 self-start">
                          {featuredPost.category}
                        </Badge>
                        <CardTitle className="text-3xl md:text-4xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors duration-300">
                          {featuredPost.title}
                        </CardTitle>
                        <CardDescription className="text-lg mb-4 line-clamp-3">
                          {featuredPost.excerpt}
                        </CardDescription>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Image
                            src={featuredPost.author.avatar}
                            alt={featuredPost.author.name}
                            width={32}
                            height={32}
                            className="rounded-full mr-2"
                          />
                          <span>{featuredPost.author.name}</span>
                          <span className="mx-2">•</span>
                          <span>{featuredPost.date}</span>
                          <span className="mx-2">•</span>
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}

              {/* Other Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block group"
                    style={{ 
                      animation: `fadeIn 0.4s ease-out ${index * 0.1}s both` 
                    }}
                  >
                    <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-0">
                        <div className="relative w-full h-48">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                        <div className="p-4">
                          <Badge variant="secondary" className="mb-2">
                            {post.category}
                          </Badge>
                          <CardTitle className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="text-sm line-clamp-3 mb-3">
                            {post.excerpt}
                          </CardDescription>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Image
                              src={post.author.avatar}
                              alt={post.author.name}
                              width={24}
                              height={24}
                              className="rounded-full mr-2"
                            />
                            <span>{post.author.name}</span>
                            <span className="mx-1">•</span>
                            <span>{post.date}</span>
                            <span className="mx-1">•</span>
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


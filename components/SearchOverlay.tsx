"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Previne scroll mas mantém a scrollbar visível
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Buscando por:", searchQuery);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-3xl mx-auto mt-24 rounded-lg shadow-2xl animate-in slide-in-from-top-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Overlay */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Pesquisar</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-8">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="search"
              placeholder="Digite o que você está procurando..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-14 text-lg"
              autoFocus
            />
          </form>

          {/* Resultados */}
          {searchQuery ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Buscando por: <span className="font-semibold text-foreground">"{searchQuery}"</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Os resultados aparecerão aqui...
              </p>
            </div>
          ) : (
            <div>
              {/* Estado Vazio */}
              <div className="text-center py-8 mb-8">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-muted-foreground">
                  Digite algo para começar a buscar
                </p>
              </div>

              {/* Sugestões */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Sugestões Populares
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Camisetas", "Tênis", "Jaquetas", "Acessórios", "Novidades"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchQuery(suggestion)}
                      className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


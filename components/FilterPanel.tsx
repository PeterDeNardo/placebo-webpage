"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  route: string;
  [key: string]: any;
};

type FilterPanelProps = {
  products: Product[];
  onFilter: (filtered: Product[]) => void;
};

type FilterValues = {
  priceRange: [number, number];
  selectedAttributes: { [key: string]: string[] };
};

export default function FilterPanel({ products, onFilter }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Extrair todas as keys únicas dos filtros dos produtos
  const getAvailableFilters = (): Array<{ key: string; label: string }> => {
    const filterKeys = new Set<string>();
    products.forEach((product) => {
      if (product.filters) {
        Object.keys(product.filters).forEach((key) => filterKeys.add(key));
      }
    });
    
    return Array.from(filterKeys).map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
    }));
  };

  const getPriceRange = (): [number, number] => {
    const prices = products.map((p) => p.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  };

  const getFilterValues = (key: string): string[] => {
    const values = new Set<string>();
    products.forEach((product) => {
      if (product.filters && product.filters[key] && typeof product.filters[key] === "string") {
        values.add(product.filters[key]);
      }
    });
    return Array.from(values).sort();
  };

  const availableFilters = getAvailableFilters();
  const [minPrice, maxPrice] = getPriceRange();

  const [filterState, setFilterState] = useState<FilterValues>({
    priceRange: [minPrice, maxPrice],
    selectedAttributes: {},
  });

  // Controlar overflow do body quando drawer está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAttributeChange = (attribute: string, value: string, checked: boolean) => {
    const newState = { ...filterState };
    const current = newState.selectedAttributes[attribute] || [];
    
    if (checked) {
      newState.selectedAttributes[attribute] = [...current, value];
    } else {
      newState.selectedAttributes[attribute] = current.filter((v) => v !== value);
    }
    
    setFilterState(newState);
    applyFilters(newState);
  };

  const handlePriceChange = (value: number[]) => {
    const newState = {
      ...filterState,
      priceRange: [value[0], value[1]] as [number, number],
    };
    setFilterState(newState);
    applyFilters(newState);
  };

  const applyFilters = (state: FilterValues) => {
    let filtered = products;

    filtered = filtered.filter(
      (p) => p.price >= state.priceRange[0] && p.price <= state.priceRange[1]
    );

    Object.entries(state.selectedAttributes).forEach(([key, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter((p) => 
          p.filters && values.includes(p.filters[key])
        );
      }
    });

    const activeCount =
      Object.values(state.selectedAttributes).filter((v) => v.length > 0).length +
      (state.priceRange[0] !== minPrice || state.priceRange[1] !== maxPrice ? 1 : 0);

    setActiveFilters(activeCount);
    onFilter(filtered);
  };

  const clearFilters = () => {
    const newState = {
      priceRange: [minPrice, maxPrice] as [number, number],
      selectedAttributes: {},
    };
    setFilterState(newState);
    setActiveFilters(0);
    onFilter(products);
  };

  return (
    <>
      {/* Botão de Filtro - Alinhado à esquerda */}
      <div className="flex justify-start mb-6">
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filtros
          {activeFilters > 0 && (
            <Badge variant="default" className="ml-1">
              {activeFilters}
            </Badge>
          )}
        </Button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        />
      )}

      {/* Drawer/Gaveta da Esquerda */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-background shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Header do Drawer */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Filtros</h2>
              {activeFilters > 0 && (
                <Badge variant="default">{activeFilters}</Badge>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Filtros */}
          <div className="space-y-6">
            {/* Filtro de Preço */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Preço</Label>
                <span className="text-xs text-muted-foreground">
                  R$ {filterState.priceRange[0]} - R$ {filterState.priceRange[1]}
                </span>
              </div>
              <Slider
                min={minPrice}
                max={maxPrice}
                step={10}
                value={filterState.priceRange}
                onValueChange={handlePriceChange}
                className="w-full"
              />
            </div>

            {/* Filtros Dinâmicos */}
            {availableFilters.map((filter) => {
              const values = getFilterValues(filter.key);
              
              if (values.length === 0) return null;

              return (
                <div key={filter.key} className="space-y-3">
                  <Label className="text-sm font-medium">{filter.label}</Label>
                  <div className="space-y-2">
                    {values.map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${filter.key}-${value}`}
                          checked={
                            filterState.selectedAttributes[filter.key]?.includes(value) || false
                          }
                          onCheckedChange={(checked) =>
                            handleAttributeChange(filter.key, value, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`${filter.key}-${value}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {value}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botões de Ação */}
          <div className="mt-8 space-y-2 sticky bottom-0 bg-background pt-4 border-t">
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Aplicar Filtros
            </Button>
            {activeFilters > 0 && (
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

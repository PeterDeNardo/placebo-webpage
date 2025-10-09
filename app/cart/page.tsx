"use client";

import React, { useState } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export default function CartPage() {
  const { cart, loading, updating, updateQuantity, removeItem, applyPromoCode, updateShipping } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    const success = await applyPromoCode(promoCode);
    if (success) {
      setPromoApplied(true);
    } else {
      alert("Cupom inválido!");
      setPromoApplied(false);
    }
  };

  const handleShippingChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newShippingId = e.target.value;
    setSelectedShipping(newShippingId);
    await updateShipping(newShippingId);
  };

  const handleLoginSuccess = () => {
    setIsAuthOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-32 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="lg:col-span-1 space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-32 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center py-16">
            <svg
              className="w-24 h-24 text-muted-foreground mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Parece que você ainda não adicionou nada ao seu carrinho.
            </p>
            <Link href="/">
              <Button size="lg">Ver Produtos</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Seu Carrinho</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item, index) => (
                <Card
                  key={item.id}
                  className="p-4 border-0 shadow-sm"
                  style={{ animation: `fadeIn 0.4s ease-out ${index * 0.1}s both` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Image */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded-md"
                        sizes="96px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex items-center justify-between gap-4">
                      {/* Product Details */}
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold">{item.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          {item.color && `Cor: ${item.color}`}
                          {item.color && item.size && " | "}
                          {item.size && `Tamanho: ${item.size}`}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          R$ {item.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Unidade
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating || item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="px-3 min-w-[2rem] text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating}
                        >
                          +
                        </Button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[100px]">
                        <p className="text-lg font-bold text-primary">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total
                        </p>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        disabled={updating}
                        className="flex-shrink-0"
                      >
                        <svg
                          className="w-5 h-5 text-destructive"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3m-3 0h14"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Promo Code */}
              <Card className="p-4 border-0 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Cupom de Desconto</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite seu cupom"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                    disabled={updating}
                  />
                  <Button onClick={handleApplyPromo} disabled={promoApplied || updating}>
                    {promoApplied ? "Aplicado" : "Aplicar"}
                  </Button>
                </div>
                {promoApplied && cart.summary.discount > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    Cupom aplicado! Você economizou R$ {cart.summary.discount.toFixed(2)}.
                  </p>
                )}
              </Card>

              {/* Shipping Options */}
              <Card className="p-4 border-0 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Opções de Entrega</h3>
                <div className="space-y-3">
                  {cart.shippingOptions.map((option) => (
                    <div key={option.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={option.id}
                          name="shipping"
                          value={option.id}
                          checked={selectedShipping === option.id}
                          onChange={handleShippingChange}
                          disabled={updating}
                          className="mr-2"
                        />
                        <Label htmlFor={option.id} className="cursor-pointer">
                          {option.label} - {option.deliveryTime}
                        </Label>
                      </div>
                      <span className="font-semibold">
                        R$ {option.cost.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 space-y-6 sticky top-32 h-fit">
              <Card className="p-4 border-0 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Resumo do Pedido</h3>
                <CardContent className="p-0 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {cart.summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span>R$ {cart.summary.shipping.toFixed(2)}</span>
                  </div>
                  {cart.summary.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span className="font-semibold">
                        -R$ {cart.summary.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">
                      R$ {cart.summary.total.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 p-0 mt-4">
                  {isAuthenticated ? (
                    <>
                      <Button className="w-full" size="lg">
                        Finalizar Compra
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Parcelamento em até 12x sem juros
                      </p>
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => setIsAuthOpen(true)}
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        Login para Finalizar
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Faça login para finalizar sua compra
                      </p>
                    </>
                  )}
                </CardFooter>
              </Card>

              {/* Trust Badges */}
              <Card className="p-4 border-0 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-primary flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-sm">Compra Segura</p>
                      <p className="text-xs text-muted-foreground">
                        Seus dados protegidos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-primary flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-sm">Pagamento Fácil</p>
                      <p className="text-xs text-muted-foreground">
                        Várias formas de pagamento
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-primary flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-sm">Troca Grátis</p>
                      <p className="text-xs text-muted-foreground">
                        Até 30 dias para trocar
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}


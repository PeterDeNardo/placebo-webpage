"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EncomendasPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // TODO: Integrar com sistema de auth real
  useEffect(() => {
    // Simula verificação de autenticação
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    checkAuth();

    // 🧪 HELPER DE TESTE - Remover em produção
    // Para forçar login em testes, descomente a linha abaixo:
    // setIsAuthenticated(true);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages(filesArray);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Adicionar imagens ao FormData
    selectedImages.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });

    // Simula envio para backend
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // TODO: Implementar chamada real ao backend
    console.log("Encomenda:", Object.fromEntries(formData));

    setLoading(false);
    setSubmitted(true);

    // Reset após 5 segundos
    setTimeout(() => {
      setSubmitted(false);
      (e.target as HTMLFormElement).reset();
      setSelectedImages([]);
    }, 5000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-16 px-4 md:px-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl">Login Necessário</CardTitle>
              <CardDescription className="text-base">
                Para fazer uma encomenda, você precisa estar logado na sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setIsAuthOpen(true)}
                className="w-full"
                size="lg"
              >
                Fazer Login
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Ainda não tem uma conta?{" "}
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="text-primary hover:underline"
                >
                  Cadastre-se gratuitamente
                </button>
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">Faça sua Encomenda</h1>
            <p className="text-muted-foreground text-lg">
              Descreva o produto que você procura e nossa equipe encontrará para você!
            </p>
          </div>

          {submitted ? (
            <Card className="border-2 border-green-500">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
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
                  </div>
                  <div>
                    <CardTitle className="text-green-700">Encomenda Recebida!</CardTitle>
                    <CardDescription>
                      Entraremos em contato em breve com mais informações.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Encomenda</CardTitle>
                <CardDescription>
                  Seus dados pessoais já estão vinculados à sua conta. Preencha apenas as informações do produto.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Descrição do Produto */}
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Descrição do Produto *
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Descreva detalhadamente o produto que você procura: marca, modelo, cor, tamanho, características específicas, etc."
                      rows={6}
                      required
                      className="resize-none"
                    />
                  </div>

                  {/* Links de Referência */}
                  <div className="space-y-2">
                    <Label htmlFor="reference-links">
                      Links de Referência
                    </Label>
                    <Textarea
                      id="reference-links"
                      name="referenceLinks"
                      placeholder="Cole aqui links de sites, redes sociais ou qualquer referência online do produto (um link por linha)"
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Upload de Imagens */}
                  <div className="space-y-2">
                    <Label htmlFor="images">
                      Imagens de Referência
                    </Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                      <input
                        id="images"
                        name="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="images"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <svg
                          className="w-10 h-10 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          Clique para selecionar imagens
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PNG, JPG até 5MB cada
                        </span>
                      </label>
                    </div>

                    {/* Preview de Imagens */}
                    {selectedImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg
                                className="w-4 h-4"
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
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {image.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Botões */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        "Enviar Encomenda"
                      )}
                    </Button>
                    <Button
                      type="reset"
                      variant="outline"
                      className="flex-1 sm:flex-initial"
                      disabled={loading}
                      onClick={() => setSelectedImages([])}
                    >
                      Limpar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-base">Resposta Rápida</CardTitle>
                <CardDescription>
                  Respondemos em até 24 horas com disponibilidade e orçamento.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-base">Produtos Exclusivos</CardTitle>
                <CardDescription>
                  Acesso a produtos difíceis de encontrar no mercado nacional.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-base">Compra Segura</CardTitle>
                <CardDescription>
                  Seus dados são protegidos e a transação é 100% segura.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
};

type AuthView = "login" | "register" | "forgot-password" | "forgot-success";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [view, setView] = useState<AuthView>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset ao fechar
      setTimeout(() => {
        setView("login");
        setError("");
        setTermsAccepted(false);
      }, 300);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Validações específicas
    if (view === "register") {
      if (data.password !== data.confirmPassword) {
        setError("As senhas não coincidem");
        setLoading(false);
        return;
      }
      if (!termsAccepted) {
        setError("Você precisa aceitar os termos e condições");
        setLoading(false);
        return;
      }
    }

    // Simula chamada API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // TODO: Implementar chamada real ao backend
    console.log(`${view}:`, data);

    setLoading(false);

    // Sucesso
    if (view === "login" || view === "register") {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      onClose();
    } else if (view === "forgot-password") {
      setView("forgot-success");
      setTimeout(() => {
        onClose();
      }, 5000);
    }
  };

  const switchToRegister = () => {
    setView("register");
    setError("");
    setTermsAccepted(false);
  };

  const switchToLogin = () => {
    setView("login");
    setError("");
    setTermsAccepted(false);
  };

  const switchToForgotPassword = () => {
    setView("forgot-password");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
        >
          <svg
            className="h-5 w-5"
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
          <span className="sr-only">Fechar</span>
        </button>

        <CardHeader>
          {view === "forgot-password" || view === "forgot-success" ? (
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <div>
                <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
              </div>
            </div>
          ) : (
            <CardTitle className="text-2xl">
              {view === "login" ? "Entrar" : "Criar Conta"}
            </CardTitle>
          )}
          <CardDescription>
            {view === "login" && "Entre com suas credenciais para acessar sua conta"}
            {view === "register" && "Preencha os dados abaixo para criar sua conta"}
            {view === "forgot-password" && "Digite seu e-mail e enviaremos instruções para redefinir sua senha"}
            {view === "forgot-success" && "Verifique seu e-mail para continuar"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {view === "forgot-success" ? (
            <div className="space-y-4">
              {/* Success State */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-white"
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
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 mb-1">
                      E-mail Enviado!
                    </h3>
                    <p className="text-sm text-green-700">
                      Se existe uma conta associada a este e-mail, você receberá
                      instruções para redefinir sua senha em alguns minutos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  Próximos passos:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Verifique sua caixa de entrada</li>
                  <li>Clique no link enviado por e-mail</li>
                  <li>Crie uma nova senha segura</li>
                  <li>Faça login com sua nova senha</li>
                </ol>
              </div>

              {/* Additional Info */}
              <div className="bg-muted rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">Não recebeu o e-mail?</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Verifique sua pasta de spam</li>
                  <li>• Aguarde alguns minutos</li>
                  <li>• Tente novamente com outro e-mail</li>
                </ul>
              </div>

              <Button
                type="button"
                onClick={onClose}
                className="w-full"
              >
                Entendi
              </Button>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Nome - apenas no cadastro */}
              {view === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="João Silva"
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  autoFocus={view === "forgot-password"}
                />
                {view === "forgot-password" && (
                  <p className="text-xs text-muted-foreground">
                    Digite o e-mail cadastrado na sua conta
                  </p>
                )}
              </div>

              {/* Senha - login e cadastro */}
              {view !== "forgot-password" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>
              )}

              {/* Confirmar Senha - apenas no cadastro */}
              {view === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>
              )}

              {/* Telefone - apenas no cadastro */}
              {view === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone (opcional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              )}

              {/* Termos - apenas no cadastro */}
              {view === "register" && (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aceito os{" "}
                    <a
                      href="/termos"
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      Termos de Serviço
                    </a>{" "}
                    e{" "}
                    <a
                      href="/politica-privacidade"
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      Política de Privacidade
                    </a>
                  </label>
                </div>
              )}

              {/* Esqueci a senha - apenas no login */}
              {view === "login" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={switchToForgotPassword}
                  >
                    Esqueci minha senha
                  </button>
                </div>
              )}

              {/* Voltar ao login - forgot password */}
              {view === "forgot-password" && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={switchToLogin}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Voltar para o login
                  </button>
                </div>
              )}

              {/* Mensagem de erro */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              {/* Botão Submit */}
              <Button type="submit" className="w-full" disabled={loading}>
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
                    {view === "login" && "Entrando..."}
                    {view === "register" && "Criando conta..."}
                    {view === "forgot-password" && "Enviando..."}
                  </>
                ) : (
                  <>
                    {view === "login" && "Entrar"}
                    {view === "register" && "Criar Conta"}
                    {view === "forgot-password" && "Enviar Link de Recuperação"}
                  </>
                )}
              </Button>

              {/* Switch entre Login/Cadastro */}
              {view !== "forgot-password" && (
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    {view === "login" ? "Não tem uma conta? " : "Já tem uma conta? "}
                  </span>
                  <button
                    type="button"
                    onClick={view === "login" ? switchToRegister : switchToLogin}
                    className="text-primary hover:underline font-medium"
                  >
                    {view === "login" ? "Cadastre-se" : "Entrar"}
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Social Login - apenas login e cadastro */}
          {view !== "forgot-password" && view !== "forgot-success" && (
            <>
              {/* Divisor */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => alert("Login com Google em desenvolvimento")}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => alert("Login com Facebook em desenvolvimento")}
                >
                  <svg className="mr-2 h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


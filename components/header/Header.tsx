"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import headerData from "../../Data/headerData.json";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import SearchOverlay from "@/components/SearchOverlay";
import AuthModal from "@/components/AuthModal";

type SubMenuItem = {
  title: string;
  route: string;
  icon?: string;
};

type HeaderItem = {
  title: string;
  route: string;
  description: string;
  submenu?: SubMenuItem[];
  authRequired?: boolean;
};

type HeaderData = {
  leftNavigation: HeaderItem[];
  rightNavigation: HeaderItem[];
};

const { leftNavigation, rightNavigation } = headerData as HeaderData;

const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // TODO: Integrar com sistema de auth
  const lastScrollY = useRef(0);

  // TODO: Integração com sistema de autenticação
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = localStorage.getItem('authToken');
  //     if (token) {
  //       // Validar token com backend
  //       setIsAuthenticated(true);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // TODO: Salvar token no localStorage
    // localStorage.setItem('authToken', token);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Define se o header deve ter background sólido (após 50px)
      setScrolled(currentScrollY > 50);
      
      // Define se o header deve estar visível
      if (currentScrollY < 10) {
        // No topo, sempre visível
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrollando para baixo e passou de 80px - esconde
        setVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrollando para cima - mostra
        setVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    // Adiciona listener de scroll
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Checa posição inicial
    handleScroll();

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed left-0 z-50 flex w-full items-center justify-between px-12 py-10 transition-all duration-300 ${
          isHomePage
            ? scrolled 
              ? "bg-white/95 backdrop-blur-md border-b border-border/40 shadow-sm" 
              : "bg-transparent border-b border-transparent"
            : "bg-white border-b border-border/40 shadow-sm"
        } ${
          visible ? "top-0" : "-top-32"
        }`}
      >
      {/* Navegação Esquerda */}
      <nav className={`flex gap-6 text-base transition-colors duration-300 ${
        isHomePage
          ? scrolled ? "text-foreground" : "text-white drop-shadow-lg"
          : "text-foreground"
      }`}>
        <NavigationMenu>
          <NavigationMenuList>
            {leftNavigation.map((item) => (
              <NavigationMenuItem key={item.route}>
                {item.submenu ? (
                  <>
                    <NavigationMenuTrigger className="hover:text-primary transition-colors bg-transparent">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="flex flex-col w-[200px] p-2">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.route}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={subItem.route}
                                className="flex flex-row items-center gap-3 select-none rounded-md px-3 py-2 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                {subItem.icon && (
                                  <div className="relative w-5 h-5 flex-shrink-0">
                                    <Image
                                      src={subItem.icon}
                                      alt={subItem.title}
                                      fill
                                      className="object-contain"
                                      unoptimized
                                    />
                                  </div>
                                )}
                                <span className="text-sm font-medium whitespace-nowrap">{subItem.title}</span>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link 
                      href={item.route}
                      className="hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Logo Central */}
      <div className={`font-bold text-2xl absolute left-1/2 transform -translate-x-1/2 transition-colors duration-300 ${
        isHomePage
          ? scrolled ? "text-foreground" : "text-white drop-shadow-lg"
          : "text-foreground"
      }`}>
        <Link href="/" className="hover:opacity-80 transition-opacity">
          Placebo
        </Link>
      </div>

      {/* Navegação Direita */}
      <nav className={`flex items-center gap-6 text-base transition-colors duration-300 ${
        isHomePage
          ? scrolled ? "text-foreground" : "text-white drop-shadow-lg"
          : "text-foreground"
      }`}>
        <NavigationMenu>
          <NavigationMenuList>
            {rightNavigation
              .filter((item) => {
                // Mostra Login se não estiver autenticado
                if (item.route === "/login") return !isAuthenticated;
                // Mostra Sua Área se estiver autenticado
                if (item.route === "/account") return isAuthenticated;
                // Mostra todos os outros itens
                return true;
              })
              .map((item) => (
              <NavigationMenuItem key={item.route}>
                {item.route === "/search" ? (
                  <NavigationMenuLink asChild>
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="flex flex-row items-center gap-2 cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
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
                      <span>{item.title}</span>
                    </button>
                  </NavigationMenuLink>
                ) : item.route === "/login" ? (
                  <NavigationMenuLink asChild>
                    <button
                      onClick={() => setIsAuthOpen(true)}
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      {item.title}
                    </button>
                  </NavigationMenuLink>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link 
                      href={item.route}
                      className="hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </header>

    <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    <AuthModal 
      isOpen={isAuthOpen} 
      onClose={() => setIsAuthOpen(false)}
      onLoginSuccess={handleLoginSuccess}
    />
    </>
  );
};

export default Header;

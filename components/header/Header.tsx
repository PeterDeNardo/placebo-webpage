"use client";

import React, { useState } from "react";
import Link from "next/link";
import headerData from "../../Data/headerData.json";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import SearchOverlay from "@/components/SearchOverlay";

type HeaderItem = {
  title: string;
  route: string;
  description: string;
};

type HeaderData = {
  leftNavigation: HeaderItem[];
  rightNavigation: HeaderItem[];
};

const { leftNavigation, rightNavigation } = headerData as HeaderData;

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-white px-12 py-10 border-b">
      {/* Navegação Esquerda */}
      <nav className="flex gap-6 text-base">
        <NavigationMenu>
          <NavigationMenuList>
            {leftNavigation.map((item) => (
              <NavigationMenuItem key={item.route}>
                <NavigationMenuLink asChild>
                  <Link 
                    href={item.route}
                    className="hover:text-primary transition-colors"
                  >
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Logo Central */}
      <div className="font-bold text-2xl absolute left-1/2 transform -translate-x-1/2">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          Placebo
        </Link>
      </div>

      {/* Navegação Direita */}
      <nav className="flex items-center gap-6 text-base">
        <NavigationMenu>
          <NavigationMenuList>
            {rightNavigation.map((item) => (
              <NavigationMenuItem key={item.route}>
                {item.route === "/search" ? (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex flex-row items-center gap-2 hover:text-primary transition-colors"
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
    </>
  );
};

export default Header;

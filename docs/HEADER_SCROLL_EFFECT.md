# 🎨 Header com Efeito de Scroll

O header possui um efeito translúcido que muda de aparência conforme o usuário faz scroll na página, e **esconde automaticamente** ao scrollar para baixo, reaparecendo ao scrollar para cima.

## ✨ Comportamento

### No Topo da Página (scroll = 0)
```
✅ Background: Transparente
✅ Texto: Branco com drop-shadow
✅ Borda: Transparente
✅ Sombra: Nenhuma
✅ Visibilidade: Sempre visível
```

**Visual:** Header invisível, texto branco flutua sobre o Hero

### Scrollando Para Baixo (↓)
```
🔽 Header: Esconde suavemente (slide up)
⏱️ Transição: 300ms
```

**Visual:** Header desliza para cima e desaparece

### Scrollando Para Cima (↑)
```
🔼 Header: Reaparece (slide down)
✅ Background: Branco semi-transparente (95%)
✅ Backdrop Blur: Efeito de desfoque no fundo
✅ Texto: Cor normal (foreground)
✅ Borda: Sutil borda inferior
✅ Sombra: Sombra suave (shadow-sm)
⏱️ Transição: 300ms
```

**Visual:** Header desliza para baixo, sólido e destacado

### Próximo ao Topo (< 10px)
```
✅ Visibilidade: Sempre visível (não esconde)
```

**Visual:** Header permanece visível para facilitar navegação inicial

---

## 🔧 Implementação

### Estados do Header

```typescript
const [scrolled, setScrolled] = useState(false);      // Background sólido?
const [visible, setVisible] = useState(true);         // Header visível?
const [lastScrollY, setLastScrollY] = useState(0);    // Última posição
```

### Lógica de Scroll

```typescript
useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Define se o header deve ter background sólido (após 50px)
    setScrolled(currentScrollY > 50);
    
    // Define se o header deve estar visível
    if (currentScrollY < 10) {
      // No topo, sempre visível
      setVisible(true);
    } else if (currentScrollY > lastScrollY) {
      // Scrollando para baixo - esconde
      setVisible(false);
    } else {
      // Scrollando para cima - mostra
      setVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Checa posição inicial

  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollY]);
```

### Classes Dinâmicas

#### Header Container
```tsx
<header 
  className={`fixed left-0 z-50 flex w-full items-center justify-between px-12 py-10 transition-all duration-300 ${
    scrolled 
      ? "bg-white/95 backdrop-blur-md border-b border-border/40 shadow-sm" 
      : "bg-transparent border-b border-transparent"
  } ${
    visible ? "top-0" : "-top-32"
  }`}
>
```

**Explicação:**
- `top-0` - Header visível (posição normal)
- `-top-32` - Header escondido (desliza para cima)
- `transition-all duration-300` - Animação suave de 300ms

#### Navegação e Logo
```tsx
<nav className={`flex gap-6 text-base transition-colors duration-300 ${
  scrolled ? "text-foreground" : "text-white drop-shadow-lg"
}`}>
```

---

## 🎯 Configuração

### Ajustar Threshold de Background Sólido

Para mudar quando o header muda de aparência:

```typescript
// Padrão: 50px
setScrolled(currentScrollY > 50);

// Mais cedo (sensível)
setScrolled(currentScrollY > 20);

// Mais tarde (menos sensível)
setScrolled(currentScrollY > 100);
```

### Ajustar Threshold de Sempre Visível

Para mudar até que ponto o header nunca esconde:

```typescript
// Padrão: 10px
if (currentScrollY < 10) {
  setVisible(true);
}

// Mais área (não esconde até 50px)
if (currentScrollY < 50) {
  setVisible(true);
}

// Menos área (pode esconder antes)
if (currentScrollY < 5) {
  setVisible(true);
}
```

### Desabilitar Auto-Hide

Para manter o header sempre visível:

```typescript
// Remove a lógica de esconder
if (currentScrollY < 10) {
  setVisible(true);
} else {
  setVisible(true); // Sempre true
}
```

Ou simplesmente:
```typescript
const [visible, setVisible] = useState(true); // Sempre true
// Remove toda a lógica de visible do handleScroll
```

### Ajustar Velocidade da Transição

Mude `duration-300` nas classes:

```tsx
// Padrão: 300ms
className="transition-all duration-300"

// Mais rápido (200ms)
className="transition-all duration-200"

// Mais lento (500ms)
className="transition-all duration-500"
```

### Ajustar Transparência do Background

Mude `bg-white/95`:

```tsx
// Padrão: 95% opaco
"bg-white/95"

// Mais transparente (80%)
"bg-white/80"

// Totalmente opaco
"bg-white"
```

### Ajustar Intensidade do Blur

Mude `backdrop-blur-md`:

```tsx
// Padrão: Médio
"backdrop-blur-md"

// Leve
"backdrop-blur-sm"

// Intenso
"backdrop-blur-lg"

// Muito intenso
"backdrop-blur-xl"
```

---

## 🎨 Classes Tailwind Utilizadas

### Background & Blur
- `bg-transparent` - Background transparente
- `bg-white/95` - Background branco com 95% de opacidade
- `backdrop-blur-md` - Efeito de desfoque no fundo

### Texto
- `text-white` - Texto branco (transparente)
- `text-foreground` - Cor de texto padrão (scrolled)
- `drop-shadow-lg` - Sombra no texto (legibilidade)

### Transições
- `transition-all duration-300` - Transição suave (300ms)
- `transition-colors duration-300` - Transição apenas de cores

### Bordas & Sombras
- `border-transparent` - Borda transparente
- `border-b border-border/40` - Borda inferior suave
- `shadow-sm` - Sombra pequena

---

## 📱 Responsividade

O efeito funciona em todos os tamanhos de tela:

- **Mobile:** Mesmo comportamento
- **Tablet:** Mesmo comportamento
- **Desktop:** Mesmo comportamento

O header ajusta automaticamente seu padding e tamanho com as classes responsivas existentes.

---

## 🔍 Debugging

### Console Logs

Para ver quando o estado muda, adicione logs:

```typescript
const handleScroll = () => {
  const scrollPosition = window.scrollY;
  const newScrolled = scrollPosition > 50;
  
  if (newScrolled !== scrolled) {
    console.log(`Header state changed: ${scrolled ? 'transparent' : 'solid'}`);
  }
  
  setScrolled(newScrolled);
};
```

### Testar Estados

Para testar visualmente:

```typescript
// Sempre transparente (teste)
const [scrolled, setScrolled] = useState(false);

// Sempre sólido (teste)
const [scrolled, setScrolled] = useState(true);
```

---

## 🎭 Variações

### Gradiente ao invés de Sólido

```tsx
className={`... ${
  scrolled 
    ? "bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-md" 
    : "bg-transparent"
}`}
```

### Cor Diferente quando Scrolled

```tsx
className={`... ${
  scrolled 
    ? "bg-gray-900/95 backdrop-blur-md" 
    : "bg-transparent"
}`}

// E ajustar texto para branco quando scrolled
className={`... ${
  scrolled ? "text-white" : "text-white drop-shadow-lg"
}`}
```

### Fade Gradual (Opacidade Proporcional)

Ao invés de true/false, use opacidade proporcional ao scroll:

```typescript
const [headerOpacity, setHeaderOpacity] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    // Opacidade de 0 a 1 baseado em 0-100px de scroll
    const opacity = Math.min(scrollPosition / 100, 1);
    setHeaderOpacity(opacity);
  };
  
  window.addEventListener("scroll", handleScroll);
  handleScroll();
  
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

```tsx
<header 
  style={{
    backgroundColor: `rgba(255, 255, 255, ${headerOpacity * 0.95})`,
    backdropFilter: headerOpacity > 0.2 ? 'blur(8px)' : 'none',
  }}
  className="fixed top-0 left-0 z-50 ..."
>
```

---

## 🚀 Performance

### Otimização do Listener

O código já está otimizado com:

1. ✅ **Cleanup do listener** - Remove ao desmontar
2. ✅ **Estado simples** - Boolean ao invés de valores complexos
3. ✅ **Threshold fixo** - Não recalcula a cada pixel

### Melhorias Opcionais

Para melhor performance em scroll:

```typescript
// Throttle do scroll event
import { useEffect, useState, useRef } from "react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          setScrolled(scrollPosition > 50);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // ...
};
```

---

## 📚 Referências

- [Tailwind CSS - Backdrop Blur](https://tailwindcss.com/docs/backdrop-blur)
- [Tailwind CSS - Background Opacity](https://tailwindcss.com/docs/background-color#changing-the-opacity)
- [MDN - Window: scroll event](https://developer.mozilla.org/en-US/docs/Web/API/Window/scroll_event)
- [React - useEffect Hook](https://react.dev/reference/react/useEffect)

---

**Arquivo:** `components/header/Header.tsx`  
**Última atualização:** Outubro 2025

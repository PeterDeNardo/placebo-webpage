import Image from "next/image";
import Link from "next/link";

interface HeroButton {
  text: string;
  href: string;
  variant: "primary" | "outline";
}

interface HeroContent {
  title: string;
  subtitle: string;
  buttons: HeroButton[];
}

interface HeroProps {
  mediaType?: "image" | "video";
  mediaSrc?: string;
  videoFormat?: "mp4" | "webm" | "ogg";
  posterImage?: string | null;
  overlayOpacity?: number;
  content?: HeroContent;
  showScrollIndicator?: boolean;
}

export default function Hero({
  mediaType = "image",
  mediaSrc = "https://picsum.photos/1920/1080?random=hero",
  videoFormat = "mp4",
  posterImage = null,
  overlayOpacity = 40,
  content = {
    title: "Placebo",
    subtitle: "Descubra o estilo que define você",
    buttons: [
      { text: "Ver Novidades", href: "/novidades", variant: "primary" },
      { text: "Explorar Coleção", href: "/roupas", variant: "outline" },
    ],
  },
  showScrollIndicator = true,
}: HeroProps) {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {mediaType === "video" ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={posterImage || undefined}
            className="w-full h-full object-cover"
          >
            <source src={mediaSrc} type={`video/${videoFormat}`} />
            {/* Fallback para navegadores sem suporte a vídeo */}
            {posterImage && (
              <Image
                src={posterImage}
                alt="Hero Background"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            )}
          </video>
        ) : (
          <Image
            src={mediaSrc}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        {/* Overlay escuro para melhor legibilidade do texto */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity / 100 }}
        />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
          {content.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90">
          {content.subtitle}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          {content.buttons.map((button, index) => (
            <Link
              key={index}
              href={button.href}
              className={
                button.variant === "primary"
                  ? "px-8 py-4 bg-white text-black font-semibold rounded-md hover:bg-white/90 transition-colors"
                  : "px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors"
              }
            >
              {button.text}
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
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
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      )}
    </section>
  );
}


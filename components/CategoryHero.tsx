import Image from "next/image";

type CategoryHeroProps = {
  title: string;
  description?: string;
  mediaType?: "image" | "video";
  mediaSrc?: string;
  videoFormat?: string;
  posterImage?: string | null;
};

export default function CategoryHero({
  title,
  description,
  mediaType = "image",
  mediaSrc = "https://picsum.photos/seed/category-default/1920/600",
  videoFormat = "video/mp4",
  posterImage = null,
}: CategoryHeroProps) {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-start overflow-hidden">
      {/* Background Media */}
      {mediaType === "video" ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={posterImage || undefined}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={mediaSrc} type={videoFormat} />
        </video>
      ) : (
        <Image
          src={mediaSrc}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-left px-8 md:px-16 lg:px-24 max-w-4xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
          {title}
        </h1>
        {description && (
          <p className="text-base md:text-lg text-white/90 drop-shadow-md max-w-xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}


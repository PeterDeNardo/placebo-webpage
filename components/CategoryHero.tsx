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
  mediaSrc = "https://picsum.photos/seed/category-default/1920/400",
  videoFormat = "video/mp4",
  posterImage = null,
}: CategoryHeroProps) {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {title}
        </h1>
        {description && (
          <p className="text-lg md:text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}


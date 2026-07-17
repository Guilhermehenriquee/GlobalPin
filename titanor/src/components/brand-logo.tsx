import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  compact?: boolean;
  className?: string;
};

export function BrandLogo({ href = "/", compact = false, className = "" }: BrandLogoProps) {
  const size = compact ? "h-10 w-28 sm:h-12 sm:w-36 lg:h-14 lg:w-44" : "h-20 w-52 sm:h-24 sm:w-64";

  const logo = (
    <span className={`relative inline-flex ${size} shrink-0 items-center ${className}`}>
      <Image
        src="/brand/logo-titanor-oficial.png"
        alt="TITANOR"
        fill
        priority={compact}
        sizes={compact ? "(max-width: 640px) 112px, 176px" : "(max-width: 640px) 208px, 256px"}
        className="object-contain drop-shadow-[0_0_22px_rgba(255,255,255,0.12)]"
      />
    </span>
  );

  if (!href) {
    return logo;
  }

  return (
    <Link href={href} aria-label="TITANOR Home" className="inline-flex">
      {logo}
    </Link>
  );
}

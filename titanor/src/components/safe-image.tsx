import Image, { type ImageProps } from "next/image";

type SafeImageProps = ImageProps & {
  src: string;
};

export function SafeImage({ src, alt, fill, style, className, ...props }: SafeImageProps) {
  if (src.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...(fill ? { position: "absolute", inset: 0, height: "100%", width: "100%" } : {}),
          ...style,
        }}
      />
    );
  }

  return <Image src={src} alt={alt} fill={fill} style={style} className={className} {...props} />;
}

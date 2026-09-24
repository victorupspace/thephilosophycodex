import Image from "next/image";
import { initials } from "@/lib/utils/text";
import styles from "./Avatar.module.css";

interface AvatarProps {
  name: string;
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  hue?: number;
}

/** Portrait when available, otherwise a typographic monogram (no fake photos). */
export function Avatar({ name, src, alt, size = "md", hue }: AvatarProps) {
  const px = { sm: 36, md: 48, lg: 72, xl: 112 }[size];
  return (
    <span
      className={[styles.avatar, size !== "md" && styles[size]].filter(Boolean).join(" ")}
      style={hue !== undefined ? ({ "--h": hue } as React.CSSProperties) : undefined}
      aria-hidden={src ? undefined : true}
    >
      {src ? <Image src={src} alt={alt ?? name} width={px} height={px} /> : initials(name)}
    </span>
  );
}

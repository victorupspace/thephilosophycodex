import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: boolean;
  className?: string;
  children?: ReactNode;
}

type ButtonProps = BaseProps & ComponentPropsWithoutRef<"button"> & { href?: undefined };
type LinkProps = BaseProps & Omit<ComponentPropsWithoutRef<typeof Link>, "className"> & { href: string };

function cls({ variant = "primary", size = "md", icon, className }: BaseProps) {
  return [styles.btn, variant !== "primary" && styles[variant], size !== "md" && styles[size], icon && styles.icon, className]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: ButtonProps | LinkProps) {
  if ("href" in props && props.href) {
    const { variant, size, icon, className, children, href, ...rest } = props;
    return (
      <Link href={href} className={cls({ variant, size, icon, className })} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant, size, icon, className, children, ...rest } = props as ButtonProps;
  return (
    <button type="button" className={cls({ variant, size, icon, className })} {...rest}>
      {children}
    </button>
  );
}

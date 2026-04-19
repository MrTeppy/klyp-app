"use client";

import Link from "next/link";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
};

export default function Button({ children, href, variant = "primary", onClick }: Props) {
  const base =
    "inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium transition";

  const styles = {
    primary: "bg-black text-white hover:opacity-90",
    secondary: "bg-white border border-black/10 text-black/70 hover:bg-black/5",
    ghost: "text-black/60 hover:bg-black/5",
  };

  const className = `${base} ${styles[variant]}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

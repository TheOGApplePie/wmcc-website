import Link from "next/link";

type Variant = "primary" | "nav";

interface CTALinkProps {
  href: string;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function CTALink({
  href,
  variant = "primary",
  className = "",
  onClick,
  children,
}: Readonly<CTALinkProps>) {
  const combined = [`btn-${variant}`, className].filter(Boolean).join(" ");
  const isInternal = href.startsWith("/");

  if (isInternal) {
    return (
      <Link href={href} className={combined} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={combined}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {children}
    </a>
  );
}

"use client";
import Link from "next/link";
import CTALink from "./CTALink";
import { useEffect, useRef } from "react";

interface DropdownHeaderProps {
  links: { link: string | { link: string; title: string }[]; title: string }[];
  showDropdownMenu: boolean;
  onClose: () => void;
}
export default function DropdownHeader({
  links,
  showDropdownMenu,
  onClose,
}: Readonly<DropdownHeaderProps>) {
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (showDropdownMenu) return;

    menuRef.current?.querySelectorAll("details[open]").forEach((details) => {
      details.removeAttribute("open");
    });
  }, [showDropdownMenu]);

  return (
    <nav
      aria-label="Primary"
      className="md:hidden"
      aria-hidden={!showDropdownMenu}
    >
      <ul
        id="mobile-navigation"
        ref={menuRef}
        inert={!showDropdownMenu}
        aria-hidden={!showDropdownMenu}
        className={`z-[9] bg-main-colour-blue md:hidden block left-0 top-full absolute ${
          showDropdownMenu
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-full opacity-0 pointer-events-none"
        } w-full text-white font-bold transition-[transform,opacity,visibility] duration-500 ease-in-out motion-reduce:transition-none`}
      >
        {links.map((link) => (
          <li key={link.title} className="border-t border-black">
            {typeof link.link === "string" ? (
              <Link href={link.link} className="block p-3" onClick={onClose}>
                {link.title}
              </Link>
            ) : (
              <details>
                <summary className="cursor-pointer p-3">{link.title}</summary>

                <ul className="pb-2">
                  {link.link.map((child) => (
                    <li key={child.link}>
                      <Link
                        href={child.link}
                        className="block py-3 pl-6 pr-3 hover:bg-green"
                        onClick={onClose}
                      >
                        {child.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </li>
        ))}
        <li key="donate" className="p-3 text-center">
          <CTALink
            href="https://www.zeffy.com/en-CA/donation-form/donate-to-support-our-community-centre"
            onClick={onClose}
          >
            Donate
          </CTALink>
        </li>
      </ul>
    </nav>
  );
}

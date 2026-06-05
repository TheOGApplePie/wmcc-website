"use client";
import Link from "next/link";
import CTALink from "./CTALink";

interface DropdownHeaderProps {
  links: { link: string; title: string }[];
  showDropdownMenu: boolean;
  onClose: () => void;
}
export default function DropdownHeader({
  links,
  showDropdownMenu,
  onClose,
}: Readonly<DropdownHeaderProps>) {
  return (
    <ul
      className={`z-[9] bg-main-colour-blue md:none inline-block left-0 absolute ${
        showDropdownMenu ? "top-full" : "top-[-300px]"
      } w-full text-white font-bold transition-all duration-500 ease-in-out transform`}
    >
      {links.map((link) => (
        <li key={`dropdown-${link.title}`} className="p-2 border-t border-t-black">
          {link.link.startsWith("/") ? (
            <Link className="block" href={link.link} onClick={onClose}>
              {link.title}
            </Link>
          ) : (
            <a
              className="block"
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              {link.title}
            </a>
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
  );
}

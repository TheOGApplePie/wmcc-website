"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import DropdownHeader from "./dropdownHeader";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CTALink from "./CTALink";

export default function Header() {
  const pathname = usePathname();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const headerLinks = [
    { link: "/", title: "Home" },
    { link: "/events", title: "Events" },
    { link: "/about", title: "About WMCC" },
    { link: "/contact", title: "Contact" },
    {
      link: "https://www.waterdownislamicschool.ca",
      title: "Waterdown Islamic School",
    },
  ];

  const isActive = (link: string) =>
    link === "/" ? pathname === "/" : pathname.startsWith(link);

  const handleScroll = () => setScrollPosition(window.pageYOffset);

  const handleResize = () => {
    const width = window.innerWidth;
    setWindowSize({ width, height: window.innerHeight });
    if (width > 767) setShowDropdownMenu(false);
  };

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const atHeroTop =
    scrollPosition <= windowSize.height - 120 && pathname === "/";
  const shadow = showDropdownMenu ? "" : "shadow-[0px_0px_1rem_#000]";
  const headerBg = atHeroTop
    ? "background-gradient"
    : `bg-main-colour-blue ${shadow}`;

  return (
    <header className="sticky top-0">
      <div
        className={`transition-shadow ease-in-out duration-700 ${headerBg} relative flex justify-between px-6 py-2 z-10`}
      >
        <div>
          <Link href="/">
            <Image
              src="/wmcc-white.png"
              alt="WMCC logo"
              width={100}
              height={100}
            />
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-end items-center">
          {headerLinks.map((link) =>
            link.link.startsWith("/") ? (
              <Link
                key={link.title}
                href={link.link}
                className={`btn-nav text-xl mx-1 ${isActive(link.link) ? "font-bold text-green-light hover:text-white" : ""}`}
              >
                {link.title}
              </Link>
            ) : (
              <a
                key={link.title}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-nav text-xl mx-1 text-white"
              >
                {link.title}
              </a>
            ),
          )}
          <CTALink
            href="https://www.zeffy.com/en-CA/donation-form/donate-to-support-our-community-centre"
            className="text-xl ml-1"
          >
            Donate
          </CTALink>
        </div>

        <div className="flex md:hidden items-center">
          <button
            className="text-xl p-3 rounded text-white bg-secondary-colour-green"
            onClick={() => setShowDropdownMenu(!showDropdownMenu)}
            aria-expanded={showDropdownMenu}
            aria-label="Toggle navigation menu"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>
      <DropdownHeader
        links={headerLinks}
        showDropdownMenu={showDropdownMenu}
        onClose={() => setShowDropdownMenu(false)}
      />
    </header>
  );
}

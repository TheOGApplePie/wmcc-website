"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import DropdownHeader from "./dropdownHeader";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 120, height: 1980 });
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const headerLinks = [
    {
      link: "/",
      title: "Home",
    },
    {
      link: "/events",
      title: "Events",
    },
    {
      link: "/about",
      title: "About WMCC",
    },
    {
      link: "/contact",
      title: "Contact",
    },
    {
      link: "https://www.waterdownislamicschool.ca",
      title: "Waterdown Islamic School",
    },
  ];
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setWindowSize({ width, height });
    if (width > 767) {
      setShowDropdownMenu(false);
    }
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

  return (
    <header className="sticky top-0">
      <div
        className={`transition-shadow ease-in-out duration-700 ${
          scrollPosition <= windowSize.height - 120 && pathname === "/"
            ? "background-gradient"
            : "bg-main-colour-blue " +
              (showDropdownMenu ? "" : "shadow-[0px_0px_1rem_#000]")
        } relative flex justify-between px-6 py-2 z-10`}
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
          {headerLinks.map((link) => (
            <a
              className="p-4 mx-1 rounded text-xl text-white hover:bg-[var(--secondary-colour-green-light)] transition-colors"
              key={`big-` + link.title}
              href={link.link}
            >
              {link.title}
            </a>
          ))}
          <button className="border-0 sm:rounded text-xl p-3 text-white hover:bg-[var(--secondary-colour-green-light)]">
            <a
              key="big-donate"
              rel="noopener noreferrer"
              href="https://app.irm.io/wmcc.ca/operations"
              target="_blank"
            >
              Donate
            </a>
          </button>
        </div>
        <div className="flex md:hidden items-center">
          <button
            className="text-xl p-3 rounded text-white bg-secondary-colour-green"
            onClick={() => setShowDropdownMenu(!showDropdownMenu)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>
      <DropdownHeader links={headerLinks} showDropdownMenu={showDropdownMenu} />
    </header>
  );
}

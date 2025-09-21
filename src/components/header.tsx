"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import DropdownHeader from "./dropdownHeader";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
      link: "events",
      title: "Events",
    },
    {
      link: "about",
      title: "About WMCC",
    },
    {
      link: "contact",
      title: "Contact",
    },
    {
      link: "https://www.waterdownislamicschool.ca",
      title: "WIS (Waterdown Islamic School)",
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
  };

  useEffect(() => {
    setWindowSize({ width: window.innerHeight, height: window.innerHeight });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header
      className={
        (scrollPosition <= windowSize.height - 120 && pathname === "/"
          ? "background-gradient"
          : "bg-main-colour-blue shadow-[0px_0px_1rem_#000]") +
        " flex justify-between px-6 py-2"
      }
    >
      <div>
        <Link href="/">
          <img src="wmcc-white.png" alt="WMCC logo" />
        </Link>
      </div>
      <div className="hidden md:flex flex-1 justify-end items-center">
        {headerLinks.map((link) => (
          <a
            className="px-3 text-xl text-white"
            key={`big-` + link.title}
            href={link.link}
          >
            {link.title}
          </a>
        ))}
        <a className="px-3 text-xl text-white" key="big-donate" href="donate">
          <button className="border-0 sm:rounded text-xl p-3 text-white">
            Donate
          </button>
        </a>
      </div>
      <div className="flex md:hidden items-center">
        <button
          className="text-xl p-3 rounded text-white bg-[var(--secondary-colour-green)]"
          onClick={() => setShowDropdownMenu(!showDropdownMenu)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <DropdownHeader links={headerLinks} showDropdownMenu={showDropdownMenu} />
    </header>
  );
}

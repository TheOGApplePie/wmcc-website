"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import DropdownHeader from "./dropdownHeader";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CTALink from "./CTALink";

export default function Header() {
  const pathname = usePathname();
  const [educationOpen, setEducationOpen] = useState(false);
  const educationButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dismissEducation = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setEducationOpen(false);
      if (
        educationButton.current?.parentElement?.contains(document.activeElement)
      ) {
        educationButton.current.focus();
      }
    };
    document.addEventListener("keydown", dismissEducation);
    return () => document.removeEventListener("keydown", dismissEducation);
  }, []);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const headerLinks = [
    { link: "/", title: "Home" },
    { link: "/events", title: "Events" },
    { link: "/about", title: "About WMCC" },
    { link: "/contact", title: "Contact" },
    {
      link: [
        {
          link: "/wmcc-weekend-school",
          title: "Weekend School",
        },
        {
          link: "/wmcc-sunday-arabic-school",
          title: "Sunday Arabic School",
        },
        {
          link: "/wmcc-quran-program",
          title: "Quran Program",
        },
        {
          link: "https://www.waterdownislamicschool.ca",
          title: "Waterdown Islamic School",
        },
      ],
      title: "Education",
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
    handleScroll();
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
          <Link href="/" onClick={() => setShowDropdownMenu(false)}>
            <Image
              src="/wmcc-white.png"
              alt="WMCC logo"
              width={100}
              height={100}
            />
          </Link>
        </div>

        <nav
          aria-label="Primary"
          className="hidden md:flex flex-1 justify-end items-center"
        >
          {headerLinks.map((link) =>
            typeof link.link === "string" ? (
              <Link
                key={link.title}
                href={link.link}
                className={`btn-nav text-xl mx-1 ${isActive(link.link) ? "font-bold text-green-light hover:text-white" : ""}`}
              >
                {link.title}
              </Link>
            ) : (
              <div
                key={link.title}
                className="dropdown"
                onMouseEnter={() => setEducationOpen(true)}
                onMouseLeave={(event) => {
                  if (!event.currentTarget.contains(document.activeElement))
                    setEducationOpen(false);
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    setEducationOpen(false);
                }}
              >
                <button
                  ref={educationButton}
                  type="button"
                  className="btn-nav text-xl mx-1"
                  aria-expanded={educationOpen}
                  aria-controls="education-links"
                  onClick={() => setEducationOpen((open) => !open)}
                >
                  {link.title}
                </button>
                <div
                  id="education-links"
                  className="dropdown-content"
                  hidden={!educationOpen}
                >
                  {Array.isArray(link.link) &&
                    link.link.map((dropdownLink) => (
                      <Link
                        key={dropdownLink.title}
                        href={dropdownLink.link}
                        onClick={() => setEducationOpen(false)}
                        className={`btn-nav text-xl block mx-1 ${isActive(dropdownLink.link) ? "font-bold text-green-light hover:text-white" : ""}`}
                      >
                        {dropdownLink.title}
                      </Link>
                    ))}
                </div>
              </div>
            ),
          )}
          <CTALink
            href="https://www.zeffy.com/en-CA/donation-form/donate-to-support-our-community-centre"
            className="text-xl ml-1"
          >
            Donate
          </CTALink>
        </nav>

        <div className="flex md:hidden items-center">
          <button
            className="text-xl p-3 rounded text-white bg-secondary-colour-green"
            onClick={() => setShowDropdownMenu(!showDropdownMenu)}
            aria-controls="mobile-navigation"
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

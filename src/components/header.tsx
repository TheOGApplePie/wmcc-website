"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import DropdownHeader from "./dropdownHeader";

export default function Header() {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const headerLinks = [
    {
      link: "/",
      title: "Home",
    },
    {
      link: "events",
      title: "Programs & Services",
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
  return (
    <header className="flex justify-between">
      <div>
        <img src="wmcc.svg" alt="" />
      </div>
      <div className="py-2 px-4 hidden md:flex flex-1 justify-end items-center">
        {headerLinks.map((link) => (
          <a
            className="px-3 text-xl text-white text-decoration-none"
            key={`big-` + link.title}
            href={link.link}
          >
            {link.title}
          </a>
        ))}
        <button className="border-0 text-xl p-3 rounded-sm text-white">
          Donate
        </button>
      </div>
      <div className="flex md:hidden items-center py-2 px-4">
        <button
          className="border-0 text-xl p-3 rounded-sm text-white"
          onClick={() => setShowDropdownMenu(!showDropdownMenu)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <DropdownHeader links={headerLinks} showDropdownMenu={showDropdownMenu} />
    </header>
  );
}

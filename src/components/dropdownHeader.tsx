"use client";

interface DropdownHeaderProps {
  links: { link: string; title: string }[];
  showDropdownMenu: boolean;
}
export default function DropdownHeader({
  links,
  showDropdownMenu,
}: DropdownHeaderProps) {
  return (
    <ul
      className={`z-[9] bg-main-colour-blue md:none inline-block left-0 absolute ${
        showDropdownMenu ? "top-full" : "top-[-300px]"
      } w-full text-white font-bold transition-all duration-500 ease-in-out transform`}
    >
      {links.map((link) => (
        <li
          key={`dropdown-` + link.title}
          className="p-2 border-t border-t-black"
        >
          <a className="block" href={link.link}>
            {link.title}
          </a>
        </li>
      ))}
      <li key="donate" className="p-3 text-center bg-secondary-colour-green">
        <a
          key="dropdown-donate"
          rel="noopener noreferrer"
          // href="https://app.irm.io/wmcc.ca/operations"
          href="https://www.zeffy.com/en-CA/donation-form/donate-to-support-our-community-centre"
          target="_blank"
        >
          Donate
        </a>
      </li>
    </ul>
  );
}

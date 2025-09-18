"use client";

interface DropdownHeaderProps {
  links: { link: string; title: string }[];
  showDropdownMenu: boolean;
}
export default function DropdownHeader({
  links,
  showDropdownMenu,
}: DropdownHeaderProps) {
  if (!showDropdownMenu) {
    return null;
  }
  return (
    <ul className="bg-main-colour-blue md:none inline-block absolute left-0 top-[115px] w-full text-white font-bold">
      {links.map((link) => (
        <li
          key={`dropdown-` + link.title}
          className="p-2 border-t border-t-black"
        >
          <a href={link.link}>
            <button className="w-full text-left">{link.title}</button>
          </a>
        </li>
      ))}
      <li key="donate" className="p-3 text-center bg-secondary-colour-green">
        <a className="w-full" href="donate">
          <button className="w-full">Donate</button>
        </a>
      </li>
    </ul>
  );
}

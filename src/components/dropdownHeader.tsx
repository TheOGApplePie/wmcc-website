interface DropdownHeaderProps {
  links: { link: string; title: string }[];
  showDropdownMenu: boolean;
}
export default function DropdownHeader({
  links,
  showDropdownMenu,
}: DropdownHeaderProps) {
  return showDropdownMenu ? (
    <ul className="d-md-none d-inline-block position-absolute just-below-header list-group-flush w-100 list-group">
      {links.map((link) => (
        <li
          key={`dropdown-` + link.title}
          className="p-2 bg-main-colour-blue list-group-item"
        >
          <a
            className="fw-bold text-decoration-none text-white"
            href={link.link}
          >
            {link.title}
          </a>
        </li>
      ))}
      <li
        key="donate"
        className="p-2 list-group-item text-center bg-secondary-colour-green"
      >
        <a className="fw-bold text-decoration-none text-white" href="#">
          Donate
        </a>
      </li>
    </ul>
  ) : (
    <></>
  );
}

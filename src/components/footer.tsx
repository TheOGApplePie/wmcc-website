export default function Footer() {
  const footerLinks = [
    {
      link: "#",
      title: "Home",
    },
    {
      link: "#",
      title: "Programs & Services",
    },
    {
      link: "#",
      title: "About",
    },
    {
      link: "#",
      title: "Contact",
    },
  ];
  return (
    <footer className="px-3 bg-dark d-flex flex-column flex-md-row justify-content-md-between align-items-center">
      <div className="py-3">
        <p className="text-white fw-bold">
          Waterdown Muslim Community Center (WMCC)
        </p>
        <p className="text-white fw-bold">
          All donations are tax deductible. Charity # 75639 4409 RR0001
        </p>
        <p className="text-white fw-bold">
          © Copyright WMCC - All Rights Reserved
        </p>
      </div>
      <div className="d-flex flex-wrap py-3">
        {footerLinks.map((link) => (
          <a
            className="px-4 py-2 text-white fw-bold"
            key={link.title}
            href={link.link}
          >
            {link.title}
          </a>
        ))}
      </div>
      <div className="d-flex">
        <a href="https://www.facebook.com/WMCCofficial">
          <img
            className="inline-block mx-2"
            height="30px"
            src="facebook.png"
            alt=""
          />
        </a>
        <a href="https://www.instagram.com/wmcc.centre/">
          <img
            className="inline-block mx-2"
            height="30px"
            src="instagram.svg"
            alt=""
          />
        </a>
      </div>
    </footer>
  );
}

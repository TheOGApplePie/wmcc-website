import Image from "next/image";

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
    <footer className="px-3 bg-gray-900 flex flex-col md:flex-row md:justify-between items-center">
      <div className="py-3">
        <p className="text-white text-xl">
          Waterdown Muslim Community Center (WMCC)
        </p>
        <p className="text-white text-xl">
          All donations are tax deductible. Charity # 75639 4409 RR0001
        </p>
        <p className="text-white text-xl">
          © Copyright WMCC - All Rights Reserved
        </p>
      </div>
      <div className="flex flex-wrap py-3">
        {footerLinks.map((link) => (
          <a
            className="px-4 py-2 text-white text-xl"
            key={link.title}
            href={link.link}
          >
            {link.title}
          </a>
        ))}
      </div>
      <div className="flex">
        <a href="https://www.facebook.com/WMCCofficial">
          <Image
            className="inline-block mx-2"
            height={30}
            width={30}
            src="/facebook.png"
            alt=""
          />
        </a>
        <a href="https://www.instagram.com/wmcc.centre/">
          <Image
            className="inline-block mx-2"
            height={30}
            width={30}
            src="/instagram.svg"
            alt=""
          />
        </a>
      </div>
    </footer>
  );
}

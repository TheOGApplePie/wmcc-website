import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const footerLinks = [
    { link: "/", title: "Home" },
    { link: "/events", title: "Events" },
    { link: "/about", title: "About WMCC" },
    { link: "/contact", title: "Contact" },
  ];
  return (
    <footer className="p-3 bg-footer-bg flex flex-col md:flex-row md:justify-between items-center">
      <div className="py-3 text-sm sm:text-base text-white">
        <p>Waterdown Muslim Community Centre (WMCC)</p>
        <p>All donations are tax deductible. Charity # 75639 4409 RR0001</p>
        <p>© Copyright WMCC - All Rights Reserved</p>
      </div>
      <div className="flex flex-wrap py-3">
        {footerLinks.map((link) => (
          <Link
            className="px-4 py-2 text-white text-sm sm:text-base hover:text-green-light"
            key={link.title}
            href={link.link}
          >
            {link.title}
          </Link>
        ))}
      </div>
      <div className="flex">
        <a href="https://www.facebook.com/WMCCofficial" target="_blank" rel="noopener noreferrer">
          <Image className="inline-block mx-2" height={30} width={30} src="/facebook.png" alt="wmcc facebook" />
        </a>
        <a href="https://www.instagram.com/wmcc.ca/" target="_blank" rel="noopener noreferrer">
          <Image className="inline-block mx-2" height={30} width={30} src="/instagram.svg" alt="wmcc instagram" />
        </a>
        <a href="https://chat.whatsapp.com/H2O1IFhP7FjIWXik8z7NRH" target="_blank" rel="noopener noreferrer">
          <Image className="inline-block mx-2" height={30} width={30} src="/whatsapp.svg" alt="wmcc WhatsApp" />
        </a>
      </div>
    </footer>
  );
}

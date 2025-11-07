import ContactForm from "../../components/contactForm";
import Image from "next/image";
export default function Contact() {
  const apiKey = process.env.MAPS_API;
  const captchaPublicKey = process.env.RECAPTCHA_SITE_KEY;

  const googleMapsURL =
    "https://www.google.com/maps/embed/v1/place?key=" +
    apiKey +
    "&q=20+Innovation+Dr,+Hamilton,+ON+L9H+7P3,+Canada";
  return (
    <div className="p-4 sm:p-10">
      <h1 className="text-4xl">Contact Us</h1>
      <div className="border border-black rounded-lg my-3 grid grid-cols-1 sm:grid-cols-2 justify-center items-center">
        <div className="p-5 col-span-1 text-xl">
          <h4 className="text-center">
            If you have any questions, or just want to get in touch, feel free
            to fill out the form and we will get back to you as soon as
            possible.
          </h4>
          <div className="my-4">
            <span className="flex items-center">
              <Image
                className="inline"
                height="30"
                width="30"
                src="location-dot.svg"
                alt="location icon"
              />
              20 Innovation Dr, Dundas, ON L9H 7P3
            </span>
            {apiKey ? (
              <iframe
                title="googlemaps"
                className="w-full"
                src={googleMapsURL}
              ></iframe>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className="p-5 h-full rounded-b-lg sm:rounded-b-none sm:rounded-r-lg col-span-1 bg-[#1E3A5F]">
          <ContactForm captchaPublicKey={captchaPublicKey ?? ""} />
        </div>
      </div>
    </div>
  );
}

import Loading from "../components/loading";
import { Suspense } from "react";
import MasjidboxWidget from "../components/Masjidbox";
import Image from "next/image";
import CTALink from "../components/CTALink";
import { headers } from "next/headers";
import HomeAnnouncements from "../components/homeAnnouncements";
import HomeEvents from "../components/homeEvents";

export default async function Home() {
  const xnonceHeader = (await headers()).get("x-nonce") || "";
  return (
    <div>
      <section>
        <Suspense
          fallback={<Loading inline label="Loading announcements…" />}
        >
          <HomeAnnouncements />
        </Suspense>
      </section>
      <section>
        <MasjidboxWidget xnonceHeader={xnonceHeader} />
      </section>
      <section>
        <div className="border-t-4 px-8 py-14 bg-main-blue text-white">
          <h1 className="text-4xl pb-8">About Us</h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="md:col-span-1 col-span-2 ">
              <Image
                className="object-cover rounded-2xl"
                src={"/community-dua.jpg"}
                alt="About us"
                height={700}
                width={700}
              />
            </div>
            <div className="md:col-span-1 col-span-2">
              <p className="text-md md:text-2xl">
                The Waterdown Muslim Community Centre (WMCC) is a registered
                charitable organization devoted to uplifting and connecting
                Muslim families in Waterdown, Hamilton, and neighbouring areas.
              </p>
              <p className="text-md md:text-2xl my-3">
                Rooted in the values of inclusivity, unity, and collaboration,
                WMCC offers charitable, educational, spiritual, and social
                programs designed to nurture personal growth, strengthen
                families, and build a vibrant, faith-centered community—all
                guided by the teachings of the Qur&apos;an and Sunnah.
              </p>
              <p className="text-md md:text-2xl">
                We believe in the power of togetherness. By fostering meaningful
                engagement, joyful experiences, and a strong sense of belonging,
                WMCC strives to create enriching opportunities that celebrate
                the beauty and purpose of living a balanced Islamic life.
              </p>
              <div className="mt-6">
                <CTALink href="/about">Learn more about WMCC</CTALink>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="border-t-4 w-full px-8 py-14 ">
          <h1 className="text-4xl">Current and upcoming events</h1>
          <Suspense
            fallback={
              <Loading inline label="Loading upcoming events…" />
            }
          >
            <HomeEvents />
          </Suspense>
        </div>
      </section>
      <section>
        <div className="border-t-4 bg-main-blue text-white">
          <div className="p-8">
            <h1 className="text-4xl">
              Help support the WMCC and donate today!
            </h1>
          </div>
          <div className="sm:p-8 w-full flex items-center justify-center">
            <iframe
              src="https://www.zeffy.com/en-CA/donation-form/donate-to-support-our-community-centre"
              className="w-full max-w-3xl"
              height={600}
              title="WMCC Operations Donation"
              sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
              referrerPolicy="strict-origin"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

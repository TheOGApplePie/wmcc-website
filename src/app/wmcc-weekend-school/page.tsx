import type { Metadata } from "next";
import { SITE_ORIGIN } from "../../lib/site";
import SchoolDetails from "../../components/schoolDetails";

export const metadata: Metadata = {
  title: "Weekend School",
  description:
    "A fun and engaging Saturday Islamic program for children ages 4\u201314 (JK\u2013Grade 8), growing in faith, knowledge, and character at WMCC.",
  alternates: { canonical: `${SITE_ORIGIN}/wmcc-weekend-school` },
  openGraph: {
    type: "website",
    siteName: "WMCC",
    url: `${SITE_ORIGIN}/wmcc-weekend-school`,
    title: "Weekend School | WMCC",
    description:
      "A fun and engaging Saturday Islamic program for children ages 4\u201314 (JK\u2013Grade 8), growing in faith, knowledge, and character at WMCC.",
    images: [
      {
        url: "https://gkpctbvyswcfccogoepl.supabase.co/storage/v1/object/public/event-posters/public/wmcc_weekend_school.png",
        alt: "WMCC Weekend School flyer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weekend School | WMCC",
    description:
      "A fun and engaging Saturday Islamic program for children ages 4\u201314 (JK\u2013Grade 8), growing in faith, knowledge, and character at WMCC.",
    images: [
      "https://gkpctbvyswcfccogoepl.supabase.co/storage/v1/object/public/event-posters/public/wmcc_weekend_school.png",
    ],
  },
};

export default function WMCCWeekendSchool() {
  return (
    <SchoolDetails
      title="Weekend Islamic School"
      tagline={"Growing in Faith, Knowledge & Character"}
      introduction="A Saturday Islamic learning program for children from JK to Grade 8, helping students build strong foundations in Islamic knowledge, connect with their Deen, and develop good character."
      flyerUrl="https://gkpctbvyswcfccogoepl.supabase.co/storage/v1/object/public/event-posters/public/wmcc_weekend_school.png"
      formId="3"
      location="20 Innovation Drive, Hamilton, ON L9H 7P3"
      quickFacts={[
        "Saturdays · 10 AM–2 PM",
        "Ages 4–14",
        "$75/month for the first child",
      ]}
      learningSubtitle="Building strong Islamic foundations"
      learningTopics={[
        {
          title: "Qur’an & Surahs",
          description:
            "Build a meaningful connection with the Qur’an through age-appropriate learning, recitation, and memorization of selected surahs, while developing familiarity with the words of Allah and encouraging students to carry the Qur’an into their daily lives.",
        },
        {
          title: "Prophets & Messengers",
          description:
            "Discover the stories of Allah’s Prophets and Messengers, exploring their faith, perseverance, courage, and trust in Allah. Students learn lessons from their lives and reflect on how their examples can guide us through our own choices and challenges.",
        },
        {
          title: "Basic Islamic Knowledge",
          description:
            "Develop a strong foundation in the essential beliefs and practices of Islam. Students learn about their faith, worship, and responsibilities as Muslims, building the knowledge and understanding needed to practise their Deen with greater confidence and purpose.",
        },
        {
          title: "Du’as & Adab",
          description:
            "Learn essential daily du’as while developing the manners and etiquette taught by Islam. Students explore how to remember Allah throughout their day and practise kindness, respect, cleanliness, gratitude, and good conduct at home, school, the masjid, and beyond.",
        },
        {
          title: "Islamic Values",
          description:
            "Nurture Islamic character by exploring values such as honesty, kindness, patience, gratitude, respect, and responsibility. Students learn that good character is an essential part of faith and consider how Islamic values should shape their actions, relationships, and everyday decisions.",
        },
      ]}
      programInformation={[
        { label: "Day", value: "Saturdays" },
        { label: "Time", value: "10:00 AM–2:00 PM" },
        { label: "Ages", value: "4–14" },
        { label: "Grades", value: "JK–Grade 8" },
        {
          label: "Location",
          value: "20 Innovation Drive, Hamilton, ON L9H 7P3",
        },
        { label: "Fees", value: "$75/month for the first child" },
      ]}
      feeNote="+ 15% off each additional child!"
      datesHeading="Important School Dates"
      datesIntroduction="Classes run every Saturday from 10:00 AM–2:00 PM unless otherwise noted below."
      importantDates={[
        {
          date: "Saturday, September 12 2026",
          description: "First Day of School",
        },
        {
          date: "Saturday, December 19 2026",
          description: "Last Day of School; Winter Holidays until January 9",
          colour: "#b91c1c",
        },
        {
          date: "Saturday, January 9 2027",
          description: "First Day Back from Winter Holidays",
        },
        {
          date: "Saturday, March 13 2027",
          description: "No School; Eid Al-Fitr",
          colour: "#d97706",
        },
        {
          date: "Saturday, May 15 2027",
          description: "No School; Eid Al-Adha",
          colour: "#d97706",
        },
        {
          date: "Saturday, June 26 2027",
          description: "Last day of School; Summer Holidays",
          colour: "#b91c1c",
        },
      ]}
      registrationHeading="Register for Weekend School"
      registrationIntroduction="Complete the registration form below to register your child for WMCC Weekend Islamic School."
    />
  );
}

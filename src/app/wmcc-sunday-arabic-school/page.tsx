import type { Metadata } from "next";
import { SITE_ORIGIN } from "../../lib/site";
import SchoolDetails from "../../components/schoolDetails";

export const metadata: Metadata = {
  title: "Sunday Arabic School",
  description:
    "WMCC Sunday Arabic School, in collaboration with WLC, offers Arabic, Islamic Studies, and Quran for children ages 4\u201314 on Sundays from 10 AM\u20132 PM.",
  alternates: { canonical: `${SITE_ORIGIN}/wmcc-sunday-arabic-school` },
  openGraph: {
    type: "website",
    siteName: "WMCC",
    url: `${SITE_ORIGIN}/wmcc-sunday-arabic-school`,
    title: "Sunday Arabic School | WMCC",
    description:
      "WMCC Sunday Arabic School, in collaboration with WLC, offers Arabic, Islamic Studies, and Quran for children ages 4\u201314 on Sundays from 10 AM\u20132 PM.",
    images: [
      {
        url: "https://gkpctbvyswcfccogoepl.supabase.co/storage/v1/object/public/event-posters/public/wmcc_sunday_arabic_school.png",
        alt: "WMCC Sunday Arabic School flyer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunday Arabic School | WMCC",
    description:
      "WMCC Sunday Arabic School, in collaboration with WLC, offers Arabic, Islamic Studies, and Quran for children ages 4\u201314 on Sundays from 10 AM\u20132 PM.",
    images: [
      "https://gkpctbvyswcfccogoepl.supabase.co/storage/v1/object/public/event-posters/public/wmcc_sunday_arabic_school.png",
    ],
  },
};

export default function WMCCSundayArabicSchool() {
  return (
    <SchoolDetails
      title={"WMCC Sunday Arabic School"}
      tagline={"Building a Foundation in Arabic"}
      introduction="A Sunday program for children ages 4–14, learning Arabic, Islamic Studies, and Quran in collaboration with WLC."
      flyerUrl="https://gkpctbvyswcfccogoepl.supabase.co/storage/v1/object/public/event-posters/public/wmcc_sunday_arabic_school.png"
      formId="7"
      location="20 Innovation Drive, Hamilton, ON L9H 7P3"
      quickFacts={[
        "Sundays · 10 AM–2 PM",
        "Ages 4–14",
        "$80/month for the first child",
      ]}
      learningSubtitle="Arabic language, Islamic knowledge, and faith"
      learningTopics={[
        {
          title: "Arabic for All Levels",
          description:
            "Designed to support both introductory and advanced learners. The teacher assesses each student’s current ability and progress, allowing instruction to meet students at their level and help them continue developing their Arabic skills at an appropriate pace.",
        },
        {
          title: "Learn from a Native Arabic Speaker",
          description:
            "Learn Arabic with guidance from a native Arabic speaker, giving students meaningful exposure to the language and its natural use. Students benefit from knowledgeable instruction while developing greater familiarity, confidence, and connection with Arabic.",
        },
        {
          title: "Islamic Studies + Qur’an",
          description:
            "Complement Arabic learning with Islamic Studies and Qur’an, helping students strengthen both their language development and connection with their Deen. Students encounter Arabic not only as a language to learn, but as the language of the Qur’an and an important part of Islamic learning.",
        },
        {
          title: "Course Materials Included",
          description:
            "Students receive the course materials needed to support their learning throughout the program. Structured resources reinforce classroom instruction and give students material they can review as they continue developing their knowledge and skills.",
        },
      ]}
      programInformation={[
        { label: "Day", value: "Sundays" },
        { label: "Time", value: "10:00 AM–2:00 PM" },
        { label: "Ages", value: "4–14" },
        { label: "Grades", value: "JK–Grade 8" },
        {
          label: "Location",
          value: "20 Innovation Drive, Hamilton, ON L9H 7P3",
        },
        { label: "Fees", value: "$80/month for the first child" },
      ]}
      feeNote="50% off for current Weekend School students. + 15% off each additional child!"
      datesIntroduction="Classes run every Sunday from 10:00 AM–2:00 PM during the school year, except for the breaks and closures listed below."
      importantDates={[
        {
          date: "Sunday, September 27 2026",
          description: "First Day of School",
        },
        {
          date: "Sunday, December 20 2026",
          description: "Last Day of School; Winter Holidays until January 10",
          colour: "#b91c1c",
        },
        {
          date: "Sunday, January 10 2027",
          description: "First Day Back from Winter Holidays",
        },
        {
          date: "Sunday, March 14 2027",
          description: "No School; Eid Al-Fitr",
          colour: "#d97706",
        },
        {
          date: "Sunday, May 16 2027",
          description: "No School; Eid Al-Adha",
          colour: "#d97706",
        },
        {
          date: "Sunday, June 27 2027",
          description: "Last day of School; Summer Holidays",
          colour: "#b91c1c",
        },
      ]}
      registrationIntroduction="Complete the registration form below to register your child for WMCC Sunday Arabic School."
    />
  );
}

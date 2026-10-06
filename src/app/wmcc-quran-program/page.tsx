import type { Metadata } from "next";
import { SITE_ORIGIN } from "../../lib/site";
import SchoolDetails from "../../components/schoolDetails";

export const metadata: Metadata = {
  title: "Quran Program",
  description:
    "WMCC Quran Program focuses on Recitation, Tajweed, and Memorization for ages 4\u201318, Mondays and Thursdays from 6:00\u20137:30 PM. $50/month.",
  alternates: { canonical: `${SITE_ORIGIN}/wmcc-quran-program` },
  openGraph: {
    type: "website",
    siteName: "WMCC",
    url: `${SITE_ORIGIN}/wmcc-quran-program`,
    title: "Quran Program | WMCC",
    description:
      "WMCC Quran Program focuses on Recitation, Tajweed, and Memorization for ages 4\u201318, Mondays and Thursdays from 6:00\u20137:30 PM. $50/month.",
    images: [
      {
        url: "https://gkpctbvyswcfccogoepl.supabase.co/storage/v1/object/public/event-posters/public/wmcc_quran_program.png",
        alt: "WMCC Quran Program flyer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quran Program | WMCC",
    description:
      "WMCC Quran Program focuses on Recitation, Tajweed, and Memorization for ages 4\u201318, Mondays and Thursdays from 6:00\u20137:30 PM. $50/month.",
    images: [
      "https://gkpctbvyswcfccogoepl.supabase.co/storage/v1/object/public/event-posters/public/wmcc_quran_program.png",
    ],
  },
};

export default function WMCCQuranProgram() {
  return (
    <SchoolDetails
      title={"WMCC Quran Program"}
      tagline={"Learning and Connecting with the Quran"}
      introduction="A Quran program for students from JK to Grade 12, focusing on Recitation, Tajweed, and Memorization."
      flyerUrl="https://gkpctbvyswcfccogoepl.supabase.co/storage/v1/object/public/event-posters/public/wmcc_quran_program.png"
      formId="1"
      location="WMCC – 20 Innovation Dr, Hamilton, ON L9H 7P3"
      quickFacts={[
        "Mondays & Thursdays · 6:00–7:30 PM",
        "Ages 4–18",
        "$50/month",
      ]}
      learningSubtitle="Strengthening your connection with the Book of Allah"
      learningTopics={[
        {
          title: "Recitation",
          description:
            "Develop greater confidence and fluency in reciting the Qur’an through guided practice and consistent reading. Students work to strengthen their recitation while building familiarity with the words of Allah and a lasting connection with the Qur’an.",
        },
        {
          title: "Tajweed",
          description:
            "Learn and apply the rules of Tajweed to recite the Qur’an with greater accuracy and care. Students develop proper pronunciation and recitation habits, helping them honour the words of Allah by learning to recite them correctly.",
        },
        {
          title: "Memorization",
          description:
            "Strengthen Qur’an memorization through consistent learning, review, and guided progress. Students work at an appropriate pace to retain what they have learned, build upon their existing memorization, and develop a lasting relationship with the Qur’an.",
        },
      ]}
      programInformation={[
        { label: "Days", value: "Mondays and Thursdays" },
        { label: "Time", value: "6:00–7:30 PM" },
        { label: "Ages", value: "4–18" },
        { label: "Grades", value: "JK–Grade 12" },
        { label: "Location", value: "20 Innovation Dr, Hamilton, ON L9H 7P3" },
        { label: "Fees", value: "$50/month" },
      ]}
      feeNote="+ 15% off each additional sibling!"
      datesIntroduction="Classes run on Mondays and Thursdays from 6:00–7:30 PM during the program year, except for the breaks and closures listed below."
      importantDates={[
        {
          date: "Monday, September 14 2026",
          description: "First Day of Class",
        },
        {
          date: "Monday, October 12 2026",
          description: "No Classes; Thanksgiving holiday",
          colour: "#d97706",
        },
        {
          date: "Thursday, December 17 2026",
          description: "Last Day of Classes; Winter Holidays until January 11",
          colour: "#d97706",
        },
        {
          date: "Monday, January 11 2027",
          description: "First Day Back from Winter Holidays",
        },
        {
          date: "Monday, March 15 2027",
          description: "No School; Eid Al-Fitr",
          colour: "#d97706",
        },
        {
          date: "Thursday, March 18 2027",
          description: "No School; Eid Al-Fitr",
          colour: "#d97706",
        },
        {
          date: "Monday, May 17 2027",
          description: "No School; Eid Al-Adha",
          colour: "#d97706",
        },
        {
          date: "Thursday, May 20 2027",
          description: "No School; Eid Al-Adha",
          colour: "#d97706",
        },
        {
          date: "Monday, June 28 2027",
          description: "Last day of School; Summer Holidays",
          colour: "#b91c1c",
        },
      ]}
      registrationIntroduction="Complete the registration form below to register for the WMCC Quran Program."
    />
  );
}

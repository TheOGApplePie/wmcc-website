import Image from "next/image";
export default function About() {
  const boardOfDirectors = [
    { name: "Br Ahmed Jamil", title: "President" },
    { name: "Br Irshad Rashid", title: "Secretary" },
    { name: "Br Zeshan Arshad", title: "Treasurer" },
  ];
  return (
    <>
      <section>
        <div className="w-full p-4 sm:p-8 bg-gradient-to-r from-[#08101a] to-[#1e3a5f] text-center">
          <h1 className="text-white font-bold text-4xl sm:text-9xl p-4 sm:p-8">
            WMCC
          </h1>
        </div>
      </section>
      <section className="p-4">
        <p className="text-xl">
          Rooted in strong Islamic values, the Waterdown Muslim Community Centre
          is here to welcome and support families in Waterdown and the
          surrounding neighbourhoods. We strive to serve with compassion and
          inclusivity — offering charitable, educational, spiritual, and social
          programs for youth, seniors, women, and men. At WMCC, we live and
          teach Islam holistically — nurturing faith, building community,
          clearing misconceptions, and inspiring growth through learning and
          connection.
        </p>
      </section>
      <section className="py-4">
        <h2 className="p-4 text-4xl text-center">
          Meet our Board of Directors
        </h2>
        <div className="text-sm sm:text-lg p-4 grid sm:grid-cols-3">
          {boardOfDirectors.map((member) => {
            return (
              <div
                className="flex flex-col items-center text-center"
                key={member.name}
              >
                <Image
                  src="/avatar.png"
                  alt={member.name}
                  width={200}
                  height={200}
                />
                <p className="text-base sm:text-xl">{member.title}</p>
                <p className="text-lg sm:text-2xl">{member.name}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

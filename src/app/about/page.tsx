export default function About() {
  const team = [
    { title: "Events Coordinator", name: "Br Taanzeel ur Rehman" },
    { title: "Marketing Lead", name: "Br Danial Ali" },
    { title: "Brothers Program Lead", name: "Br Abdullahi Hussein" },
    { title: "Sisters Program Lead", name: "Sr Rabia Karim" },
    {
      title: "Family and Parenting Programs Coordinator",
      name: "Sr Shazia Bashir",
    },
    { title: "Brothers Outreach Lead", name: "Br Anwar Rehman" },
    { title: "Sisters Outreach Lead", name: "Sr Sumaira Waqar" },
    { title: "HR Lead", name: "Br Muhammad Mubashir Hasan" },
    { title: "IT Lead", name: "Br Shariq" },
    { title: "Executive Director", name: "Br Ahmed Ashraf" },
  ];
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
        <h2 className="p-4 text-4xl text-center">Who are the WMCC?</h2>
        <p className="text-xl">
          We are the WMCC! Rooted in strong Islamic values, the Waterdown Muslim
          Community Centre is here to welcome and support families in Waterdown
          and the surrounding neighbourhoods. We strive to serve with compassion
          and inclusivity — offering charitable, educational, spiritual, and
          social programs for youth, seniors, women, and men. At WMCC, we live
          and teach Islam holistically — nurturing faith, building community,
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
                <img src="avatar.png" alt={member.name} />
                <p className="text-base sm:text-xl">{member.title}</p>
                <p className="text-lg sm:text-2xl">{member.name}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="p-4 text-4xl text-center">
          Meet the team behind the WMCC
        </h2>
        <div className="text-sm sm:text-lg p-4 grid grid-cols-2 sm:grid-cols-4">
          {team.map((member) => {
            return (
              <div
                className="flex flex-col items-center text-center"
                key={member.name}
              >
                <img src="avatar.png" alt={member.name} />
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

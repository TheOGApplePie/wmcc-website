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
          We are the WMCC! We are your friendly neighbourhood muslim community.
          The Waterdown Muslim Community Centre is a community built on a strong
          islamic foundation with an aim to serve the Waterdown and surrounding
          neighbourhood families with a holistic collaborative, non-sectarian
          and maximum inclusion spirit.
        </p>
        <p className="text-xl">
          Our main focus is charitable, educational, welfare and spiritual
          support for youth, seniors, women and everyone in Waterdown Muslim
          community looking to empower the community through advancement of
          religion, social engagement, reduction of misconception and
          advancement of education at a professional level.
        </p>
      </section>
      <section>
        <h2 className="p-4 text-4xl text-center">
          Meet the team behind the WMCC
        </h2>
        <div className="text-sm sm:text-lg p-4 grid grid-cols-3 sm:grid-cols-4">
          {team.map((member, index) => {
            return (
              <div
                className="flex flex-col items-center text-center"
                key={index}
              >
                <img src="avatar.png" alt={member.name} />
                <p>{member.title}</p>
                <p>{member.name}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

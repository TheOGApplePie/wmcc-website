import CognitoForm from "./cognitoForm";
import EventLocation from "./eventLocation";
import EventPoster from "./eventPoster";

type SchoolDetailsProps = Readonly<{
  title: string;
  tagline: string;
  introduction: string;
  flyerUrl: string;
  formId: string;
  location?: string;
  quickFacts: readonly string[];
  learningSubtitle: string;
  learningTopics: readonly { title: string; description: string }[];
  programInformation: readonly { label: string; value: string }[];
  feeNote?: string;
  datesHeading?: string;
  datesIntroduction?: string;
  importantDates?: readonly {
    date: string;
    description: string;
    colour?: string;
  }[];
  registrationHeading?: string;
  registrationIntroduction: string;
}>;

const headingClass =
  "text-2xl sm:text-3xl font-semibold tracking-tight leading-snug";

export default function SchoolDetails({
  title,
  tagline,
  introduction,
  flyerUrl,
  formId,
  quickFacts,
  learningSubtitle,
  learningTopics,
  programInformation,
  feeNote,
  datesHeading = "Important Dates",
  datesIntroduction,
  importantDates = [],
  registrationHeading = `Register for ${title}`,
  registrationIntroduction,
}: SchoolDetailsProps) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 sm:py-12 space-y-16 sm:space-y-20">
      <section
        className="rounded-2xl bg-gradient-to-br from-dark-navy via-main-blue to-green-dark px-6 py-12 sm:px-12 sm:py-16 text-center text-white"
        aria-labelledby="program-title"
      >
        <h1
          id="program-title"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
        >
          {title}
        </h1>
        <p className="mt-6 text-2xl sm:text-3xl leading-snug font-medium">
          {tagline}
        </p>
        <p className="max-w-3xl mx-auto mt-5 text-lg sm:text-xl leading-relaxed">
          {introduction}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a className="btn-primary" href="#registration">
            {formId ? "Register Now" : "Registration Information"}
          </a>
          <a
            className="rounded-lg border border-white/60 px-6 py-3 font-semibold hover:bg-white/10 transition-colors"
            href="#program-details"
          >
            View Program Details <span aria-hidden="true">↓</span>
          </a>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-base sm:text-lg">
          {quickFacts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </section>

      <section
        id="program-details"
        className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start gap-8 md:gap-12"
        aria-labelledby="learning-heading"
      >
        <div className="md:col-start-2 md:row-start-1 py-4">
          <div className="text-center mb-8">
            <h2
              id="learning-heading"
              className={`${headingClass} text-main-blue`}
            >
              What Students Learn
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-text-muted">
              {learningSubtitle}
            </p>
          </div>
          <ul className="flex flex-wrap justify-center gap-6">
            {learningTopics.map((topic) => (
              <li
                key={topic.title}
                className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] rounded-xl border border-slate-200 border-t-4 border-t-green bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold leading-snug text-main-blue">
                  {topic.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-text-muted">
                  {topic.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-start-1 md:row-start-1 rounded-2xl bg-slate-50 p-4 sm:p-6">
          <h2 className={`${headingClass} mb-6 text-main-blue`}>
            Program Flyer
          </h2>
          {flyerUrl ? (
            <>
              <EventPoster
                src={flyerUrl}
                alt={`${title} flyer`}
                height={700}
                width={800}
                className="w-full max-h-[560px] rounded-xl object-contain object-top"
              />
            </>
          ) : (
            <div className="min-h-80 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center p-6 text-text-muted">
              Program flyer coming soon.
            </div>
          )}
        </div>
      </section>

      <section
        className="rounded-2xl bg-[#f4f8f7] p-6 sm:p-10"
        aria-labelledby="information-heading"
      >
        <h2
          id="information-heading"
          className={`${headingClass} text-center text-main-blue`}
        >
          Program Information
        </h2>
        <dl className="mt-8 grid sm:grid-cols-2 gap-x-12 gap-y-6">
          {programInformation.map((item) => (
            <div key={item.label}>
              <dt className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                {item.label}
              </dt>
              <dd className="mt-1 text-xl leading-relaxed text-main-blue">
                {item.value}{" "}
                {item.label === "Fees" && feeNote && (
                  <span className="mt-6 text-base leading-relaxed text-green font-medium">
                    {feeNote}
                  </span>
                )}
              </dd>
              {item.label === "Location" && (
                <EventLocation location={item.value} />
              )}
            </div>
          ))}
        </dl>
      </section>

      {importantDates.length > 0 && (
        <section aria-labelledby="dates-heading">
          <h2
            id="dates-heading"
            className={`${headingClass} text-center text-main-blue`}
          >
            {datesHeading}
          </h2>
          {datesIntroduction && (
            <p className="mt-3 text-center text-lg leading-relaxed text-text-muted">
              {datesIntroduction}
            </p>
          )}
          <ol className="max-w-3xl mx-auto mt-8 pl-3">
            {importantDates.map((item, index) => (
              <li
                key={`${item.date}-${item.description}`}
                className="relative pl-8 pb-8 last:pb-0"
              >
                {index < importantDates.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[10px] -bottom-[10px] w-0.5 opacity-40"
                    style={{
                      backgroundColor:
                        item.colour || "var(--secondary-colour-green)",
                    }}
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute -left-[5px] top-1 h-3 w-3 rounded-full ring-4 ring-white"
                  style={{
                    backgroundColor:
                      item.colour || "var(--secondary-colour-green)",
                  }}
                />
                <p
                  className="font-semibold leading-relaxed"
                  style={{
                    color: item.colour || "var(--secondary-colour-green)",
                  }}
                >
                  {item.date}
                </p>
                <p className="mt-1 leading-relaxed">{item.description}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section
        id="registration"
        className="border-t pt-12"
        aria-labelledby="sign-up-heading"
      >
        <h2
          id="sign-up-heading"
          className={`${headingClass} text-center text-main-blue`}
        >
          {registrationHeading}
        </h2>
        <p className="mt-3 mb-8 text-center text-lg leading-relaxed text-text-muted">
          {registrationIntroduction}
        </p>
        <div className="max-w-4xl mx-auto">
          {formId ? (
            <CognitoForm formId={formId} />
          ) : (
            <p className="rounded-xl bg-slate-50 p-8 text-center leading-relaxed text-text-muted">
              Registration form coming soon.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

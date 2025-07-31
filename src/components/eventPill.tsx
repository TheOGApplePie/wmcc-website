interface EventPillAttributes {
  upcomingEvent: {
    imgUrl: string;
    imgAlt: string;
    title: string;
    location: string;
    datetime: string;
  };
}
export default function EventPill({ upcomingEvent }: EventPillAttributes) {
  const eventDate = new Date(upcomingEvent.datetime);
  return (
    <div className="container border rounded p-3">
      <div className="row event-pill">
        <div className="col-6">
          <img
            className="img-fluid text-center"
            height={"150px"}
            src={upcomingEvent.imgUrl}
            alt={upcomingEvent.imgAlt}
          />
        </div>
        <div className="col-6">
          <p className="fs-5">{upcomingEvent.title}</p>
          <p className="fs-5">{upcomingEvent.location}</p>
          <p className="fs-5">
            {eventDate.getDate()}/{eventDate.getMonth()} at{" "}
            {eventDate.getHours()}:{eventDate.getMinutes()}
          </p>
        </div>
      </div>
    </div>
  );
}

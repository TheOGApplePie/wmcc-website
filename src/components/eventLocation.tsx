export default function EventLocation({
  location,
}: Readonly<{ location: string | null }>) {
  if (!location) return <p>Location to be announced</p>;
  const apiKey = process.env.MAPS_API;
  return (
    <div className="my-4">
      <p>{location}</p>
      {apiKey && (
        <iframe
          title={`Map of ${location}`}
          className="w-full h-48 mt-3"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location)}`}
        />
      )}
    </div>
  );
}

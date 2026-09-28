import Link from "next/link";

export default function EventNotFound() {
  return (
    <main className="p-12 text-center">
      <h1 className="text-3xl">We couldn’t find that event or session.</h1>
      <p className="my-4">It may no longer be available.</p>
      <Link href="/events" className="btn-primary">
        Browse events
      </Link>
    </main>
  );
}

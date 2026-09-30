type LoadingProps = Readonly<{
  inline?: boolean;
  label?: string;
}>;

export default function Loading({
  inline = false,
  label = "Loading…",
}: LoadingProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`bg-white text-black loader flex items-center justify-center ${
        inline
          ? "w-full min-h-48 py-12"
          : "absolute top-[120px] left-0 z-[5] w-full h-[calc(100dvh-120px)]"
      }`}
    >
      <span aria-hidden="true">W</span>
      <span aria-hidden="true">M</span>
      <span aria-hidden="true">C</span>
      <span aria-hidden="true">C</span>
    </div>
  );
}

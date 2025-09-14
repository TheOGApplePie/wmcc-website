import PaymentForm from "../../components/paymentForm";

export default function Donate() {
  return (
    <div>
      <div className="min-h-[calc(100dvh-115px)] bg-collage grid grid-cols-1 sm:grid-cols-2 mas">
        <div className="col-span-1 p-8 text-white">
          <h1 className="text-center text-4xl">Donate Now</h1>
          <p className="p-6 text-2xl">
            The WMCC needs your support in order to continue empowering our
            community to be united and boundless. Consider making a donation of
            however much you&apos;re comfortable with. We appreciate your
            contribution and may Allah bless your rizq.
          </p>
        </div>
        <div className="col-span-1 p-8 flex items-center justify-center">
          <div className="border border-slate-200 rounded-xl bg-white shadow-sm text-lg">
            <PaymentForm />
          </div>
        </div>
      </div>
    </div>
  );
}

import PaymentForm from "../../components/paymentForm";

export default function Donate() {
  return (
    <div>
      <div className="min-h-[calc(100dvh-115px)] bg-collage grid grid-cols-1 sm:grid-cols-2 mas">
        <div className="col-span-1 m-8 text-white">
          <h1 className="text-center text-4xl">Donate Now</h1>
          <p className="p-6 text-2xl">
            With your support, WMCC can continue empowering our community to
            stay strong, united, and rooted in faith. Every contribution — big
            or small — makes a difference. We truly appreciate your generosity,
            and may Allah bless you and increase you in rizq.
          </p>
        </div>
        <div className="col-span-1 m-8 flex items-center justify-center">
          <div className="border border-slate-200 rounded-xl bg-white shadow-sm text-lg overflow-y-hidden">
            <PaymentForm />
          </div>
        </div>
      </div>
    </div>
  );
}

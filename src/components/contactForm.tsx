"use client";

export default function ContactForm() {
  async function handleFormSubmit(formData: FormData): Promise<void> {
    const response = await fetch("/api/contact/submit-form", {
      method: "POST",
      body: formData,
    });

    alert(
      response.status === 200
        ? "Thank you! we have recieved your message and will be in touch as needed"
        : "Something went wrong, please try again later",
    );
  }
  return (
    <form className="p-4 mb-3 bg-light" action={handleFormSubmit}>
      <input
        className="w-full h-10 border border-zinc-500 rounded text-base p-2"
        required
        type="text"
        name="name"
        placeholder="Name"
      />
      <input
        className="w-6/12 h-10 border border-zinc-500 rounded my-5 text-base p-2"
        required
        type="email"
        name="email"
        placeholder="Email"
      />
      <input
        className="w-6/12 h-10 border border-zinc-500 rounded my-5 text-base p-2"
        type="tel"
        name="telephone"
        placeholder="Phone Number"
      />

      <textarea
        className="resize-none w-full border border-black rounded text-base p-2"
        required
        name="message"
        rows={4}
        placeholder="Enter your message"
      ></textarea>

      <div className="text-center mt-5">
        <button
          className="border-0 text-xl p-3 sm:rounded text-white bg-[var(--secondary-colour-green)]"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

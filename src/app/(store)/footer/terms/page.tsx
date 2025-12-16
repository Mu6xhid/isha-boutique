export const metadata = { title: 'Terms & Conditions' };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#6483ff] mb-6">Terms &amp; Conditions</h1>

      <section className="space-y-6 text-sm sm:text-base leading-7 text-gray-800">
        <h2 className="text-lg font-semibold text-[#6483ff]">Acceptance</h2>
        <p>By using ishaboutique.in, you agree to these terms and our policies.</p>

        <h2 className="text-lg font-semibold text-[#6483ff]">Pricing</h2>
        <p>Prices are listed in INR and may change without notice.</p>

        <h2 className="text-lg font-semibold text-[#6483ff]">Governing Law</h2>
        <p>All disputes are subject to the courts of Thrissur, Kerala.</p>
      </section>
    </main>
  );
}

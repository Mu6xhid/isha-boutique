export const metadata = { title: 'About Us' };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#6483ff] mb-6">About Isha Boutique</h1>

      <section className="space-y-6 text-sm sm:text-base leading-7 text-gray-800">
        <p>
          Founded in 2021, Isha Boutique curates contemporary ethnic wear for women who value craftsmanship and comfort.
          Each collection is designed in‑house and produced in small, responsible batches.
        </p>

        <h2 className="text-lg font-semibold text-[#6483ff]">Our Vision</h2>
        <p>To celebrate Indian textiles with modern silhouettes, making everyday elegance accessible.</p>

        <h2 className="text-lg font-semibold text-[#6483ff]">Sustainability</h2>
        <p>We source fabrics locally, minimise waste, and ensure fair wages across our supply chain.</p>
      </section>
    </main>
  );
}

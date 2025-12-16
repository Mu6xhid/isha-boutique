export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#6483ff] mb-6">Privacy Policy</h1>

      <section className="space-y-6 text-sm sm:text-base leading-7 text-gray-800">
        <p>Your privacy matters. We collect only the data needed to process orders and improve our services.</p>

        <h2 className="text-lg font-semibold text-[#6483ff]">Data We Collect</h2>
        <ul className="list-disc pl-6">
          <li>Contact details provided during checkout</li>
          <li>Order history and preferences</li>
          <li>Cookies for analytics and cart functionality</li>
        </ul>

        <h2 className="text-lg font-semibold text-[#6483ff]">Your Rights</h2>
        <p>You may view, update, or request deletion of your data at any time by contacting us.</p>
      </section>
    </main>
  );
}

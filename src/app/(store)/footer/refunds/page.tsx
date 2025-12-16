export const metadata = { title: 'Refund & Cancellation' };

export default function RefundsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#6483ff] mb-6">Refund &amp; Cancellation</h1>

      <section className="space-y-6 text-sm sm:text-base leading-7 text-gray-800">
        <h2 className="text-lg font-semibold text-[#6483ff]">Cancellations</h2>
        <p>You can cancel an order within 12 hours of purchase by emailing us.</p>

        <h2 className="text-lg font-semibold text-[#6483ff]">Returns</h2>
        <p>
          Return requests must be made within 7 days of delivery. Items must be unused and in original packaging.
          Customised or SALE items are non‑returnable unless defective.
        </p>

        <h2 className="text-lg font-semibold text-[#6483ff]">Refunds</h2>
        <p>
          After we receive and inspect your return, refunds are processed to your original payment method within
          5 business days.
        </p>
      </section>
    </main>
  );
}

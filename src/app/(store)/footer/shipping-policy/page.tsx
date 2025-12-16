// src/app/shipping-policy/page.tsx
export const metadata = { title: 'Shipping Policy' };

export default function ShippingPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#6483ff] mb-6">Shipping Policy</h1>

      <section className="space-y-6 text-sm sm:text-base leading-7 text-gray-800">
        <p>
          At Isha Boutique, we are committed to delivering your orders in a timely and secure manner. Please review our shipping policy below for detailed information on our delivery process.
        </p>

        <h2 className="text-lg font-semibold text-[#6483ff]">Shipping Charges</h2>
        <p>
          We offer free standard shipping on all prepaid orders above ₹999. A flat shipping charge of ₹50 applies to orders below this amount. Cash-on-delivery orders may incur an additional fee.
        </p>

        <h2 className="text-lg font-semibold text-[#6483ff]">Delivery Timeline</h2>
        <p>
          Orders are usually processed within 1-2 business days. Delivery time may vary depending on your location:
        </p>
        <ul className="list-disc pl-6">
          <li>Metro cities: 3–5 business days</li>
          <li>Other regions: 5–7 business days</li>
        </ul>

        <h2 className="text-lg font-semibold text-[#6483ff]">Order Tracking</h2>
        <p>
          Once your order is dispatched, you will receive an email/SMS with the tracking number and courier details. You can track your shipment using the provided link.
        </p>

        <h2 className="text-lg font-semibold text-[#6483ff]">Delivery Delays</h2>
        <p>
          While we strive for timely delivery, external factors such as weather, strikes, or courier delays may affect timelines. We appreciate your patience and understanding in such cases.
        </p>

        <h2 className="text-lg font-semibold text-[#6483ff]">International Shipping</h2>
        <p>
          Currently, we only ship within India. Stay tuned for updates on international delivery.
        </p>
      </section>
    </main>
  );
}

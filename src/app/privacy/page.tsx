import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Holidaze",
  description: "Privacy policy and data handling procedures for the Holidaze accommodation booking service."
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: May 10, 2025</p>
      </div>

      <div className="prose prose-pink max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">1. Introduction</h2>
          <p>
            Holidaze (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our website, mobile application, and related services (collectively, the &quot;Platform&quot;). By accessing or using Holidaze, you agree to the terms of this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">2. Information We Collect</h2>
          <p>We collect several types of information to provide and improve our services:</p>
          
          <h3 className="text-xl font-medium mt-5 mb-2">2.1. Information You Provide Directly</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, phone number, password, and profile details.</li>
            <li><strong>Venue Listings:</strong> Venue descriptions, images, location, pricing, and availability.</li>
            <li><strong>Booking Information:</strong> Event details, date, time, number of guests, and special requests.</li>
            <li><strong>Payment Information:</strong> Credit/debit card details, billing address, and other payment information (processed by third-party payment processors).</li>
            <li><strong>Communications:</strong> Messages, reviews, feedback, and correspondence with Holidaze or other users.</li>
          </ul>

          <h3 className="text-xl font-medium mt-5 mb-2">2.2. Information We Collect Automatically</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Usage Data:</strong> Pages viewed, features used, actions taken, and time spent on the Platform.</li>
            <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers, and mobile network information.</li>
            <li><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to collect information about your interactions with the Platform.</li>
          </ul>

          <h3 className="text-xl font-medium mt-5 mb-2">2.3. Information from Third Parties</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Social Media:</strong> If you link or log in via a third-party account (e.g., Google, Facebook), we may receive information as permitted by your privacy settings.</li>
            <li><strong>Service Providers:</strong> Information from payment processors, analytics providers, and other partners.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">3. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>To Provide and Operate the Platform:</strong> Facilitate bookings, process payments, and manage accounts.</li>
            <li><strong>To Communicate with You:</strong> Send confirmations, updates, support messages, and marketing communications (you may opt out at any time).</li>
            <li><strong>To Personalize Your Experience:</strong> Recommend venues, tailor content, and improve our services.</li>
            <li><strong>To Ensure Security and Prevent Fraud:</strong> Detect, investigate, and prevent unauthorized access or illegal activities.</li>
            <li><strong>To Comply with Legal Obligations:</strong> Meet regulatory requirements and respond to lawful requests.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">4. How We Share Your Information</h2>
          <p>We may share your information as follows:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>With Other Users:</strong> When you make a booking or list a venue, relevant information (e.g., name, contact details, event details) is shared with the other party.</li>
            <li><strong>With Service Providers:</strong> Third-party vendors who assist with payment processing, analytics, hosting, customer support, and other services.</li>
            <li><strong>With Affiliates and Partners:</strong> For business operations, marketing, and promotional purposes.</li>
            <li><strong>For Legal Reasons:</strong> To comply with applicable laws, regulations, legal processes, or government requests; to enforce our Terms of Service; or to protect the rights, property, or safety of Holidaze, our users, or others.</li>
            <li><strong>In Business Transfers:</strong> In connection with a merger, acquisition, sale of assets, or other business transaction.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">5. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Recognize you when you return to the Platform</li>
            <li>Remember your preferences and settings</li>
            <li>Analyze usage and performance</li>
            <li>Deliver targeted advertisements (where permitted by law)</li>
          </ul>
          <p className="mt-3">
            You can manage your cookie preferences through your browser or device settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">6. Data Security</h2>
          <p>
            We implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure; we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">7. Data Retention</h2>
          <p>
            We retain your personal information as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. We may anonymize or aggregate data for analytical purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">8. Your Rights and Choices</h2>
          <p>
            Depending on your location and applicable law, you may have the following rights:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Access:</strong> Request a copy of your personal information.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information, subject to certain exceptions.</li>
            <li><strong>Objection:</strong> Object to or restrict certain processing activities.</li>
            <li><strong>Opt-Out:</strong> Opt out of marketing communications by following the unsubscribe instructions or contacting us.</li>
            <li><strong>Data Portability:</strong> Request a copy of your data in a machine-readable format.</li>
          </ul>
          <p className="mt-3">
            To exercise your rights, please contact us at support@holidaze.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">9. Children&apos;s Privacy</h2>
          <p>
            Holidaze is not intended for children under 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can delete it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries outside your country of residence. We take steps to ensure your information is protected in accordance with this Privacy Policy and applicable law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">11. Third-Party Links</h2>
          <p>
            The Platform may contain links to third-party websites or services. We are not responsible for their privacy practices. Please review their privacy policies before providing any information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">12. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on the Platform or by email. Your continued use of Holidaze after changes indicates your acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">13. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
          </p>
          <p className="mt-3">
            <strong>Email:</strong> support@holidaze.com<br />
            <strong>Address:</strong> Holidaze Inc., Karl Johans gate 34, 0162 Oslo, Norway
          </p>
        </section>

        <div className="mt-12 p-6 bg-pink-50 rounded-lg border border-pink-100">
          <p className="text-center text-gray-700">
            By using the Holidaze service, you acknowledge that you have read and understood this Privacy Policy and how we process your personal data.
          </p>
          <div className="mt-4 text-center">
            <Link href="/" className="text-pink-600 hover:text-pink-700 font-medium">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
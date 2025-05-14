import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Holidaze",
  description: "Terms and conditions for using the Holidaze accommodation booking service."
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-600">Last updated: May 10, 2025</p>
      </div>

      <div className="prose prose-pink max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Holidaze website, mobile application, or any related services (collectively, the "Platform"), you ("User," "you," or "your") agree to be bound by these Terms of Service ("Terms"), our Privacy Policy, and all other policies referenced herein. If you do not agree to these Terms, you may not use the Platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">2. Description of Services</h2>
          <p>
            Holidaze provides an online marketplace where individuals and entities can list, discover, book, and review venues for events ("Services"). Holidaze acts solely as an intermediary to facilitate these transactions and is not a party to any agreement between Users and Venue Hosts.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">3. Eligibility</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must be at least 18 years old and able to enter into legally binding contracts to use Holidaze.</li>
            <li>By registering, you represent and warrant that you meet these requirements.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">4. Account Registration and Security</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must create an account to access certain features of the Platform.</li>
            <li>You agree to provide accurate, current, and complete information and to update it as necessary.</li>
            <li>You are responsible for safeguarding your account credentials and all activities under your account.</li>
            <li>You must promptly notify Holidaze of any unauthorized use or security breach.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">5. Venue Listings</h2>
          <h3 className="text-xl font-medium mt-5 mb-2">5.1. Creating Listings</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Venue Hosts may create listings for venues they have the legal right to offer.</li>
            <li>Listings must be accurate, complete, and not misleading. This includes pricing, availability, amenities, restrictions, and photographs.</li>
            <li>Hosts are responsible for keeping listings up to date.</li>
          </ul>

          <h3 className="text-xl font-medium mt-5 mb-2">5.2. Listing Content</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>You grant Holidaze a non-exclusive, worldwide, royalty-free license to use, display, and distribute your listing content for promotional and operational purposes.</li>
            <li>Holidaze reserves the right to remove or edit listings that violate these Terms or applicable law.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">6. Bookings</h2>
          <h3 className="text-xl font-medium mt-5 mb-2">6.1. Booking Process</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Users may request bookings for available venues by following the process on the Platform.</li>
            <li>Venue Hosts may accept or decline booking requests at their discretion.</li>
            <li>A booking is confirmed only when the User receives a confirmation notification from Holidaze.</li>
          </ul>

          <h3 className="text-xl font-medium mt-5 mb-2">6.2. User Responsibilities</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Users are responsible for reading the entire listing before making a booking.</li>
            <li>Users must comply with all venue rules, policies, and applicable laws during their booking.</li>
          </ul>

          <h3 className="text-xl font-medium mt-5 mb-2">6.3. Host Responsibilities</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Hosts must provide access to the venue as described in the listing.</li>
            <li>Hosts must ensure the venue is safe, clean, and in compliance with all applicable laws and regulations.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">7. Payments, Fees, and Taxes</h2>
          <h3 className="text-xl font-medium mt-5 mb-2">7.1. Payment Terms</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Users agree to pay all fees, charges, and taxes associated with their bookings.</li>
            <li>Holidaze collects payment at the time of booking and remits the appropriate amount to the Host, less applicable service fees.</li>
          </ul>

          <h3 className="text-xl font-medium mt-5 mb-2">7.2. Service Fees</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Holidaze charges service fees to Users and/or Hosts as disclosed during the booking process.</li>
            <li>Fees are non-refundable except as expressly stated in these Terms.</li>
          </ul>

          <h3 className="text-xl font-medium mt-5 mb-2">7.3. Taxes</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Hosts are responsible for determining, collecting, reporting, and remitting all applicable taxes.</li>
            <li>Holidaze may provide tools to assist with tax calculations but does not guarantee their accuracy.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">8. Cancellations and Refunds</h2>
          <h3 className="text-xl font-medium mt-5 mb-2">8.1. Cancellation Policies</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Each listing specifies a cancellation policy (Flexible, Moderate, Strict).</li>
            <li>Users and Hosts are bound by the policy in effect at the time of booking.</li>
          </ul>

          <h3 className="text-xl font-medium mt-5 mb-2">8.2. Refunds</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Refunds will be processed according to the applicable cancellation policy.</li>
            <li>Holidaze reserves the right to withhold service fees from refunds.</li>
          </ul>

          <h3 className="text-xl font-medium mt-5 mb-2">8.3. Host Cancellations</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>If a Host cancels a confirmed booking, Users will receive a full refund. Repeated Host cancellations may result in penalties or removal from the Platform.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">9. User Conduct</h2>
          <p>You agree to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Use the Platform for lawful purposes only.</li>
            <li>Not post, upload, or transmit any content that is false, misleading, defamatory, obscene, or infringes on the rights of others.</li>
            <li>Not use the Platform to harass, threaten, or discriminate against others.</li>
            <li>Not attempt to circumvent Holidaze's payment system or solicit off-platform transactions.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">10. Reviews and Feedback</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Users may leave reviews and ratings for venues and Hosts after bookings.</li>
            <li>Reviews must be honest, respectful, and not violate any laws or third-party rights.</li>
            <li>Holidaze may remove reviews that violate these Terms.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">11. Intellectual Property</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All content and materials on the Platform (excluding User-generated content) are owned by Holidaze or its licensors.</li>
            <li>You may not use, copy, or distribute any Platform content without prior written consent.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">12. Privacy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your use of the Platform is subject to our <Link href="/privacy" className="text-pink-600 hover:underline">Privacy Policy</Link>.</li>
            <li>By using Holidaze, you consent to the collection, use, and sharing of your information as described in the Privacy Policy.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">13. Disclaimers</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Holidaze provides the Platform and Services "as is" and "as available."</li>
            <li>Holidaze does not guarantee the accuracy, completeness, or reliability of any listings or content.</li>
            <li>Holidaze is not responsible for the conduct of Users or Hosts, or for any loss or damage arising from bookings or venue use.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">14. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Holidaze is not liable for any indirect, incidental, special, consequential, or punitive damages.</li>
            <li>Holidaze's total liability for any claim arising out of or relating to these Terms or the Platform will not exceed the greater of (a) the amount you paid Holidaze in the 12 months prior to the claim, or (b) $100 USD.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">15. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Holidaze, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, or expenses arising out of your use of the Platform, your violation of these Terms, or your violation of any rights of another.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">16. Termination</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Holidaze may suspend or terminate your account or access to the Platform at any time, with or without notice, for any reason.</li>
            <li>You may terminate your account at any time by following the instructions on the Platform.</li>
            <li>Upon termination, your right to use the Platform will immediately cease, but certain provisions (such as payment, liability, and indemnification) will survive.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">17. Modifications to the Terms</h2>
          <p>
            Holidaze reserves the right to change these Terms at any time. We will notify you of material changes by posting the updated Terms on the Platform or by email. Continued use of the Platform after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">18. Governing Law and Dispute Resolution</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>These Terms are governed by the laws of Norway, without regard to conflict of law principles.</li>
            <li>Any disputes arising from these Terms or your use of the Platform will be resolved exclusively in the courts located in Oslo, Norway.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">19. Miscellaneous</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>If any provision of these Terms is found invalid, the remaining provisions will remain in full force and effect.</li>
            <li>Holidaze's failure to enforce any right or provision does not constitute a waiver.</li>
            <li>These Terms constitute the entire agreement between you and Holidaze regarding the Platform.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">20. Contact Information</h2>
          <p>
            For questions or concerns about these Terms, please contact us at:
          </p>
          <p className="mt-3">
            <strong>Email:</strong> support@holidaze.com<br />
            <strong>Address:</strong> Holidaze Inc., Karl Johans gate 34, 0162 Oslo, Norway
          </p>
        </section>

        <div className="mt-12 p-6 bg-pink-50 rounded-lg border border-pink-100">
          <p className="text-center text-gray-700">
            By using the Holidaze service, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
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
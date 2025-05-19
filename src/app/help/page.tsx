import Link from "next/link";

export const metadata = {
  title: "Help Center | Holidaze",
  description: "Find answers to frequently asked questions and get support for using the Holidaze accommodation booking service."
};

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Help Center</h1>
        <p className="text-gray-600">Find answers to your questions about using Holidaze</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-pink-50 p-6 rounded-lg border border-pink-100">
          <h2 className="text-xl font-semibold text-pink-600 mb-4">For Guests</h2>
          <ul className="space-y-3">
            <li className="hover:text-pink-600">
              <Link href="#booking" className="block p-2 hover:bg-white rounded transition-colors">
                How to book a venue
              </Link>
            </li>
            <li className="hover:text-pink-600">
              <Link href="#payment" className="block p-2 hover:bg-white rounded transition-colors">
                Payment methods
              </Link>
            </li>
            <li className="hover:text-pink-600">
              <Link href="#cancellation" className="block p-2 hover:bg-white rounded transition-colors">
                Cancellation policies
              </Link>
            </li>
            <li className="hover:text-pink-600">
              <Link href="#account" className="block p-2 hover:bg-white rounded transition-colors">
                Managing your account
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">For Hosts</h2>
          <ul className="space-y-3">
            <li className="hover:text-blue-600">
              <Link href="#listing" className="block p-2 hover:bg-white rounded transition-colors">
                Creating a listing
              </Link>
            </li>
            <li className="hover:text-blue-600">
              <Link href="#pricing" className="block p-2 hover:bg-white rounded transition-colors">
                Setting prices and availability
              </Link>
            </li>
            <li className="hover:text-blue-600">
              <Link href="#managing-bookings" className="block p-2 hover:bg-white rounded transition-colors">
                Managing bookings
              </Link>
            </li>
            <li className="hover:text-blue-600">
              <Link href="#host-payments" className="block p-2 hover:bg-white rounded transition-colors">
                Receiving payments
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-12">
        <section id="booking">
          <h2 className="text-2xl font-semibold text-pink-600 mb-6 border-b border-pink-100 pb-2">How to Book a Venue</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">How do I search for venues?</h3>
              <p className="text-gray-700">
                You can search for venues by using the search bar at the top of the page. Enter your destination, dates, and number of guests. You can also use filters to narrow down your search by price, amenities, or other specific requirements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">How do I make a booking?</h3>
              <p className="text-gray-700">
                After finding a venue you like, check the availability for your desired dates. Click the &quot;Book Now&quot; button and follow the steps to complete your booking. You&apos;ll need to provide your payment details to confirm the reservation.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">Can I book on behalf of someone else?</h3>
              <p className="text-gray-700">
                Yes, you can book on behalf of someone else. However, please note that you will be responsible for the booking and will need to ensure that all guests follow the host&apos;s rules and Holidaze&apos;s Terms of Service.
              </p>
            </div>
          </div>
        </section>

        <section id="payment">
          <h2 className="text-2xl font-semibold text-pink-600 mb-6 border-b border-pink-100 pb-2">Payment Methods</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">What payment methods are accepted?</h3>
              <p className="text-gray-700">
                Holidaze accepts most major credit and debit cards, including Visa, Mastercard, and American Express. In some regions, we also support other payment methods such as PayPal.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">When will I be charged for my booking?</h3>
              <p className="text-gray-700">
                For most bookings, you will be charged the full amount at the time of booking. For some longer stays or bookings made far in advance, you may have the option to pay in installments, depending on the host&apos;s settings.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">Is my payment information secure?</h3>
              <p className="text-gray-700">
                Yes, all payment information is encrypted and processed securely through our payment providers. Holidaze does not store your full credit card details on our servers.
              </p>
            </div>
          </div>
        </section>

        <section id="cancellation">
          <h2 className="text-2xl font-semibold text-pink-600 mb-6 border-b border-pink-100 pb-2">Cancellation Policies</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">What are the cancellation policies?</h3>
              <p className="text-gray-700">
                Cancellation policies vary by host. Each venue listing displays the specific cancellation policy, which could be Flexible, Moderate, or Strict. Review this policy before booking to understand the refund terms.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">How do I cancel a booking?</h3>
              <p className="text-gray-700">
                To cancel a booking, go to your account, navigate to &quot;My Trips,&quot; select the booking you wish to cancel, and click &quot;Cancel Reservation.&quot; The refund amount will depend on the host&apos;s cancellation policy and how far in advance you cancel.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">What if I need to cancel due to an emergency?</h3>
              <p className="text-gray-700">
                If you need to cancel due to extenuating circumstances such as illness, natural disasters, or travel restrictions, contact our support team. In certain cases, we may be able to provide additional assistance beyond the standard cancellation policy.
              </p>
            </div>
          </div>
        </section>

        <section id="account">
          <h2 className="text-2xl font-semibold text-pink-600 mb-6 border-b border-pink-100 pb-2">Managing Your Account</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">How do I create a Holidaze account?</h3>
              <p className="text-gray-700">
                To create an account, click on &quot;Sign Up&quot; in the top right corner of the homepage. Enter your email address, create a password, and provide your name. You can also sign up using your Google or Facebook account for faster registration.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">How do I edit my profile information?</h3>
              <p className="text-gray-700">
                Log in to your account and navigate to the &quot;Profile&quot; section. Here you can update your personal information, change your profile picture, add a bio, and modify your notification preferences. Don&apos;t forget to click &quot;Save Changes&quot; after making any updates.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">I forgot my password. How do I reset it?</h3>
              <p className="text-gray-700">
                On the login page, click &quot;Forgot Password&quot; below the login form. Enter the email address associated with your account, and we&apos;ll send you a password reset link. Follow the instructions in the email to create a new password.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">How do I view my booking history?</h3>
              <p className="text-gray-700">
                After logging in, go to your Profile and select &quot;My Trips.&quot; This page displays all your current, upcoming, and past bookings. Click on any booking to view its details, including check-in instructions and host contact information.
              </p>
            </div>
          </div>
        </section>

        <section id="listing" className="pt-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6 border-b border-blue-100 pb-2">Creating a Listing</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">How do I list my property on Holidaze?</h3>
              <p className="text-gray-700">
                To become a host, register for an account and ensure the &quot;Venue Manager&quot; option is enabled in your profile. Then, navigate to your dashboard and click &quot;Create New Listing.&quot; Follow the steps to add details, photos, pricing, and availability for your venue.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">What information should I include in my listing?</h3>
              <p className="text-gray-700">
                Your listing should include detailed descriptions of your space, amenities, house rules, accurate location, high-quality photos, pricing, and availability. The more detailed and accurate your listing is, the more likely you are to attract suitable guests.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">Are there any requirements for hosting?</h3>
              <p className="text-gray-700">
                Your property should meet basic safety and cleanliness standards. You should also have the legal right to rent out your property. Some jurisdictions have specific regulations for short-term rentals, so check your local laws before listing.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6 border-b border-blue-100 pb-2">Setting Prices and Availability</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">How do I set the price for my venue?</h3>
              <p className="text-gray-700">
                When creating or editing your listing, you can set a base price for your venue. Consider factors like location, amenities, size, and local market rates. You can also use our Smart Pricing tool, which suggests optimal rates based on demand, seasonality, and local events.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">Can I set different prices for different dates?</h3>
              <p className="text-gray-700">
                Yes, you can set custom pricing for weekends, holidays, or specific seasons. In your listing dashboard, go to &quot;Calendar &amp; Pricing&quot; and select the dates you want to customize. This allows you to charge premium rates during high-demand periods or offer discounts during slower times.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">How do I manage venue availability?</h3>
              <p className="text-gray-700">
                Use the calendar in your host dashboard to mark dates as available or unavailable. You can block off dates when you need the space for personal use, maintenance, or when you&apos;re unavailable to host. Regular updates to your calendar prevent double-bookings and disappointment.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">Should I offer discounts for longer stays?</h3>
              <p className="text-gray-700">
                Many hosts offer weekly or monthly discounts to encourage longer bookings, which can reduce turnover and cleaning costs. You can set automatic percentage discounts for stays of 7+ nights or 28+ nights in your pricing settings. Consider offering 5-10% for weekly stays and 15-25% for monthly stays.
              </p>
            </div>
          </div>
        </section>

        <section id="managing-bookings">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6 border-b border-blue-100 pb-2">Managing Bookings</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">How do I accept or decline booking requests?</h3>
              <p className="text-gray-700">
                When you receive a booking request, you&apos;ll get an email notification and an alert in your host dashboard. Review the request details, check the guest&apos;s profile and reviews, and then click &quot;Accept&quot; or &quot;Decline&quot; within 24 hours. For instant bookings, reservations are automatically accepted if your calendar shows availability.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">How do I communicate with guests?</h3>
              <p className="text-gray-700">
                Use the Holidaze messaging system to communicate with guests before, during, and after their stay. This keeps all communication in one place and protects your privacy. You can send check-in instructions, answer questions, and provide local recommendations through this secure channel.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">What if I need to cancel a booking?</h3>
              <p className="text-gray-700">
                Host cancellations should be avoided whenever possible as they disrupt guests&apos; travel plans and may affect your listing&apos;s ranking. However, if you must cancel, go to the booking in your dashboard and select &quot;Cancel reservation.&quot; Provide a reason for the cancellation. Note that cancellations may incur penalties and affect your host status.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">How do I handle guest check-in and check-out?</h3>
              <p className="text-gray-700">
                Create a clear check-in process and share it with guests before their arrival. This may include key pickup information, entry codes, or in-person meeting arrangements. For check-out, provide simple instructions about cleaning expectations, key return, and checkout time. A digital guidebook can help streamline this process.
              </p>
            </div>
          </div>
        </section>

        <section id="host-payments">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6 border-b border-blue-100 pb-2">Receiving Payments</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">When and how do I get paid?</h3>
              <p className="text-gray-700">
                Holidaze releases payment to hosts 24 hours after guest check-in. This waiting period ensures that guests have arrived and found the accommodations as described. The funds are then transferred to your selected payout method, typically arriving within 1-3 business days, depending on your bank.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">What payout methods are available?</h3>
              <p className="text-gray-700">
                Holidaze supports several payout methods, including direct deposit to your bank account, PayPal, and in some regions, Payoneer. To set up or change your payout method, go to the &quot;Account&quot; section in your host dashboard and select &quot;Payout preferences.&quot; Different methods may have different processing times.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">Are there any fees deducted from my payments?</h3>
              <p className="text-gray-700">
                Holidaze charges hosts a service fee of 3-5% of the booking subtotal. This fee covers the cost of processing payments, platform maintenance, and customer support. The exact percentage depends on your cancellation policy—stricter policies generally have lower host fees. This fee is automatically deducted before payment is sent to you.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">How do I handle security deposits?</h3>
              <p className="text-gray-700">
                You can set a security deposit amount in your listing settings. This amount is not charged to guests upon booking but serves as a preset limit that can be claimed against if damage occurs. If you need to claim part of the security deposit, you must submit the request with evidence within 14 days of checkout.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-2">What about taxes on my hosting income?</h3>
              <p className="text-gray-700">
                As a host, you&apos;re responsible for reporting income earned from Holidaze to the relevant tax authorities. In some jurisdictions, we may be required to collect and remit certain taxes on your behalf or provide income information to tax authorities. Consult with a tax professional for advice specific to your situation.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Contact Support Section */}
      <div className="mt-16 p-8 bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg border border-pink-100">
        <h2 className="text-2xl font-semibold text-center mb-6">Can&apos;t find what you&apos;re looking for?</h2>
        <p className="text-center text-gray-700 mb-6">
          Our support team is here to help with any questions or issues you may have.
        </p>
        <div className="flex justify-center">
          <Link href="mailto:support@holidaze.com" className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
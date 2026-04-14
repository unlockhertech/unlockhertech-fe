import { useMetaData } from "../hooks/useMetaData";
import { BERRY } from "../data";

export function CookiePolicyContent() {
  return (
    <div className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What are cookies?</h2>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
        They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How we use cookies</h2>
      <p className="text-gray-600 mb-4 leading-relaxed">
        We use cookies for the following purposes:
      </p>
      <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
        <li>
          <strong>Essential Cookies:</strong> These are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
        </li>
        <li>
          <strong>Analytics Cookies:</strong> We use Google Analytics to understand how visitors interact with our website. This helps us improve our content and user experience. These cookies collect information in an anonymous form.
        </li>
        <li>
          <strong>Functional Cookies:</strong> These allow the website to remember choices you make (such as your cookie consent preferences) to provide a more personalized experience.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Specific cookies we use</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-gray-50 text-left font-semibold text-gray-900 border-b">Cookie Name</th>
              <th className="px-4 py-3 bg-gray-50 text-left font-semibold text-gray-900 border-b">Provider</th>
              <th className="px-4 py-3 bg-gray-50 text-left font-semibold text-gray-900 border-b">Purpose</th>
              <th className="px-4 py-3 bg-gray-50 text-left font-semibold text-gray-900 border-b">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 font-mono">cookie-consent</td>
              <td className="px-4 py-3">Unlock Her Tech</td>
              <td className="px-4 py-3">Stores your cookie consent preferences.</td>
              <td className="px-4 py-3">Persistent</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono">_ga, _ga_*</td>
              <td className="px-4 py-3">Google Analytics</td>
              <td className="px-4 py-3">Distinguishes users and tracks site usage.</td>
              <td className="px-4 py-3">Up to 2 years</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Your choices</h2>
      <p className="text-gray-600 mb-4 leading-relaxed">
        You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.
      </p>
      <p className="text-gray-600 mb-8 leading-relaxed">
        If you decline analytics cookies, your visit will not be tracked by Google Analytics, but the website will still function for essential purposes.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">5. More information</h2>
      <p className="text-gray-600 leading-relaxed">
        For more information about how we handle your privacy, please contact us. 
        European residents have certain rights under the General Data Protection Regulation (GDPR) regarding their personal data, including the right to withdraw consent at any time.
      </p>
    </div>
  );
}

export function CookiePolicy() {
  useMetaData("Cookie Policy - Unlock Her Tech", "Information about how we use cookies and your privacy on our website.");

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-16 md:py-24" style={{ backgroundColor: `${BERRY}10` }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Cookie Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: April 14, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CookiePolicyContent />
        </div>
      </section>
    </div>
  );
}

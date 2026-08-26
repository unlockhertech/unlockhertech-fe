
export interface CookieInfo {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
}

const COOKIE_LIST: CookieInfo[] = [
  {
    name: "cookie-consent",
    provider: "Unlock Her Tech",
    purpose: "Stores your cookie consent preferences.",
    duration: "Persistent",
  },
  {
    name: "_ga, _ga_*",
    provider: "Google Analytics",
    purpose: "Distinguishes users and tracks site usage.",
    duration: "Up to 2 years",
  },
];

export function CookieTable() {
  return (
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
          {COOKIE_LIST.map((cookie) => (
            <tr key={cookie.name}>
              <td className="px-4 py-3 font-mono">{cookie.name}</td>
              <td className="px-4 py-3">{cookie.provider}</td>
              <td className="px-4 py-3">{cookie.purpose}</td>
              <td className="px-4 py-3">{cookie.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <Navbar />

      <div className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">We’d love to hear from you!</h2>
              <p className="text-gray-700 leading-relaxed">
                Have questions, suggestions, or feedback about File2PDF? Our team is here to help. 
                Please reach out using the contact details below or fill out the form, and we’ll get 
                back to you as soon as possible.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:support@file2pdf.com" className="text-blue-600 hover:underline">
                    support@file2pdf.com
                  </a>
                </li>
                <li>
                  <strong>Mobile/Whatsapp:</strong>{' '}
                  <a href="+923126691430" className="text-blue-600 hover:underline">
                    +92 312 6691430
                  </a>
                </li>
                <li>
                  <strong>Privacy Inquiries:</strong>{' '}
                  <a href="mailto:privacy@file2pdf.com" className="text-blue-600 hover:underline">
                    privacy@file2pdf.com
                  </a>
                </li>
                <li>
                  <strong>Response Time:</strong> Typically within 24–48 hours
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

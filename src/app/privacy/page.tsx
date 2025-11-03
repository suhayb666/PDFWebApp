import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <p className="text-gray-600 text-sm">
              Last updated: November 3, 2025
            </p>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Data Collection</h2>
              <p className="text-gray-700 leading-relaxed">
                We collect minimal information necessary to provide our service. This includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
                <li>Original filenames of uploaded files</li>
                <li>File types and sizes</li>
                <li>Conversion timestamps</li>
                <li>Email addresses (only if you choose to receive download links)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                We do <strong>not</strong> store the actual contents of your files permanently.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">File Storage & Deletion</h2>
              <p className="text-gray-700 leading-relaxed">
                All uploaded files and converted PDFs are automatically deleted from our servers 
                after <strong>1 hour</strong>. This ensures your data remains private and our 
                servers remain efficient.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Data Sharing</h2>
              <p className="text-gray-700 leading-relaxed">
                We do <strong>not</strong> share, sell, rent, or distribute your files or personal 
                data to any third parties under any circumstances. Your data is yours alone.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not use cookies to track your activity. Our service operates without the 
                need for persistent user tracking.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We use industry-standard security measures to protect your data during upload, 
                conversion, and temporary storage. All connections to our servers are encrypted 
                using HTTPS.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@file2pdf.com" className="text-blue-600 hover:underline">
                  privacy@file2pdf.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
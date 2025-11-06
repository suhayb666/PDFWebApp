import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <Navbar />

      <div className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <ul className="list-disc list-inside text-gray-700 space-y-4 ml-4">
              <li>
                <strong>Acceptance of Terms:</strong> By using File2PDF, you agree to these Terms of Service.
                If you do not agree, please discontinue using the service.
              </li>

              <li>
                <strong>Use of Service:</strong> File2PDF provides free online file-to-PDF conversion tools.
                You must use the service only for lawful purposes. Do not upload harmful, illegal, or
                copyrighted content without permission. Misuse may result in suspension or termination
                of access.
              </li>

              <li>
                <strong>File Handling and Deletion:</strong> Uploaded files and converted PDFs are
                automatically deleted after 1 hour. We do not store, access, or share the contents of your
                files permanently.
              </li>

              <li>
                <strong>Privacy:</strong> We collect minimal data necessary to operate the service.
                For more details, see our Privacy Policy.
              </li>

              <li>
                <strong>No Warranty:</strong> The service is provided “as is” and “as available.” We do not
                guarantee uninterrupted operation or compatibility with all formats. You use the service
                at your own risk.
              </li>

              <li>
                <strong>Limitation of Liability:</strong> File2PDF and its affiliates are not liable for any
                direct or indirect damages resulting from the use or inability to use the service.
              </li>

              <li>
                <strong>Modifications:</strong> We may update or discontinue the service at any time without
                prior notice. Continued use after updates means you accept the revised Terms.
              </li>

              <li>
                <strong>Governing Law:</strong> These Terms are governed by applicable international and
                local laws.
              </li>

              <li>
                <strong>Contact:</strong> For any questions or concerns, contact
                <a href="mailto:support@file2pdf.com" className="text-blue-600 hover:underline ml-1">
                  support@file2pdf.com
                </a>.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

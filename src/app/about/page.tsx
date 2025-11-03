import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About File2PDF</h1>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">What is File2PDF?</h2>
              <p className="text-gray-700 leading-relaxed">
                File2PDF is a free, secure, and fast online tool for converting your files to PDF format.
                Our mission is to make file conversion simple, quick, and accessible to everyone.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Supported Formats</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We support a wide range of file formats:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Images: PNG, JPEG, JPG</li>
                <li>Documents: Word (.doc, .docx)</li>
                <li>Spreadsheets: Excel (.xls, .xlsx)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Privacy & Security</h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is our top priority. All uploaded files are automatically deleted from our 
                servers after 1 hour. We never store your files permanently or share them with third parties.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Features</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Convert up to 10 files at once</li>
                <li>Merge multiple files into a single PDF</li>
                <li>Fast and reliable conversion</li>
                <li>No registration required</li>
                <li>100% free to use</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
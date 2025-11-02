export default function AboutPage() {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">About File2PDF</h1>
          <p className="text-gray-700 mb-4">
            File2PDF is a free, secure, and fast online tool for converting your files to PDF format.
          </p>
          <p className="text-gray-700 mb-4">
            We support PNG, JPEG, Word (.doc, .docx), and Excel (.xls, .xlsx) files.
          </p>
          <p className="text-gray-700">
            All files are automatically deleted after 1 hour for your privacy.
          </p>
        </div>
      </div>
    );
  }
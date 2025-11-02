export default function PrivacyPage() {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <h2 className="text-2xl font-semibold mb-3">Data Collection</h2>
          <p className="text-gray-700 mb-4">
            We only collect filenames and conversion timestamps. We do not store file contents permanently.
          </p>
          <h2 className="text-2xl font-semibold mb-3">File Storage</h2>
          <p className="text-gray-700 mb-4">
            All uploaded files are automatically deleted from our servers after 1 hour.
          </p>
          <h2 className="text-2xl font-semibold mb-3">Data Sharing</h2>
          <p className="text-gray-700">
            We do not share, sell, or distribute your files or data to third parties.
          </p>
        </div>
      </div>
    );
  }
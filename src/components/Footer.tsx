import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-400">
          © 2025 File2PDF. All rights reserved.
        </p>
        <div className="mt-4 space-x-6">
          <Link href="/privacy" className="text-gray-400 hover:text-white transition text-sm">
            Privacy Policy
          </Link>
          <a href="#" className="text-gray-400 hover:text-white transition text-sm">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
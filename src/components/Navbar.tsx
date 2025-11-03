'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">File2PDF</span>
          </Link>
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition">
              About
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
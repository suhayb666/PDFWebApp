// src/app/page.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, Download, X, Check, AlertCircle, Loader2, Mail } from 'lucide-react';

// Type definitions
interface FileWithMetadata {
  id: number;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'converting' | 'converted' | 'failed';
}

interface ConvertedFile {
  id: number;
  originalName: string;
  pdfName: string;
  size: number;
}

const File2PDF = () => {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState<ConvertedFile[]>([]);
  const [mergeFiles, setMergeFiles] = useState(false);
  const [email, setEmail] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const acceptedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file: File) => {
      const isValidType = acceptedTypes.includes(file.type);
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
      return isValidType && isValidSize;
    });

    if (validFiles.length + files.length > 10) {
      alert('Maximum 10 files allowed');
      return;
    }

    const filesWithId: FileWithMetadata[] = validFiles.map((file: File, idx: number) => ({
      id: Date.now() + idx,
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending' as const
    }));

    setFiles(prev => [...prev, ...filesWithId]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const removeFile = (id: number) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string): string => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('word')) return '📄';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    return '📁';
  };

  const convertFiles = async () => {
    if (files.length === 0) return;

    setConverting(true);
    
    const convertedFiles: ConvertedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Update status to converting
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'converting' as const } : f
      ));

      // Simulate conversion delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mark as converted
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'converted' as const } : f
      ));

      convertedFiles.push({
        id: file.id,
        originalName: file.name,
        pdfName: file.name.replace(/\.[^/.]+$/, '') + '.pdf',
        size: Math.round(file.size * 0.8) // Simulated PDF size
      });
    }

    setConverted(convertedFiles);
    setConverting(false);
  };

  const downloadFile = (fileName: string) => {
    // In production, this would download the actual converted PDF
    alert(`Downloading ${fileName}...`);
  };

  const downloadAll = () => {
    alert('Downloading all files as ZIP...');
  };

  const sendEmail = () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }
    alert(`PDF links will be sent to ${email}`);
  };

  const reset = () => {
    setFiles([]);
    setConverted([]);
    setEmail('');
    setMergeFiles(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">File2PDF</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">Privacy</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        {files.length === 0 && converted.length === 0 && (
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Convert Files to PDF
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Fast, secure, and free PDF conversion
            </p>
            <p className="text-sm text-gray-500">
              Supports PNG, JPEG, Word, and Excel files
            </p>
          </div>
        )}

        {/* Upload Area */}
        {converted.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div
              className={`border-3 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop files here or click to upload
              </h3>
              <p className="text-gray-500 mb-4">
                PNG, JPEG, Word (.doc, .docx), Excel (.xls, .xlsx)
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Max 10 files, 50MB each
              </p>
              <input
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
              >
                Select Files
              </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Files ({files.length}/10)
                  </h3>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mergeFiles}
                      onChange={(e) => setMergeFiles(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Merge into one PDF</span>
                  </label>
                </div>

                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-2xl">{getFileIcon(file.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {file.status === 'converting' && (
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        )}
                        {file.status === 'converted' && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                        {file.status === 'pending' && (
                          <button
                            onClick={() => removeFile(file.id)}
                            className="text-gray-400 hover:text-red-600 transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={convertFiles}
                  disabled={converting}
                  className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {converting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Converting...</span>
                    </>
                  ) : (
                    <span>Convert to PDF</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Converted Files */}
        {converted.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Conversion Complete!
              </h2>
              <p className="text-gray-600">
                Your files have been successfully converted to PDF
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {converted.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.pdfName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadFile(file.pdfName)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Download</span>
                  </button>
                </div>
              ))}
            </div>

            {converted.length > 1 && (
              <button
                onClick={downloadAll}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition mb-4"
              >
                Download All as ZIP
              </button>
            )}

            {/* Email Option */}
            <div className="border-t pt-6 mt-6">
              <p className="text-sm text-gray-600 mb-3">
                Send download links to your email:
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendEmail}
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full mt-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Convert More Files
            </button>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                Files will be automatically deleted from our servers after 1 hour for your privacy.
              </p>
            </div>
          </div>
        )}

        {/* Features */}
        {files.length === 0 && converted.length === 0 && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
              <p className="text-sm text-gray-600">
                Convert images, Word, and Excel files to PDF
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast & Secure</h3>
              <p className="text-sm text-gray-600">
                Quick conversion with automatic file deletion
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Download</h3>
              <p className="text-sm text-gray-600">
                Download individually or as a ZIP file
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 File2PDF. All rights reserved.
          </p>
          <div className="mt-4 space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default File2PDF;
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { readFile } from 'fs/promises';
import path from 'path';

interface UrlData {
  id: string;
  shortUrl: string;
  originalUrl: string;
  title: string;
  description?: string;
  subscriberId: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  tags?: string[];
}

export default function RedirectPage({ params }: { params: { slug: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    handleRedirect();
  }, [params.slug]);

  const handleRedirect = async () => {
    try {
      setLoading(true);
      
      // Find the URL in the database
      const response = await fetch(`/api/urls/redirect/${params.slug}`);
      const data = await response.json();

      if (response.ok && data.url) {
        // Increment click count
        await fetch(`/api/urls/click/${data.url.id}`, {
          method: 'POST',
        });

        // Redirect to the original URL
        window.location.href = data.url.originalUrl;
      } else {
        setError(data.error || 'URL not found');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to redirect');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting...</h2>
          <p className="text-gray-600">Please wait while we redirect you to your destination.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">URL Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return null;
}

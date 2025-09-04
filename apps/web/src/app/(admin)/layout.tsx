'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            <div className="flex items-center h-16 px-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Company Admin</h1>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              <a
                href="/admin/overview"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === '/admin/overview'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Overview
              </a>
              <a
                href="/admin/subscribers"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === '/admin/subscribers'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Subscribers
              </a>
              <a
                href="/admin/analytics"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === '/admin/analytics'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Analytics
              </a>
              <a
                href="/admin/billing"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === '/admin/billing'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Billing
              </a>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex-1">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <div className="text-sm text-gray-500">Admin User</div>
              </div>
            </div>
          </div>
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
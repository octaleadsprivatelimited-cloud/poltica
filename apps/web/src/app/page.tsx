import { Button } from '@sarpanch-campaign/ui'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sarpanch Campaign
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Campaign-ops + public outreach platform for local-body election candidate
        </p>
        <div className="space-y-4">
          <Link href="/login">
            <Button className="w-full">
              Get Started
            </Button>
          </Link>
          <Link href="/admin-login">
            <Button variant="outline" className="w-full">
              Company Admin
            </Button>
          </Link>
          <p className="text-sm text-gray-500">
            Manage your campaign team and reach 7,000+ villagers
          </p>
        </div>
      </div>
    </div>
  )
}

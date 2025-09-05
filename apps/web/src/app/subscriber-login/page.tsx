'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@sarpanch-campaign/ui';
import { useRouter } from 'next/navigation';
import { Phone, User, MapPin } from 'lucide-react';

export default function SubscriberLoginPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Clean phone number (remove spaces, +, etc.)
      const cleanPhone = phone.replace(/\D/g, '');
      
      if (cleanPhone.length < 10) {
        setError('Please enter a valid 10-digit mobile number');
        setLoading(false);
        return;
      }

      // Find subscriber by phone number
      const response = await fetch('/api/subscriber/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await response.json();

      if (response.ok && data.subscriber) {
        // Store subscriber data in sessionStorage
        sessionStorage.setItem('subscriber', JSON.stringify(data.subscriber));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Subscriber not found. Please check your mobile number.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sarpanch Dashboard</h1>
          <p className="text-gray-600">Access your personal campaign dashboard</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Phone className="h-6 w-6" />
              Subscriber Login
            </CardTitle>
            <CardDescription className="text-green-100">
              Enter your registered mobile number to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-lg font-medium">
                  Mobile Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="Enter your 10-digit mobile number"
                    className="pl-10 text-lg py-3"
                    maxLength={10}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Enter the mobile number you used to register
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-lg py-3" 
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Access Dashboard'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Demo Access</h3>
                <p className="text-sm text-blue-600 mb-2">Try these mobile numbers:</p>
                <div className="space-y-1 text-sm">
                  <p className="font-mono">9000045454 (bheemesh)</p>
                  <p className="font-mono">9876543210 (Rajesh Kumar)</p>
                  <p className="font-mono">900000009 (sri)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            Sarpanch Campaign Platform
          </p>
        </div>
      </div>
    </div>
  );
}

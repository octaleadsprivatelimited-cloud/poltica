'use client';

import { useEffect } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sarpanch-campaign/ui';
import { trackLandingView, trackCTASubmit } from '@sarpanch-campaign/lib';

export default function LandingPage() {
  useEffect(() => {
    // Track landing page view
    const urlParams = new URLSearchParams(window.location.search);
    const rid = urlParams.get('rid');
    const campaignId = urlParams.get('campaign_id');
    const utm = {
      source: urlParams.get('utm_source') || undefined,
      medium: urlParams.get('utm_medium') || undefined,
      campaign: urlParams.get('utm_campaign') || undefined,
    };

    if (rid && campaignId) {
      trackLandingView(rid, campaignId, utm);
    }
  }, []);

  const handleCTAClick = (ctaType: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const rid = urlParams.get('rid');
    const campaignId = urlParams.get('campaign_id');
    const utm = {
      source: urlParams.get('utm_source') || undefined,
      medium: urlParams.get('utm_medium') || undefined,
      campaign: urlParams.get('utm_campaign') || undefined,
    };

    if (rid && campaignId) {
      trackCTASubmit(rid, campaignId, ctaType, utm);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Namaste! 🙏
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            I am your local candidate, committed to serving our village with dedication and integrity.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>My Vision</CardTitle>
                <CardDescription>
                  Building a prosperous and united village
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2">
                  <li>• Better roads and infrastructure</li>
                  <li>• Improved healthcare facilities</li>
                  <li>• Quality education for our children</li>
                  <li>• Support for farmers and small businesses</li>
                  <li>• Transparent governance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Promise</CardTitle>
                <CardDescription>
                  Your voice will be heard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2">
                  <li>• Regular village meetings</li>
                  <li>• Open door policy for all residents</li>
                  <li>• Transparent use of funds</li>
                  <li>• Quick response to your concerns</li>
                  <li>• Community development projects</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Let's work together for our village's future!
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => handleCTAClick('support')}
                className="bg-green-600 hover:bg-green-700"
              >
                I Support You
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => handleCTAClick('meeting')}
              >
                Schedule a Meeting
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => handleCTAClick('volunteer')}
              >
                Join as Volunteer
              </Button>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Contact Information
            </h3>
            <p className="text-gray-600">
              Phone: +91 98765 43210 | Email: candidate@village.com
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Available 24/7 for your concerns and suggestions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

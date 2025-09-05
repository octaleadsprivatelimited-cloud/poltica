'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@sarpanch-campaign/ui';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  MessageSquare, 
  Phone, 
  MousePointer, 
  TrendingUp, 
  Calendar,
  MapPin,
  User,
  LogOut,
  Activity,
  Upload,
  FileSpreadsheet,
  Link,
  FileText
} from 'lucide-react';

interface SubscriberData {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  location: string;
  village: string;
  district: string;
  state: string;
  campaignFocus: string;
  interests: string[];
  bio: string;
  plan: string;
  status: string;
  joinDate: string;
  lastActive: string;
  totalMessages: number;
  whatsappMessages: number;
  smsMessages: number;
  ivrCalls: number;
  linkClicks: number;
  engagementRate: number;
  totalCampaigns: number;
  revenue: number;
  expectedAudience: number;
  uniqueUrl: string;
  audioFiles: any[];
  videos: any[];
  documents: any[];
  images: any[];
  socialLinks: {
    whatsapp: string;
    phone: string;
    email: string;
  };
}

interface DashboardStats {
  totalAudience: number;
  campaignsActive: number;
  dispatchesSent: number;
  clickRate: number;
  whatsappMessages: number;
  smsMessages: number;
  ivrCalls: number;
  engagementRate: number;
}

export default function DashboardPage() {
  const [subscriber, setSubscriber] = useState<SubscriberData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalAudience: 0,
    campaignsActive: 0,
    dispatchesSent: 0,
    clickRate: 0,
    whatsappMessages: 0,
    smsMessages: 0,
    ivrCalls: 0,
    engagementRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if subscriber is logged in
    const subscriberData = sessionStorage.getItem('subscriber');
    if (!subscriberData) {
      router.push('/subscriber-login');
      return;
    }

    try {
      const parsedSubscriber = JSON.parse(subscriberData);
      setSubscriber(parsedSubscriber);
      loadDashboardData(parsedSubscriber);
    } catch (error) {
      console.error('Error parsing subscriber data:', error);
      router.push('/subscriber-login');
    }
  }, [router]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!subscriber) return;

    const interval = setInterval(() => {
      loadDashboardData(subscriber);
    }, 30000);

    return () => clearInterval(interval);
  }, [subscriber]);

  const loadDashboardData = async (subscriberData: SubscriberData) => {
    try {
      setLoading(true);
      
      // Calculate stats from subscriber data
      const totalAudience = subscriberData.expectedAudience || 0;
      const campaignsActive = subscriberData.totalCampaigns || 0;
      const dispatchesSent = subscriberData.totalMessages || 0;
      const linkClicks = subscriberData.linkClicks || 0;
      const clickRate = dispatchesSent > 0 ? (linkClicks / dispatchesSent) * 100 : 0;
      const whatsappMessages = subscriberData.whatsappMessages || 0;
      const smsMessages = subscriberData.smsMessages || 0;
      const ivrCalls = subscriberData.ivrCalls || 0;
      const engagementRate = subscriberData.engagementRate || 0;

      const realStats = {
        totalAudience,
        campaignsActive,
        dispatchesSent,
        clickRate: Math.round(clickRate * 100) / 100,
        whatsappMessages,
        smsMessages,
        ivrCalls,
        engagementRate,
      };

      setStats(realStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('subscriber');
    router.push('/subscriber-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!subscriber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
          <button
            onClick={() => router.push('/subscriber-login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {subscriber.name}</h1>
                <p className="text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {subscriber.village}, {subscriber.district}, {subscriber.state}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Plan</p>
                <p className="font-semibold text-green-600">{subscriber.plan}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Audience</CardTitle>
              <Users className="h-5 w-5 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalAudience.toLocaleString()}</div>
              <p className="text-xs text-green-200">
                Expected reach
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Active Campaigns</CardTitle>
              <Activity className="h-5 w-5 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.campaignsActive}</div>
              <p className="text-xs text-blue-200">
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Messages Sent</CardTitle>
              <MessageSquare className="h-5 w-5 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.dispatchesSent.toLocaleString()}</div>
              <p className="text-xs text-purple-200">
                Total outreach
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Engagement Rate</CardTitle>
              <TrendingUp className="h-5 w-5 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.engagementRate}%</div>
              <p className="text-xs text-orange-200">
                Click-through rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Communication Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">WhatsApp Messages</CardTitle>
              <MessageSquare className="h-5 w-5 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.whatsappMessages.toLocaleString()}</div>
              <p className="text-xs text-green-200">
                Messages sent
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">SMS Messages</CardTitle>
              <Phone className="h-5 w-5 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.smsMessages.toLocaleString()}</div>
              <p className="text-xs text-blue-200">
                SMS sent
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">IVR Calls</CardTitle>
              <Phone className="h-5 w-5 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ivrCalls.toLocaleString()}</div>
              <p className="text-xs text-purple-200">
                Calls made
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Voter Data Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Voter Data Management
            </CardTitle>
            <CardDescription>
              Upload and manage your voter database for targeted campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Voter Data</h3>
                <p className="text-gray-600 mb-4">
                  Upload Excel or CSV files with voter information
                </p>
                <Button
                  onClick={() => router.push('/voter-upload')}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Data
                </Button>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <Link className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage URLs</h3>
                <p className="text-gray-600 mb-4">
                  Create and manage unique URLs for your campaigns
                </p>
                <Button
                  onClick={() => router.push('/url-management')}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Manage URLs
                </Button>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Election Manifesto</h3>
                <p className="text-gray-600 mb-4">
                  Create and share your election manifesto with voters
                </p>
                <Button
                  onClick={() => router.push('/manifesto-management')}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Manifesto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{subscriber.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-semibold text-green-600">{subscriber.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold">{subscriber.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-green-600">{subscriber.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="font-semibold">{new Date(subscriber.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Active</p>
                  <p className="font-semibold">{new Date(subscriber.lastActive).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Village</p>
                  <p className="font-semibold">{subscriber.village}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p className="font-semibold">{subscriber.district}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="font-semibold">{subscriber.state}</p>
                </div>
                {subscriber.campaignFocus && (
                  <div>
                    <p className="text-sm text-gray-500">Campaign Focus</p>
                    <p className="font-semibold">{subscriber.campaignFocus}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

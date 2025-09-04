'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sarpanch-campaign/ui';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  UserPlus,
  MessageSquare,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Link as LinkIcon,
  Smartphone,
  Globe,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Clock,
  Zap,
  Eye,
  MousePointer
} from 'lucide-react';

interface CompanyStats {
  totalSubscribers: number;
  activeSubscribers: number;
  monthlyRevenue: number;
  totalRevenue: number;
  newSubscribersThisMonth: number;
  totalMessagesSent: number;
  totalCampaigns: number;
  averageEngagement: number;
  whatsappMessages: number;
  smsMessages: number;
  ivrCalls: number;
  totalLinks: number;
  linkClicks: number;
  activeCampaigns: number;
  completedCampaigns: number;
}

interface CommunicationStats {
  whatsapp: {
    sent: number;
    delivered: number;
    read: number;
    replied: number;
    failed: number;
  };
  sms: {
    sent: number;
    delivered: number;
    failed: number;
  };
  ivr: {
    calls: number;
    answered: number;
    completed: number;
    missed: number;
  };
}

interface LinkStats {
  total: number;
  active: number;
  clicks: number;
  topPerforming: Array<{
    url: string;
    clicks: number;
    campaign: string;
  }>;
}

export default function CompanyDashboard() {
  const [stats, setStats] = useState<CompanyStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    newSubscribersThisMonth: 0,
    totalMessagesSent: 0,
    totalCampaigns: 0,
    averageEngagement: 0,
    whatsappMessages: 0,
    smsMessages: 0,
    ivrCalls: 0,
    totalLinks: 0,
    linkClicks: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
  });

  const [communicationStats, setCommunicationStats] = useState<CommunicationStats>({
    whatsapp: { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0 },
    sms: { sent: 0, delivered: 0, failed: 0 },
    ivr: { calls: 0, answered: 0, completed: 0, missed: 0 },
  });

  const [linkStats, setLinkStats] = useState<LinkStats>({
    total: 0,
    active: 0,
    clicks: 0,
    topPerforming: [],
  });

  const [loading, setLoading] = useState(false); // Start with false for testing
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadCompanyStats();
  }, []);

  // Real-time clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadCompanyStats = async () => {
    // Demo data for comprehensive company dashboard
    const demoStats = {
      totalSubscribers: 45,
      activeSubscribers: 38,
      monthlyRevenue: 22500,
      totalRevenue: 180000,
      newSubscribersThisMonth: 8,
      totalMessagesSent: 315000,
      totalCampaigns: 127,
      averageEngagement: 15.2,
      whatsappMessages: 280000,
      smsMessages: 30000,
      ivrCalls: 5000,
      totalLinks: 89,
      linkClicks: 47250,
      activeCampaigns: 12,
      completedCampaigns: 115,
    };

    const demoCommunicationStats = {
      whatsapp: { 
        sent: 280000, 
        delivered: 275000, 
        read: 220000, 
        replied: 45000, 
        failed: 5000 
      },
      sms: { 
        sent: 30000, 
        delivered: 29500, 
        failed: 500 
      },
      ivr: { 
        calls: 5000, 
        answered: 4200, 
        completed: 3800, 
        missed: 800 
      },
    };

    const demoLinkStats = {
      total: 89,
      active: 67,
      clicks: 47250,
      topPerforming: [
        { url: 'sarpanch-campaign.com/vote-rajesh', clicks: 1250, campaign: 'Vote for Rajesh' },
        { url: 'sarpanch-campaign.com/meeting-announcement', clicks: 980, campaign: 'Village Meeting' },
        { url: 'sarpanch-campaign.com/development-plan', clicks: 750, campaign: 'Development Plan' },
        { url: 'sarpanch-campaign.com/feedback', clicks: 620, campaign: 'Feedback Form' },
      ],
    };

    setStats(demoStats);
    setCommunicationStats(demoCommunicationStats);
    setLinkStats(demoLinkStats);
    setLoading(false);
  };

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    trend, 
    color = "blue",
    subtitle
  }: {
    title: string;
    value: string | number;
    description: string;
    icon: any;
    trend?: string;
    color?: string;
    subtitle?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
          {trend && (
            <span className={`ml-2 text-${trend.startsWith('+') ? 'green' : 'red'}-600`}>
              {trend}
            </span>
          )}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );

  const CommunicationCard = ({ 
    title, 
    stats, 
    icon: Icon, 
    color 
  }: {
    title: string;
    stats: any;
    icon: any;
    color: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-5 w-5 text-${color}-600`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="font-medium">{typeof value === 'number' ? value.toLocaleString() : String(value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
          <p className="text-gray-600">Comprehensive management of sarpanch subscribers and platform analytics</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="font-mono">
              {currentTime.toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900 font-mono">
            {currentTime.toLocaleTimeString('en-IN', {
              hour12: true,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Subscribers"
          value={stats.totalSubscribers}
          description="Sarpanch candidates"
          icon={Users}
          trend="+12%"
          color="blue"
          subtitle={`${stats.activeSubscribers} active`}
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${stats.monthlyRevenue.toLocaleString()}`}
          description="This month"
          icon={DollarSign}
          trend="+15%"
          color="green"
          subtitle={`₹${stats.totalRevenue.toLocaleString()} total`}
        />
        <StatCard
          title="Messages Sent"
          value={stats.totalMessagesSent.toLocaleString()}
          description="Total outreach"
          icon={MessageSquare}
          trend="+25%"
          color="orange"
          subtitle={`${stats.activeCampaigns} active campaigns`}
        />
        <StatCard
          title="Link Clicks"
          value={stats.linkClicks.toLocaleString()}
          description="Total clicks"
          icon={MousePointer}
          trend="+18%"
          color="purple"
          subtitle={`${stats.totalLinks} total links`}
        />
      </div>

      {/* Communication Analytics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Communication Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CommunicationCard
            title="WhatsApp Messages"
            stats={communicationStats.whatsapp}
            icon={MessageSquare}
            color="green"
          />
          <CommunicationCard
            title="SMS Messages"
            stats={communicationStats.sms}
            icon={Mail}
            color="blue"
          />
          <CommunicationCard
            title="IVR Calls"
            stats={communicationStats.ivr}
            icon={Phone}
            color="purple"
          />
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="WhatsApp Messages"
          value={stats.whatsappMessages.toLocaleString()}
          description="Total sent"
          icon={MessageSquare}
          trend="+22%"
          color="green"
          subtitle={`${Math.round((communicationStats.whatsapp.delivered / communicationStats.whatsapp.sent) * 100)}% delivery rate`}
        />
        <StatCard
          title="SMS Messages"
          value={stats.smsMessages.toLocaleString()}
          description="Total sent"
          icon={Mail}
          trend="+8%"
          color="blue"
          subtitle={`${Math.round((communicationStats.sms.delivered / communicationStats.sms.sent) * 100)}% delivery rate`}
        />
        <StatCard
          title="IVR Calls"
          value={stats.ivrCalls.toLocaleString()}
          description="Total calls"
          icon={Phone}
          trend="+15%"
          color="purple"
          subtitle={`${Math.round((communicationStats.ivr.answered / communicationStats.ivr.calls) * 100)}% answer rate`}
        />
        <StatCard
          title="Active Links"
          value={linkStats.active}
          description="Currently active"
          icon={LinkIcon}
          trend="+5%"
          color="orange"
          subtitle={`${linkStats.total} total links`}
        />
      </div>

      {/* Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Active vs completed campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Active Campaigns</span>
                </div>
                <span className="font-bold">{stats.activeCampaigns}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Completed Campaigns</span>
                </div>
                <span className="font-bold">{stats.completedCampaigns}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                    style={{ width: `${Math.min((stats.activeCampaigns / (stats.activeCampaigns + stats.completedCampaigns)) * 100, 100)}%` }}
                  ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
            <CardDescription>Most clicked campaign links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {linkStats.topPerforming.map((link, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{link.campaign}</p>
                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{link.clicks.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">clicks</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Subscribers</CardTitle>
            <CardDescription>Latest sarpanch signups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Rajesh Kumar', location: 'Village A, District X', plan: 'Premium', date: '2 hours ago', status: 'active' },
                { name: 'Priya Sharma', location: 'Village B, District Y', plan: 'Standard', date: '4 hours ago', status: 'active' },
                { name: 'Amit Patel', location: 'Village C, District Z', plan: 'Premium', date: '1 day ago', status: 'pending' },
                { name: 'Sunita Devi', location: 'Village D, District X', plan: 'Basic', date: '2 days ago', status: 'active' },
              ].map((subscriber, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${subscriber.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <div>
                      <p className="font-medium">{subscriber.name}</p>
                      <p className="text-sm text-gray-500">{subscriber.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{subscriber.plan}</p>
                    <p className="text-xs text-gray-500">{subscriber.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>System status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>WhatsApp API</span>
                </div>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>SMS Gateway</span>
                </div>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>IVR System</span>
                </div>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span>Database</span>
                </div>
                <span className="text-yellow-600 font-medium">High Load</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sarpanch-campaign/ui';
import { 
  MessageSquare,
  Mail,
  Phone,
  Target,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Globe,
  Smartphone,
  Zap,
  Eye,
  MousePointer,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

interface CommunicationData {
  whatsapp: {
    sent: number;
    delivered: number;
    read: number;
    replied: number;
    failed: number;
    deliveryRate: number;
    readRate: number;
    replyRate: number;
  };
  sms: {
    sent: number;
    delivered: number;
    failed: number;
    deliveryRate: number;
  };
  ivr: {
    calls: number;
    answered: number;
    completed: number;
    missed: number;
    answerRate: number;
    completionRate: number;
  };
  links: {
    total: number;
    active: number;
    clicks: number;
    topPerforming: Array<{
      url: string;
      clicks: number;
      campaign: string;
      ctr: number;
    }>;
  };
}

interface TimeSeriesData {
  date: string;
  whatsapp: number;
  sms: number;
  ivr: number;
  clicks: number;
}

export default function AnalyticsPage() {
  const [communicationData, setCommunicationData] = useState<CommunicationData>({
    whatsapp: { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0, deliveryRate: 0, readRate: 0, replyRate: 0 },
    sms: { sent: 0, delivered: 0, failed: 0, deliveryRate: 0 },
    ivr: { calls: 0, answered: 0, completed: 0, missed: 0, answerRate: 0, completionRate: 0 },
    links: { total: 0, active: 0, clicks: 0, topPerforming: [] },
  });

  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    // Demo communication data
    const demoData: CommunicationData = {
      whatsapp: {
        sent: 280000,
        delivered: 275000,
        read: 220000,
        replied: 45000,
        failed: 5000,
        deliveryRate: 98.2,
        readRate: 80.0,
        replyRate: 20.5,
      },
      sms: {
        sent: 30000,
        delivered: 29500,
        failed: 500,
        deliveryRate: 98.3,
      },
      ivr: {
        calls: 5000,
        answered: 4200,
        completed: 3800,
        missed: 800,
        answerRate: 84.0,
        completionRate: 90.5,
      },
      links: {
        total: 89,
        active: 67,
        clicks: 47250,
        topPerforming: [
          { url: 'sarpanch-campaign.com/vote-rajesh', clicks: 1250, campaign: 'Vote for Rajesh', ctr: 15.2 },
          { url: 'sarpanch-campaign.com/meeting-announcement', clicks: 980, campaign: 'Village Meeting', ctr: 12.8 },
          { url: 'sarpanch-campaign.com/development-plan', clicks: 750, campaign: 'Development Plan', ctr: 11.5 },
          { url: 'sarpanch-campaign.com/feedback', clicks: 620, campaign: 'Feedback Form', ctr: 9.8 },
          { url: 'sarpanch-campaign.com/event-reminder', clicks: 580, campaign: 'Event Reminder', ctr: 8.9 },
        ],
      },
    };

    // Demo time series data
    const demoTimeseries: TimeSeriesData[] = [
      { date: '2024-08-28', whatsapp: 12000, sms: 1500, ivr: 200, clicks: 2100 },
      { date: '2024-08-29', whatsapp: 13500, sms: 1800, ivr: 250, clicks: 2300 },
      { date: '2024-08-30', whatsapp: 11800, sms: 1200, ivr: 180, clicks: 1900 },
      { date: '2024-08-31', whatsapp: 14200, sms: 2000, ivr: 300, clicks: 2500 },
      { date: '2024-09-01', whatsapp: 15800, sms: 2200, ivr: 350, clicks: 2800 },
      { date: '2024-09-02', whatsapp: 13200, sms: 1600, ivr: 220, clicks: 2100 },
      { date: '2024-09-03', whatsapp: 14800, sms: 1900, ivr: 280, clicks: 2400 },
    ];

    setCommunicationData(demoData);
    setTimeSeriesData(demoTimeseries);
    setLoading(false);
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    color = "blue",
    percentage
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    trend?: string;
    color?: string;
    percentage?: number;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {subtitle}
          {trend && (
            <span className={`ml-2 text-${trend.startsWith('+') ? 'green' : 'red'}-600`}>
              {trend}
            </span>
          )}
        </p>
        {percentage !== undefined && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-${color}-500`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
          </div>
        )}
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication Analytics</h1>
          <p className="text-gray-600">Detailed analytics for WhatsApp, SMS, IVR, and link performance</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="WhatsApp Messages"
          value={communicationData.whatsapp.sent.toLocaleString()}
          subtitle="Total sent"
          icon={MessageSquare}
          trend="+12%"
          color="green"
          percentage={communicationData.whatsapp.deliveryRate}
        />
        <StatCard
          title="SMS Messages"
          value={communicationData.sms.sent.toLocaleString()}
          subtitle="Total sent"
          icon={Mail}
          trend="+8%"
          color="blue"
          percentage={communicationData.sms.deliveryRate}
        />
        <StatCard
          title="IVR Calls"
          value={communicationData.ivr.calls.toLocaleString()}
          subtitle="Total calls"
          icon={Phone}
          trend="+15%"
          color="purple"
          percentage={communicationData.ivr.answerRate}
        />
        <StatCard
          title="Link Clicks"
          value={communicationData.links.clicks.toLocaleString()}
          subtitle="Total clicks"
          icon={Target}
          trend="+22%"
          color="orange"
        />
      </div>

      {/* WhatsApp Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            WhatsApp Performance
          </CardTitle>
          <CardDescription>Detailed WhatsApp message analytics and engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded">
              <div className="text-3xl font-bold text-green-600">{communicationData.whatsapp.delivered.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Delivered</div>
              <div className="text-xs text-gray-400">{communicationData.whatsapp.deliveryRate}% delivery rate</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-3xl font-bold text-blue-600">{communicationData.whatsapp.read.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Read</div>
              <div className="text-xs text-gray-400">{communicationData.whatsapp.readRate}% read rate</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-3xl font-bold text-purple-600">{communicationData.whatsapp.replied.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Replied</div>
              <div className="text-xs text-gray-400">{communicationData.whatsapp.replyRate}% reply rate</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-3xl font-bold text-red-600">{communicationData.whatsapp.failed.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Failed</div>
              <div className="text-xs text-gray-400">{(100 - communicationData.whatsapp.deliveryRate).toFixed(1)}% failure rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            SMS Performance
          </CardTitle>
          <CardDescription>SMS delivery and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded">
              <div className="text-3xl font-bold text-blue-600">{communicationData.sms.delivered.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Delivered</div>
              <div className="text-xs text-gray-400">{communicationData.sms.deliveryRate}% delivery rate</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-3xl font-bold text-red-600">{communicationData.sms.failed.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Failed</div>
              <div className="text-xs text-gray-400">{(100 - communicationData.sms.deliveryRate).toFixed(1)}% failure rate</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-3xl font-bold text-gray-600">{((communicationData.sms.delivered / communicationData.sms.sent) * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
              <div className="text-xs text-gray-400">Overall performance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IVR Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-purple-600" />
            IVR Performance
          </CardTitle>
          <CardDescription>IVR call analytics and completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded">
              <div className="text-3xl font-bold text-purple-600">{communicationData.ivr.answered.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Answered</div>
              <div className="text-xs text-gray-400">{communicationData.ivr.answerRate}% answer rate</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-3xl font-bold text-green-600">{communicationData.ivr.completed.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Completed</div>
              <div className="text-xs text-gray-400">{communicationData.ivr.completionRate}% completion rate</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-3xl font-bold text-red-600">{communicationData.ivr.missed.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Missed</div>
              <div className="text-xs text-gray-400">{(100 - communicationData.ivr.answerRate).toFixed(1)}% miss rate</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-3xl font-bold text-gray-600">{((communicationData.ivr.completed / communicationData.ivr.calls) * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-500">Overall Success</div>
              <div className="text-xs text-gray-400">End-to-end completion</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Link Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Link Performance
            </CardTitle>
            <CardDescription>URL tracking and click analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Links</span>
                <span className="text-lg font-bold">{communicationData.links.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Links</span>
                <span className="text-lg font-bold">{communicationData.links.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Clicks</span>
                <span className="text-lg font-bold">{communicationData.links.clicks.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Avg Clicks per Link</span>
                <span className="text-lg font-bold">{Math.round(communicationData.links.clicks / communicationData.links.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Top Performing Links
            </CardTitle>
            <CardDescription>Most clicked campaign links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {communicationData.links.topPerforming.map((link, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{link.campaign}</p>
                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{link.clicks.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{link.ctr}% CTR</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            Communication Trends
          </CardTitle>
          <CardDescription>Daily communication volume over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeSeriesData.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium w-20">{new Date(day.date).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">WhatsApp: {day.whatsapp.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">SMS: {day.sms.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">IVR: {day.ivr.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Clicks: {day.clicks.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{day.whatsapp + day.sms + day.ivr + day.clicks}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

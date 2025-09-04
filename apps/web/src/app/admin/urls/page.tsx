'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input } from '@sarpanch-campaign/ui';
import { 
  Link as LinkIcon,
  Plus,
  Search,
  Filter,
  Copy,
  Check,
  Eye,
  BarChart3,
  TrendingUp,
  Calendar,
  Users,
  MousePointer,
  ExternalLink,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';

interface URLData {
  id: string;
  url: string;
  subscriberName: string;
  subscriberId: string;
  campaignName: string;
  createdAt: string;
  clicks: number;
  uniqueClicks: number;
  lastClicked: string;
  status: 'Active' | 'Inactive' | 'Expired';
  tags: string[];
  description: string;
}

export default function URLManagementPage() {
  const [urls, setUrls] = useState<URLData[]>([]);
  const [filteredUrls, setFilteredUrls] = useState<URLData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    loadURLs();
  }, []);

  useEffect(() => {
    filterURLs();
  }, [urls, searchTerm, filterStatus]);

  const loadURLs = async () => {
    // Demo URL data
    const demoURLs: URLData[] = [
      {
        id: '1',
        url: 'https://sarpanch-campaign.com/rajesh-kumar-a1b2c3',
        subscriberName: 'Rajesh Kumar',
        subscriberId: 'sub_1',
        campaignName: 'Vote for Development',
        createdAt: '2024-01-15',
        clicks: 1250,
        uniqueClicks: 980,
        lastClicked: '2024-09-04',
        status: 'Active',
        tags: ['election', 'development', 'village-a'],
        description: 'Main campaign URL for Rajesh Kumar'
      },
      {
        id: '2',
        url: 'https://sarpanch-campaign.com/priya-sharma-x9y8z7',
        subscriberName: 'Priya Sharma',
        subscriberId: 'sub_2',
        campaignName: 'Women Empowerment',
        createdAt: '2024-02-20',
        clicks: 890,
        uniqueClicks: 720,
        lastClicked: '2024-09-03',
        status: 'Active',
        tags: ['women', 'empowerment', 'village-b'],
        description: 'Campaign focus on women empowerment'
      },
      {
        id: '3',
        url: 'https://sarpanch-campaign.com/amit-patel-m5n6o7',
        subscriberName: 'Amit Patel',
        subscriberId: 'sub_3',
        campaignName: 'Youth Development',
        createdAt: '2024-03-10',
        clicks: 2100,
        uniqueClicks: 1650,
        lastClicked: '2024-09-04',
        status: 'Active',
        tags: ['youth', 'education', 'village-c'],
        description: 'Youth-focused campaign initiatives'
      },
      {
        id: '4',
        url: 'https://sarpanch-campaign.com/sunita-devi-p1q2r3',
        subscriberName: 'Sunita Devi',
        subscriberId: 'sub_4',
        campaignName: 'Healthcare Access',
        createdAt: '2024-04-05',
        clicks: 450,
        uniqueClicks: 380,
        lastClicked: '2024-08-15',
        status: 'Inactive',
        tags: ['healthcare', 'village-d'],
        description: 'Healthcare improvement campaign'
      },
      {
        id: '5',
        url: 'https://sarpanch-campaign.com/vikram-singh-s4t5u6',
        subscriberName: 'Vikram Singh',
        subscriberId: 'sub_5',
        campaignName: 'Infrastructure Development',
        createdAt: '2024-05-12',
        clicks: 680,
        uniqueClicks: 520,
        lastClicked: '2024-08-20',
        status: 'Expired',
        tags: ['infrastructure', 'village-e'],
        description: 'Infrastructure improvement focus'
      }
    ];

    setUrls(demoURLs);
    setLoading(false);
  };

  const filterURLs = () => {
    let filtered = urls;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(url => 
        url.subscriberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(url => url.status === filterStatus);
    }

    setFilteredUrls(filtered);
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCTR = (clicks: number, uniqueClicks: number) => {
    return uniqueClicks > 0 ? ((clicks / uniqueClicks) * 100).toFixed(1) : '0.0';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">URL Management</h1>
          <p className="text-gray-600">Manage and track unique campaign URLs for all subscribers</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Generate New URL
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
            <LinkIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urls.length}</div>
            <p className="text-xs text-muted-foreground">
              {urls.filter(u => u.status === 'Active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {urls.reduce((sum, url) => sum + url.clicks, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all URLs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Clicks</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {urls.reduce((sum, url) => sum + url.uniqueClicks, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique visitors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg CTR</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {urls.length > 0 ? 
                (urls.reduce((sum, url) => sum + parseFloat(getCTR(url.clicks, url.uniqueClicks)), 0) / urls.length).toFixed(1) 
                : '0.0'
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              Click-through rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search URLs, subscribers, campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Expired">Expired</option>
            </select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* URLs List */}
      <div className="space-y-4">
        {filteredUrls.map((url) => (
          <Card key={url.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{url.campaignName}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(url.status)}`}>
                      {url.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded break-all">
                      {url.url}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(url.url)}
                      className="flex items-center gap-1"
                    >
                      {copiedUrl === url.url ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedUrl === url.url ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(url.url, '_blank')}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Subscriber:</span>
                      <p className="font-medium">{url.subscriberName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Clicks:</span>
                      <p className="font-medium">{url.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Unique Clicks:</span>
                      <p className="font-medium">{url.uniqueClicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">CTR:</span>
                      <p className="font-medium">{getCTR(url.clicks, url.uniqueClicks)}%</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created: {new Date(url.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Last clicked: {new Date(url.lastClicked).toLocaleDateString()}
                    </div>
                  </div>

                  {url.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {url.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUrls.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <LinkIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No URLs found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

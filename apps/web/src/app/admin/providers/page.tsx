'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input } from '@sarpanch-campaign/ui';
import { 
  Search, 
  Filter, 
  Settings, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageSquare,
  Phone,
  Smartphone,
  RefreshCw,
  Globe,
  Key
} from 'lucide-react';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: string;
  providerSettings: {
    whatsapp: {
      phoneNumber: string;
      webhookUrl: string;
      status: string;
    };
    sms: {
      senderId: string;
      webhookUrl: string;
      status: string;
    };
    ivr: {
      phoneNumber: string;
      webhookUrl: string;
      status: string;
    };
  };
}

export default function ProviderManagementPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadSubscribers();
  }, []);

  useEffect(() => {
    filterSubscribers();
  }, [subscribers, searchTerm, filterStatus]);

  const loadSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/subscribers');
      const result = await response.json();

      if (response.ok && result.success) {
        setSubscribers(result.subscribers);
      } else {
        console.error('Failed to fetch subscribers:', result.error);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSubscribers = () => {
    let filtered = [...subscribers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(sub => sub.status === filterStatus);
    }

    setFilteredSubscribers(filtered);
  };

  const testProvider = async (subscriberId: string, provider: string) => {
    const key = `${subscriberId}-${provider}`;
    setTesting(prev => ({ ...prev, [key]: 'testing' }));

    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, make actual API calls to test settings
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      setTesting(prev => ({ 
        ...prev, 
        [key]: success ? 'success' : 'error' 
      }));

      // Reset after 3 seconds
      setTimeout(() => {
        setTesting(prev => ({ ...prev, [key]: '' }));
      }, 3000);
    } catch (error) {
      setTesting(prev => ({ ...prev, [key]: 'error' }));
      setTimeout(() => {
        setTesting(prev => ({ ...prev, [key]: '' }));
      }, 3000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'whatsapp':
        return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'sms':
        return <Smartphone className="h-5 w-5 text-blue-600" />;
      case 'ivr':
        return <Phone className="h-5 w-5 text-purple-600" />;
      default:
        return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Provider Settings</h1>
        <p className="text-gray-600">Manage subscriber-specific phone numbers and sender IDs</p>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Shared API Configuration</h3>
              <p className="text-blue-800 text-sm mb-3">
                All subscribers use shared API keys for cost efficiency. Each subscriber has their own 
                phone numbers and sender IDs for personalized messaging.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/admin/api-config'}
              >
                <Key className="mr-2 h-4 w-4" />
                Manage API Keys
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Trial">Trial</option>
          </select>
          <Button variant="outline" onClick={loadSubscribers}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="grid gap-6">
        {filteredSubscribers.map((subscriber) => (
          <Card key={subscriber.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{subscriber.name}</CardTitle>
                  <CardDescription>
                    {subscriber.email} • {subscriber.phone} • {subscriber.plan} Plan
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subscriber.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : subscriber.status === 'Trial'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscriber.status}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* WhatsApp */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getProviderIcon('whatsapp')}
                    <h3 className="font-semibold">WhatsApp</h3>
                    {getStatusIcon(subscriber.providerSettings.whatsapp.status)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <label className="text-gray-500">Phone Number:</label>
                      <p className="font-mono">{subscriber.providerSettings.whatsapp.phoneNumber}</p>
                    </div>
                    <div>
                      <label className="text-gray-500">Webhook:</label>
                      <p className="font-mono text-xs break-all">
                        {subscriber.providerSettings.whatsapp.webhookUrl}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testProvider(subscriber.id, 'whatsapp')}
                      disabled={testing[`${subscriber.id}-whatsapp`] === 'testing'}
                    >
                      {testing[`${subscriber.id}-whatsapp`] === 'testing' ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : testing[`${subscriber.id}-whatsapp`] === 'success' ? (
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      ) : testing[`${subscriber.id}-whatsapp`] === 'error' ? (
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      ) : (
                        <TestTube className="mr-2 h-4 w-4" />
                      )}
                      Test Settings
                    </Button>
                  </div>
                </div>

                {/* SMS */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getProviderIcon('sms')}
                    <h3 className="font-semibold">SMS</h3>
                    {getStatusIcon(subscriber.providerSettings.sms.status)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <label className="text-gray-500">Sender ID:</label>
                      <p className="font-mono">{subscriber.providerSettings.sms.senderId}</p>
                    </div>
                    <div>
                      <label className="text-gray-500">Webhook:</label>
                      <p className="font-mono text-xs break-all">
                        {subscriber.providerSettings.sms.webhookUrl}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testProvider(subscriber.id, 'sms')}
                      disabled={testing[`${subscriber.id}-sms`] === 'testing'}
                    >
                      {testing[`${subscriber.id}-sms`] === 'testing' ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : testing[`${subscriber.id}-sms`] === 'success' ? (
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      ) : testing[`${subscriber.id}-sms`] === 'error' ? (
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      ) : (
                        <TestTube className="mr-2 h-4 w-4" />
                      )}
                      Test Settings
                    </Button>
                  </div>
                </div>

                {/* IVR */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getProviderIcon('ivr')}
                    <h3 className="font-semibold">IVR</h3>
                    {getStatusIcon(subscriber.providerSettings.ivr.status)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <label className="text-gray-500">Phone Number:</label>
                      <p className="font-mono">{subscriber.providerSettings.ivr.phoneNumber}</p>
                    </div>
                    <div>
                      <label className="text-gray-500">Webhook:</label>
                      <p className="font-mono text-xs break-all">
                        {subscriber.providerSettings.ivr.webhookUrl}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testProvider(subscriber.id, 'ivr')}
                      disabled={testing[`${subscriber.id}-ivr`] === 'testing'}
                    >
                      {testing[`${subscriber.id}-ivr`] === 'testing' ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : testing[`${subscriber.id}-ivr`] === 'success' ? (
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      ) : testing[`${subscriber.id}-ivr`] === 'error' ? (
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      ) : (
                        <TestTube className="mr-2 h-4 w-4" />
                      )}
                      Test Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubscribers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No subscribers found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input } from '@sarpanch-campaign/ui';
import { 
  Settings, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageSquare,
  Phone,
  Smartphone,
  Save,
  RefreshCw,
  Key,
  Globe
} from 'lucide-react';

interface ApiConfig {
  whatsapp: {
    provider: string;
    apiKey: string;
    baseUrl: string;
    status: string;
    lastUpdated: string;
  };
  sms: {
    provider: string;
    apiKey: string;
    baseUrl: string;
    status: string;
    lastUpdated: string;
  };
  ivr: {
    provider: string;
    apiKey: string;
    token: string;
    baseUrl: string;
    status: string;
    lastUpdated: string;
  };
}

export default function ApiConfigPage() {
  const [config, setConfig] = useState<ApiConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  const [testing, setTesting] = useState<{ [key: string]: string }>({});
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/api-config');
      const result = await response.json();

      if (response.ok && result.success) {
        setConfig(result.config);
      } else {
        console.error('Failed to fetch API config:', result.error);
      }
    } catch (error) {
      console.error('Error fetching API config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: string) => {
    setEditing(prev => ({ ...prev, [service]: true }));
    setFormData(prev => ({
      ...prev,
      [service]: {
        apiKey: config?.[service as keyof ApiConfig]?.apiKey || '',
        token: config?.[service as keyof ApiConfig]?.token || '',
        baseUrl: config?.[service as keyof ApiConfig]?.baseUrl || ''
      }
    }));
  };

  const handleSave = async (service: string) => {
    setSaving(prev => ({ ...prev, [service]: true }));

    try {
      const response = await fetch('/api/admin/api-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service,
          credentials: formData[service]
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await loadConfig();
        setEditing(prev => ({ ...prev, [service]: false }));
        setFormData(prev => ({ ...prev, [service]: {} }));
      } else {
        console.error('Failed to save API config:', result.error);
      }
    } catch (error) {
      console.error('Error saving API config:', error);
    } finally {
      setSaving(prev => ({ ...prev, [service]: false }));
    }
  };

  const handleCancel = (service: string) => {
    setEditing(prev => ({ ...prev, [service]: false }));
    setFormData(prev => ({ ...prev, [service]: {} }));
  };

  const testApi = async (service: string) => {
    setTesting(prev => ({ ...prev, [service]: 'testing' }));

    try {
      const response = await fetch('/api/admin/api-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setTesting(prev => ({ 
          ...prev, 
          [service]: result.testResult.success ? 'success' : 'error' 
        }));

        // Reset after 3 seconds
        setTimeout(() => {
          setTesting(prev => ({ ...prev, [service]: '' }));
        }, 3000);
      }
    } catch (error) {
      setTesting(prev => ({ ...prev, [service]: 'error' }));
      setTimeout(() => {
        setTesting(prev => ({ ...prev, [service]: '' }));
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

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'whatsapp':
        return <MessageSquare className="h-6 w-6 text-green-600" />;
      case 'sms':
        return <Smartphone className="h-6 w-6 text-blue-600" />;
      case 'ivr':
        return <Phone className="h-6 w-6 text-purple-600" />;
      default:
        return <Settings className="h-6 w-6 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load configuration</h3>
        <p className="text-gray-500">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">API Configuration</h1>
        <p className="text-gray-600">Manage shared API credentials for all subscribers</p>
      </div>

      {/* API Services */}
      <div className="grid gap-6">
        {Object.entries(config).map(([service, serviceConfig]) => (
          <Card key={service}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {getServiceIcon(service)}
                  <div>
                    <CardTitle className="text-xl capitalize">{service} API</CardTitle>
                    <CardDescription>
                      {serviceConfig.provider} • {serviceConfig.baseUrl}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(serviceConfig.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    serviceConfig.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {serviceConfig.status}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* API Key */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    API Key
                  </label>
                  {editing[service] ? (
                    <Input
                      value={formData[service]?.apiKey || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [service]: { ...prev[service], apiKey: e.target.value }
                      }))}
                      placeholder="Enter API key"
                      className="font-mono"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded flex-1">
                        {serviceConfig.apiKey ? '••••••••••••••••' : 'Not configured'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Token (for IVR) */}
                {service === 'ivr' && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Token
                    </label>
                    {editing[service] ? (
                      <Input
                        value={formData[service]?.token || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          [service]: { ...prev[service], token: e.target.value }
                        }))}
                        placeholder="Enter token"
                        className="font-mono"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded flex-1">
                          {serviceConfig.token ? '••••••••••••••••' : 'Not configured'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Base URL */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Base URL
                  </label>
                  {editing[service] ? (
                    <Input
                      value={formData[service]?.baseUrl || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [service]: { ...prev[service], baseUrl: e.target.value }
                      }))}
                      placeholder="Enter base URL"
                      className="font-mono"
                    />
                  ) : (
                    <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                      {serviceConfig.baseUrl}
                    </p>
                  )}
                </div>

                {/* Last Updated */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-600">
                    {new Date(serviceConfig.lastUpdated).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  {editing[service] ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleSave(service)}
                        disabled={saving[service]}
                      >
                        {saving[service] ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(service)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(service)}
                      >
                        <Key className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testApi(service)}
                        disabled={testing[service] === 'testing'}
                      >
                        {testing[service] === 'testing' ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : testing[service] === 'success' ? (
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        ) : testing[service] === 'error' ? (
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        ) : (
                          <TestTube className="mr-2 h-4 w-4" />
                        )}
                        Test
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Shared API Configuration</h3>
              <p className="text-blue-800 text-sm">
                These API credentials are shared across all subscribers. Each subscriber will use their own 
                phone numbers and sender IDs, but all messages will be sent through these shared API keys.
                This approach is more cost-effective than maintaining separate API keys for each subscriber.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

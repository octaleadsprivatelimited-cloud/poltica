'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@sarpanch-campaign/ui';
import { useRouter } from 'next/navigation';
import { 
  Link, 
  Plus, 
  Copy, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface UrlData {
  id: string;
  shortUrl: string;
  originalUrl: string;
  title: string;
  description?: string;
  subscriberId: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  tags?: string[];
}

export default function UrlManagementPage() {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUrl, setEditingUrl] = useState<UrlData | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    originalUrl: '',
    title: '',
    description: '',
    tags: ''
  });

  useEffect(() => {
    loadUrls();
  }, []);

  const loadUrls = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/urls/list');
      const data = await response.json();
      
      if (response.ok) {
        setUrls(data.urls || []);
      } else {
        setError(data.error || 'Failed to load URLs');
      }
    } catch (err) {
      setError('Failed to load URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/urls/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('URL created successfully!');
        setFormData({ originalUrl: '', title: '', description: '', tags: '' });
        setShowCreateForm(false);
        loadUrls();
      } else {
        setError(data.error || 'Failed to create URL');
      }
    } catch (err) {
      setError('Failed to create URL');
    }
  };

  const handleEditUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUrl) return;

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/urls/${editingUrl.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('URL updated successfully!');
        setFormData({ originalUrl: '', title: '', description: '', tags: '' });
        setEditingUrl(null);
        loadUrls();
      } else {
        setError(data.error || 'Failed to update URL');
      }
    } catch (err) {
      setError('Failed to update URL');
    }
  };

  const handleDeleteUrl = async (urlId: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    try {
      const response = await fetch(`/api/urls/${urlId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('URL deleted successfully!');
        loadUrls();
      } else {
        setError(data.error || 'Failed to delete URL');
      }
    } catch (err) {
      setError('Failed to delete URL');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('URL copied to clipboard!');
  };

  const startEdit = (url: UrlData) => {
    setEditingUrl(url);
    setFormData({
      originalUrl: url.originalUrl,
      title: url.title,
      description: url.description || '',
      tags: url.tags?.join(', ') || ''
    });
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingUrl(null);
    setShowCreateForm(false);
    setFormData({ originalUrl: '', title: '', description: '', tags: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <Link className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">URL Management</h1>
                <p className="text-gray-600">Create and manage your unique URLs</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="flex items-center gap-2"
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create URL
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {success}
          </div>
        )}

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingUrl ? 'Edit URL' : 'Create New URL'}
              </CardTitle>
              <CardDescription>
                {editingUrl ? 'Update your URL details' : 'Create a new unique URL for your campaigns'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingUrl ? handleEditUrl : handleCreateUrl} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="originalUrl">Original URL *</Label>
                    <Input
                      id="originalUrl"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.originalUrl}
                      onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Campaign Landing Page"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Brief description of this URL..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="campaign, election, voting"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  >
                    {editingUrl ? 'Update URL' : 'Create URL'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* URLs List */}
        <div className="space-y-6">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading URLs...</p>
                </div>
              </CardContent>
            </Card>
          ) : urls.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Link className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No URLs Created Yet
                </h3>
                <p className="text-gray-500 text-center mb-6">
                  Create your first unique URL to start tracking your campaigns
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First URL
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {urls.map((url) => (
                <Card key={url.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Link className="h-5 w-5 text-blue-600" />
                          {url.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {url.description || 'No description provided'}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          url.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {url.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* URL Display */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-500 mb-1">Short URL</p>
                            <p className="font-mono text-sm text-blue-600 break-all">
                              {window.location.origin}/r/{url.shortUrl}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(`${window.location.origin}/r/${url.shortUrl}`)}
                              title="Copy URL"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`${window.location.origin}/r/${url.shortUrl}`, '_blank')}
                              title="Open URL"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">Original URL</p>
                          <p className="font-mono text-sm text-gray-700 break-all">
                            {url.originalUrl}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{url.clicks}</div>
                          <div className="text-sm text-gray-500">Total Clicks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {new Date(url.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">Created</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {url.tags?.length || 0}
                          </div>
                          <div className="text-sm text-gray-500">Tags</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {url.isActive ? '✓' : '✗'}
                          </div>
                          <div className="text-sm text-gray-500">Status</div>
                        </div>
                      </div>

                      {/* Tags */}
                      {url.tags && url.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {url.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(url)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/analytics/${url.id}`, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <BarChart3 className="h-4 w-4" />
                          Analytics
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUrl(url.id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

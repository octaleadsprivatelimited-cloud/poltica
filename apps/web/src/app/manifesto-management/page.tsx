'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@sarpanch-campaign/ui';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Plus, 
  Edit, 
  Eye, 
  Share2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Play,
  Image as ImageIcon,
  FileAudio,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ManifestoData {
  id: string;
  slug: string;
  subscriberId: string;
  manifesto: {
    title: string;
    description: string;
    keyPoints: string[];
    vision: string;
    mission: string;
  };
  media: {
    videos: Array<{
      id: string;
      title: string;
      url: string;
      thumbnail?: string;
      duration?: string;
    }>;
    audios: Array<{
      id: string;
      title: string;
      url: string;
      duration?: string;
    }>;
    images: Array<{
      id: string;
      title: string;
      url: string;
      caption?: string;
    }>;
    documents: Array<{
      id: string;
      title: string;
      url: string;
      type: string;
      size?: string;
    }>;
  };
  election: {
    pollingDate: string;
    pollingTime: string;
    boothNumber?: string;
    wardNumber?: string;
    constituency: string;
    state: string;
  };
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ManifestoManagementPage() {
  const [manifesto, setManifesto] = useState<ManifestoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keyPoints: '',
    vision: '',
    mission: '',
    pollingDate: '',
    pollingTime: '',
    boothNumber: '',
    wardNumber: '',
    constituency: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    website: ''
  });

  useEffect(() => {
    loadManifesto();
  }, []);

  const loadManifesto = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/manifesto/my');
      const data = await response.json();

      if (response.ok) {
        setManifesto(data.manifesto);
      } else if (response.status === 404) {
        // No manifesto exists yet
        setManifesto(null);
      } else {
        setError(data.error || 'Failed to load manifesto');
      }
    } catch (err) {
      setError('Failed to load manifesto');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManifesto = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/manifesto/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manifesto: {
            title: formData.title,
            description: formData.description,
            keyPoints: formData.keyPoints.split('\n').filter(point => point.trim()),
            vision: formData.vision,
            mission: formData.mission
          },
          election: {
            pollingDate: formData.pollingDate,
            pollingTime: formData.pollingTime,
            boothNumber: formData.boothNumber,
            wardNumber: formData.wardNumber,
            constituency: formData.constituency
          },
          social: {
            facebook: formData.facebook,
            twitter: formData.twitter,
            instagram: formData.instagram,
            youtube: formData.youtube,
            website: formData.website
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Manifesto created successfully!');
        setShowForm(false);
        loadManifesto();
      } else {
        setError(data.error || 'Failed to create manifesto');
      }
    } catch (err) {
      setError('Failed to create manifesto');
    }
  };

  const handleUpdateManifesto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manifesto) return;

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/manifesto/${manifesto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manifesto: {
            title: formData.title,
            description: formData.description,
            keyPoints: formData.keyPoints.split('\n').filter(point => point.trim()),
            vision: formData.vision,
            mission: formData.mission
          },
          election: {
            pollingDate: formData.pollingDate,
            pollingTime: formData.pollingTime,
            boothNumber: formData.boothNumber,
            wardNumber: formData.wardNumber,
            constituency: formData.constituency
          },
          social: {
            facebook: formData.facebook,
            twitter: formData.twitter,
            instagram: formData.instagram,
            youtube: formData.youtube,
            website: formData.website
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Manifesto updated successfully!');
        setShowForm(false);
        loadManifesto();
      } else {
        setError(data.error || 'Failed to update manifesto');
      }
    } catch (err) {
      setError('Failed to update manifesto');
    }
  };

  const startEdit = () => {
    if (manifesto) {
      setFormData({
        title: manifesto.manifesto.title,
        description: manifesto.manifesto.description,
        keyPoints: manifesto.manifesto.keyPoints.join('\n'),
        vision: manifesto.manifesto.vision,
        mission: manifesto.manifesto.mission,
        pollingDate: manifesto.election.pollingDate,
        pollingTime: manifesto.election.pollingTime,
        boothNumber: manifesto.election.boothNumber || '',
        wardNumber: manifesto.election.wardNumber || '',
        constituency: manifesto.election.constituency,
        facebook: manifesto.social.facebook || '',
        twitter: manifesto.social.twitter || '',
        instagram: manifesto.social.instagram || '',
        youtube: manifesto.social.youtube || '',
        website: manifesto.social.website || ''
      });
    }
    setShowForm(true);
  };

  const cancelEdit = () => {
    setShowForm(false);
    setFormData({
      title: '',
      description: '',
      keyPoints: '',
      vision: '',
      mission: '',
      pollingDate: '',
      pollingTime: '',
      boothNumber: '',
      wardNumber: '',
      constituency: '',
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: '',
      website: ''
    });
  };

  const copyManifestoUrl = () => {
    if (manifesto) {
      const url = `${window.location.origin}/manifesto/${manifesto.slug}`;
      navigator.clipboard.writeText(url);
      setSuccess('Manifesto URL copied to clipboard!');
    }
  };

  const shareManifesto = (platform: string) => {
    if (!manifesto) return;
    
    const url = `${window.location.origin}/manifesto/${manifesto.slug}`;
    const title = manifesto.manifesto.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Election Manifesto</h1>
                <p className="text-gray-600">Create and manage your election manifesto</p>
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
              {manifesto ? (
                <Button
                  onClick={startEdit}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Manifesto
                </Button>
              ) : (
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Manifesto
                </Button>
              )}
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
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {manifesto ? 'Edit Manifesto' : 'Create Election Manifesto'}
              </CardTitle>
              <CardDescription>
                {manifesto ? 'Update your manifesto details' : 'Create your election manifesto to share with voters'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={manifesto ? handleUpdateManifesto : handleCreateManifesto} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Manifesto Title *</Label>
                      <Input
                        id="title"
                        placeholder="My Election Manifesto"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="constituency">Constituency *</Label>
                      <Input
                        id="constituency"
                        placeholder="Your constituency"
                        value={formData.constituency}
                        onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <textarea
                      id="description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Describe your vision and goals for the constituency..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Key Points */}
                <div className="space-y-2">
                  <Label htmlFor="keyPoints">Key Points (one per line)</Label>
                  <textarea
                    id="keyPoints"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="• Improve healthcare facilities&#10;• Better education infrastructure&#10;• Employment opportunities&#10;• Clean water supply"
                    value={formData.keyPoints}
                    onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
                  />
                </div>

                {/* Vision & Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vision">Vision</Label>
                    <textarea
                      id="vision"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Your vision for the constituency..."
                      value={formData.vision}
                      onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mission">Mission</Label>
                    <textarea
                      id="mission"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Your mission statement..."
                      value={formData.mission}
                      onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    />
                  </div>
                </div>

                {/* Election Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Election Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pollingDate">Polling Date *</Label>
                      <Input
                        id="pollingDate"
                        type="date"
                        value={formData.pollingDate}
                        onChange={(e) => setFormData({ ...formData, pollingDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pollingTime">Polling Time *</Label>
                      <Input
                        id="pollingTime"
                        placeholder="7:00 AM - 6:00 PM"
                        value={formData.pollingTime}
                        onChange={(e) => setFormData({ ...formData, pollingTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="boothNumber">Booth Number</Label>
                      <Input
                        id="boothNumber"
                        placeholder="Booth 123"
                        value={formData.boothNumber}
                        onChange={(e) => setFormData({ ...formData, boothNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wardNumber">Ward Number</Label>
                      <Input
                        id="wardNumber"
                        placeholder="Ward 5"
                        value={formData.wardNumber}
                        onChange={(e) => setFormData({ ...formData, wardNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        placeholder="https://facebook.com/yourpage"
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        placeholder="https://twitter.com/yourhandle"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        placeholder="https://instagram.com/yourhandle"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtube">YouTube</Label>
                      <Input
                        id="youtube"
                        placeholder="https://youtube.com/yourchannel"
                        value={formData.youtube}
                        onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  >
                    {manifesto ? 'Update Manifesto' : 'Create Manifesto'}
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

        {/* Manifesto Display */}
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading manifesto...</p>
              </div>
            </CardContent>
          </Card>
        ) : manifesto ? (
          <div className="space-y-6">
            {/* Manifesto Preview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Your Manifesto
                    </CardTitle>
                    <CardDescription>
                      Public URL: <span className="font-mono text-sm">{window.location.origin}/manifesto/{manifesto.slug}</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={copyManifestoUrl}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Copy Link
                    </Button>
                    <Button
                      onClick={() => window.open(`/manifesto/${manifesto.slug}`, '_blank')}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Public
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{manifesto.manifesto.title}</h3>
                  <p className="text-gray-700">{manifesto.manifesto.description}</p>
                </div>

                {manifesto.manifesto.keyPoints && manifesto.manifesto.keyPoints.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Points</h4>
                    <ul className="space-y-1">
                      {manifesto.manifesto.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Election Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>{new Date(manifesto.election.pollingDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span>{manifesto.election.pollingTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span>{manifesto.election.constituency}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
                    <div className="space-y-2 text-sm">
                      {manifesto.social.facebook && (
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">Facebook:</span>
                          <a href={manifesto.social.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Page
                          </a>
                        </div>
                      )}
                      {manifesto.social.twitter && (
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400">Twitter:</span>
                          <a href={manifesto.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            View Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Share Your Manifesto</h4>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => shareManifesto('facebook')}
                      size="sm"
                      variant="outline"
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      Facebook
                    </Button>
                    <Button
                      onClick={() => shareManifesto('twitter')}
                      size="sm"
                      variant="outline"
                      className="text-blue-400 hover:bg-blue-50"
                    >
                      Twitter
                    </Button>
                    <Button
                      onClick={() => shareManifesto('whatsapp')}
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:bg-green-50"
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Manifesto Created Yet
              </h3>
              <p className="text-gray-500 text-center mb-6">
                Create your election manifesto to share with voters
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your Manifesto
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

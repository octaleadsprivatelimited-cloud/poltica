'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@sarpanch-campaign/ui';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Play, 
  Download, 
  Image as ImageIcon,
  FileText,
  Clock,
  Users,
  Vote,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

interface ManifestoData {
  id: string;
  slug: string;
  subscriberId: string;
  subscriber: {
    name: string;
    phone: string;
    email: string;
    village: string;
    district: string;
    state: string;
    party?: string;
    constituency?: string;
    profileImage?: string;
  };
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

export default function ManifestoPage({ params }: { params: { slug: string } }) {
  const [manifesto, setManifesto] = useState<ManifestoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    loadManifesto();
  }, [params.slug]);

  const loadManifesto = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/manifesto/${params.slug}`);
      const data = await response.json();

      if (response.ok) {
        setManifesto(data.manifesto);
      } else {
        setError(data.error || 'Manifesto not found');
      }
    } catch (err) {
      setError('Failed to load manifesto');
    } finally {
      setLoading(false);
    }
  };

  const shareManifesto = (platform: string) => {
    const url = window.location.href;
    const title = manifesto?.manifesto.title || 'Election Manifesto';
    
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Manifesto link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Manifesto...</h2>
          <p className="text-gray-600">Please wait while we load the election manifesto.</p>
        </div>
      </div>
    );
  }

  if (error || !manifesto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Manifesto Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested manifesto could not be found.'}</p>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              {manifesto.subscriber.profileImage ? (
                <img
                  src={manifesto.subscriber.profileImage}
                  alt={manifesto.subscriber.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <Users className="h-12 w-12 text-white" />
              )}
            </div>

            {/* Candidate Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {manifesto.subscriber.name}
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                {manifesto.subscriber.constituency || manifesto.subscriber.village}, {manifesto.subscriber.district}
              </p>
              {manifesto.subscriber.party && (
                <p className="text-blue-600 font-semibold mb-4">
                  {manifesto.subscriber.party}
                </p>
              )}
              
              {/* Contact Info */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {manifesto.subscriber.phone}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {manifesto.subscriber.email}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {manifesto.subscriber.state}
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={() => shareManifesto('facebook')}
                  size="sm"
                  variant="outline"
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => shareManifesto('twitter')}
                  size="sm"
                  variant="outline"
                  className="text-blue-400 hover:bg-blue-50"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => shareManifesto('whatsapp')}
                  size="sm"
                  variant="outline"
                  className="text-green-600 hover:bg-green-50"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Manifesto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Election Manifesto
                </CardTitle>
                <CardDescription>
                  {manifesto.manifesto.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {manifesto.manifesto.description}
                  </p>
                </div>

                {manifesto.manifesto.keyPoints && manifesto.manifesto.keyPoints.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {manifesto.manifesto.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {manifesto.manifesto.vision && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Vision</h3>
                    <p className="text-gray-700 italic">"{manifesto.manifesto.vision}"</p>
                  </div>
                )}

                {manifesto.manifesto.mission && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mission</h3>
                    <p className="text-gray-700 italic">"{manifesto.manifesto.mission}"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Videos */}
            {manifesto.media.videos && manifesto.media.videos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Campaign Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {manifesto.media.videos.map((video) => (
                      <div key={video.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                          {activeVideo === video.id ? (
                            <video
                              controls
                              className="w-full h-full rounded-lg"
                              onEnded={() => setActiveVideo(null)}
                            >
                              <source src={video.url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <div className="text-center">
                              <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">{video.title}</p>
                              {video.duration && (
                                <p className="text-xs text-gray-500 mt-1">{video.duration}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => setActiveVideo(activeVideo === video.id ? null : video.id)}
                          className="w-full"
                          variant="outline"
                        >
                          {activeVideo === video.id ? 'Stop Video' : 'Play Video'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Images */}
            {manifesto.media.images && manifesto.media.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Campaign Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {manifesto.media.images.map((image) => (
                      <div key={image.id} className="bg-gray-50 rounded-lg p-4">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                        <p className="text-sm font-medium text-gray-900">{image.title}</p>
                        {image.caption && (
                          <p className="text-xs text-gray-600 mt-1">{image.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Audio */}
            {manifesto.media.audios && manifesto.media.audios.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Audio Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {manifesto.media.audios.map((audio) => (
                      <div key={audio.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{audio.title}</p>
                            {audio.duration && (
                              <p className="text-sm text-gray-600">{audio.duration}</p>
                            )}
                          </div>
                          <audio controls className="ml-4">
                            <source src={audio.url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            {manifesto.media.documents && manifesto.media.documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {manifesto.media.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">{doc.title}</p>
                            <p className="text-sm text-gray-600">{doc.type}</p>
                            {doc.size && (
                              <p className="text-xs text-gray-500">{doc.size}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => window.open(doc.url, '_blank')}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Election Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="h-5 w-5" />
                  Election Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Polling Date</p>
                    <p className="font-semibold">{new Date(manifesto.election.pollingDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Polling Time</p>
                    <p className="font-semibold">{manifesto.election.pollingTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Constituency</p>
                    <p className="font-semibold">{manifesto.election.constituency}</p>
                  </div>
                </div>
                {manifesto.election.boothNumber && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Booth Number</p>
                      <p className="font-semibold">{manifesto.election.boothNumber}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            {manifesto.social && Object.values(manifesto.social).some(link => link) && (
              <Card>
                <CardHeader>
                  <CardTitle>Connect With Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {manifesto.social.facebook && (
                      <a
                        href={manifesto.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-blue-600 hover:text-blue-800"
                      >
                        <Facebook className="h-5 w-5" />
                        <span>Facebook</span>
                      </a>
                    )}
                    {manifesto.social.twitter && (
                      <a
                        href={manifesto.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-blue-400 hover:text-blue-600"
                      >
                        <Twitter className="h-5 w-5" />
                        <span>Twitter</span>
                      </a>
                    )}
                    {manifesto.social.instagram && (
                      <a
                        href={manifesto.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-pink-600 hover:text-pink-800"
                      >
                        <Instagram className="h-5 w-5" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {manifesto.social.youtube && (
                      <a
                        href={manifesto.social.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-red-600 hover:text-red-800"
                      >
                        <Youtube className="h-5 w-5" />
                        <span>YouTube</span>
                      </a>
                    )}
                    {manifesto.social.website && (
                      <a
                        href={manifesto.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-600 hover:text-gray-800"
                      >
                        <FileText className="h-5 w-5" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sarpanch-campaign/ui';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Share2, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  User,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  ExternalLink,
  Heart,
  ThumbsUp,
  Share,
  Activity,
  Target,
  BarChart3,
  MousePointer
} from 'lucide-react';

interface SubscriberData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  village: string;
  district: string;
  state: string;
  whatsappNumber: string;
  campaignFocus: string;
  interests: string[];
  bio: string;
  profileImage?: string;
  audioFiles: AudioFile[];
  videos: VideoFile[];
  documents: DocumentFile[];
  images: ImageFile[];
  socialLinks: {
    whatsapp?: string;
    phone?: string;
    email?: string;
  };
  lastUpdated: string;
}

interface AudioFile {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  category: string;
  autoPlay: boolean;
  thumbnail?: string;
}

interface VideoFile {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
  duration: string;
  category: string;
}

interface DocumentFile {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'doc' | 'docx';
  size: string;
  category: string;
}

interface ImageFile {
  id: string;
  title: string;
  description: string;
  url: string;
  alt: string;
  category: string;
}

export default function SubscriberPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [subscriber, setSubscriber] = useState<SubscriberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<AudioFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'audio' | 'videos' | 'documents' | 'images' | 'manage'>('audio');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState({
    type: 'image',
    title: '',
    description: '',
    url: '',
    category: ''
  });
  const [activityData, setActivityData] = useState<any>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadSubscriberData();
    loadActivityData();
  }, [slug]);

  const loadActivityData = async () => {
    try {
      const response = await fetch(`/api/subscriber/${slug}/activity`);
      if (response.ok) {
        const data = await response.json();
        setActivityData(data);
      }
    } catch (error) {
      console.error('Error loading activity data:', error);
    }
  };

  useEffect(() => {
    if (currentAudio && audioRef.current) {
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentAudio]);

  const loadSubscriberData = async () => {
    try {
      const response = await fetch(`/api/subscriber/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subscriber data');
      }
      const subscriberData = await response.json();
      setSubscriber(subscriberData);
      
      // Auto-play first audio if it's set to auto-play
      if (subscriberData.audioFiles.length > 0 && subscriberData.audioFiles[0].autoPlay) {
        setCurrentAudio(subscriberData.audioFiles[0]);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
          }
        }, 1000);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading subscriber data:', error);
      setLoading(false);
    }
  };


  const playAudio = (audio: AudioFile) => {
    setCurrentAudio(audio);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = audio.url;
      audioRef.current.play();
    }
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else if (currentAudio) {
      playAudio(currentAudio);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const shareContent = (type: string, item: any) => {
    const url = window.location.href;
    const text = `Check out this ${type} from ${subscriber?.name}: ${item.title}`;
    
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: text,
        url: url
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${text} - ${url}`);
      alert('Link copied to clipboard!');
    }
  };

  const openWhatsApp = () => {
    if (subscriber?.socialLinks.whatsapp) {
      window.open(subscriber.socialLinks.whatsapp, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!subscriber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Subscriber Not Found</h1>
          <p className="text-gray-600">The requested subscriber page could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Audio Player */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onDurationChange={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white opacity-10 rounded-full animate-pulse delay-2000"></div>
            <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-white opacity-10 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl transform hover:scale-110 transition-transform duration-300">
                  {subscriber.name.charAt(0)}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
              </div>
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  {subscriber.name}
                </h1>
                <p className="text-xl text-purple-100 mb-1">
                  <MapPin className="inline h-5 w-5 mr-2" />
                  {subscriber.village}, {subscriber.district}, {subscriber.state}
                </p>
                <p className="text-lg text-yellow-200 font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {subscriber.campaignFocus}
                </p>
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex space-x-4">
              <button
                onClick={openWhatsApp}
                className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl flex items-center space-x-3 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <MessageCircle className="h-5 w-5 group-hover:animate-bounce" />
                <span className="font-semibold">WhatsApp</span>
              </button>
              <button
                onClick={() => window.open(subscriber.socialLinks.phone, '_self')}
                className="group bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-2xl flex items-center space-x-3 hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <Phone className="h-5 w-5 group-hover:animate-pulse" />
                <span className="font-semibold">Call</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bio Section */}
        <Card className="mb-8 bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                <User className="h-6 w-6" />
              </div>
              <span>About {subscriber.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-gray-700 leading-relaxed text-lg mb-6">{subscriber.bio}</p>
            <div className="flex flex-wrap gap-3">
              {subscriber.interests.map((interest, index) => {
                const colors = [
                  'bg-gradient-to-r from-pink-500 to-rose-500',
                  'bg-gradient-to-r from-blue-500 to-cyan-500',
                  'bg-gradient-to-r from-green-500 to-emerald-500',
                  'bg-gradient-to-r from-purple-500 to-violet-500',
                  'bg-gradient-to-r from-orange-500 to-red-500',
                  'bg-gradient-to-r from-indigo-500 to-blue-500'
                ];
                return (
                  <span
                    key={index}
                    className={`px-4 py-2 text-white rounded-full text-sm font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 ${colors[index % colors.length]}`}
                  >
                    {interest}
                  </span>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Audio Player */}
        {currentAudio && (
          <Card className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-white bg-opacity-20 rounded-full animate-pulse">
                  <Music className="h-6 w-6" />
                </div>
                <span>🎵 Now Playing: {currentAudio.title}</span>
              </CardTitle>
              <CardDescription className="text-purple-100 text-lg">{currentAudio.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={togglePlayPause}
                    className="group w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-2xl"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 group-hover:animate-pulse" />
                    ) : (
                      <Play className="h-8 w-8 ml-1 group-hover:animate-bounce" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {formatTime(currentTime)}
                      </span>
                      <div className="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 shadow-inner">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300 shadow-lg"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={toggleMute}
                    className="w-12 h-12 text-purple-600 hover:text-purple-800 transition-all duration-300 transform hover:scale-110"
                  >
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <VolumeX className="h-5 w-5 text-purple-400" />
                  <label htmlFor="volume-slider" className="sr-only">Volume control</label>
                  <input
                    id="volume-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 100%)`
                    }}
                  />
                  <Volume2 className="h-5 w-5 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Dashboard */}
        <Card className="mb-8 bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                <Activity className="h-6 w-6" />
              </div>
              <span>Activity Dashboard</span>
            </CardTitle>
            <CardDescription className="text-indigo-100 text-lg">
              Track your campaign performance and engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">WhatsApp Messages</p>
                    <p className="text-3xl font-bold">
                      {activityData?.whatsappMessages?.total?.toLocaleString() || '2,847'}
                    </p>
                    <p className="text-green-200 text-xs">
                      +{activityData?.whatsappMessages?.growth || 12}% this week
                    </p>
                  </div>
                  <MessageCircle className="h-12 w-12 text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">SMS Sent</p>
                    <p className="text-3xl font-bold">
                      {activityData?.smsMessages?.total?.toLocaleString() || '1,234'}
                    </p>
                    <p className="text-blue-200 text-xs">
                      +{activityData?.smsMessages?.growth || 8}% this week
                    </p>
                  </div>
                  <Mail className="h-12 w-12 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">IVR Calls</p>
                    <p className="text-3xl font-bold">
                      {activityData?.ivrCalls?.total?.toLocaleString() || '456'}
                    </p>
                    <p className="text-purple-200 text-xs">
                      +{activityData?.ivrCalls?.growth || 15}% this week
                    </p>
                  </div>
                  <Phone className="h-12 w-12 text-purple-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">URL Clicks</p>
                    <p className="text-3xl font-bold">
                      {activityData?.urlClicks?.total?.toLocaleString() || '3,421'}
                    </p>
                    <p className="text-orange-200 text-xs">
                      +{activityData?.urlClicks?.growth || 22}% this week
                    </p>
                  </div>
                  <MousePointer className="h-12 w-12 text-orange-200" />
                </div>
              </div>
            </div>
            
            {/* Heat Map Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Target className="h-6 w-6 text-indigo-600" />
                <span>URL Click Heat Map</span>
              </h3>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {activityData?.heatMapData?.map((day: any, i: number) => {
                  const intensity = day.clicks / 100; // Normalize to 0-1
                  return (
                    <div
                      key={i}
                      className={`h-8 rounded-lg ${
                        intensity > 0.7 
                          ? 'bg-gradient-to-br from-green-400 to-green-600' 
                          : intensity > 0.4 
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                          : intensity > 0.1
                          ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                          : 'bg-gray-200'
                      } hover:scale-110 transition-transform duration-200`}
                      title={`${day.date}: ${day.clicks} clicks`}
                    ></div>
                  );
                }) || Array.from({ length: 28 }, (_, i) => (
                  <div
                    key={i}
                    className="h-8 rounded-lg bg-gray-200 hover:scale-110 transition-transform duration-200"
                    title={`Day ${i + 1}: Loading...`}
                  ></div>
                ))}
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span>No clicks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded"></div>
                  <span>Low activity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded"></div>
                  <span>High activity</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Management Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-2xl p-2">
            <nav className="flex space-x-2">
              {[
                { id: 'audio', label: 'Audio', icon: Music, count: subscriber.audioFiles.length, color: 'from-purple-500 to-pink-500', emoji: '🎵' },
                { id: 'videos', label: 'Videos', icon: Video, count: subscriber.videos.length, color: 'from-red-500 to-orange-500', emoji: '🎬' },
                { id: 'documents', label: 'Documents', icon: FileText, count: subscriber.documents.length, color: 'from-blue-500 to-cyan-500', emoji: '📄' },
                { id: 'images', label: 'Images', icon: ImageIcon, count: subscriber.images.length, color: 'from-green-500 to-emerald-500', emoji: '🖼️' },
                { id: 'manage', label: 'Manage', icon: User, count: 0, color: 'from-indigo-500 to-purple-500', emoji: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group relative flex-1 py-4 px-6 rounded-xl font-semibold text-sm flex items-center justify-center space-x-3 transition-all duration-300 transform ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:scale-102'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    activeTab === tab.id 
                      ? 'bg-white bg-opacity-20' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <tab.icon className="h-5 w-5" />
                  </div>
                  <span className="flex items-center space-x-2">
                    <span>{tab.emoji}</span>
                    <span>{tab.label}</span>
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id
                      ? 'bg-white bg-opacity-30 text-white'
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === 'audio' && subscriber.audioFiles.map((audio, index) => {
            const gradientColors = [
              'from-purple-500 to-pink-500',
              'from-blue-500 to-cyan-500',
              'from-green-500 to-emerald-500',
              'from-orange-500 to-red-500',
              'from-indigo-500 to-purple-500',
              'from-pink-500 to-rose-500'
            ];
            const bgGradient = gradientColors[index % gradientColors.length];
            
            return (
              <Card key={audio.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 overflow-hidden">
                <div className={`aspect-video bg-gradient-to-br ${bgGradient} rounded-t-lg flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 group-hover:animate-spin">
                      <Music className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-white text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      {formatTime(audio.duration)}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50">
                  <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-purple-600 transition-colors">
                    {audio.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{audio.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {audio.category}
                    </span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => playAudio(audio)}
                        className="group/btn p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        aria-label={`Play ${audio.title}`}
                      >
                        <Play className="h-5 w-5 group-hover/btn:animate-bounce" />
                      </button>
                      <button
                        onClick={() => shareContent('audio', audio)}
                        className="group/btn p-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        aria-label={`Share ${audio.title}`}
                      >
                        <Share className="h-5 w-5 group-hover/btn:animate-pulse" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {activeTab === 'videos' && subscriber.videos.map((video, index) => {
            const gradientColors = [
              'from-red-500 to-orange-500',
              'from-pink-500 to-rose-500',
              'from-purple-500 to-indigo-500',
              'from-blue-500 to-cyan-500',
              'from-green-500 to-emerald-500',
              'from-yellow-500 to-orange-500'
            ];
            const bgGradient = gradientColors[index % gradientColors.length];
            
            return (
              <Card key={video.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank')}
                      className="group/play w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-110 shadow-2xl"
                      aria-label={`Play video: ${video.title}`}
                    >
                      <Play className="h-8 w-8 ml-1 group-hover/play:animate-bounce" />
                    </button>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {video.duration}
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {video.category}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50">
                  <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-red-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{video.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      YouTube Video
                    </span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank')}
                        className="group/btn p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        aria-label={`Open ${video.title} on YouTube`}
                      >
                        <ExternalLink className="h-5 w-5 group-hover/btn:animate-pulse" />
                      </button>
                      <button
                        onClick={() => shareContent('video', video)}
                        className="group/btn p-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        aria-label={`Share ${video.title}`}
                      >
                        <Share className="h-5 w-5 group-hover/btn:animate-pulse" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {activeTab === 'documents' && subscriber.documents.map((doc, index) => {
            const gradientColors = [
              'from-blue-500 to-cyan-500',
              'from-indigo-500 to-blue-500',
              'from-purple-500 to-indigo-500',
              'from-pink-500 to-purple-500',
              'from-green-500 to-blue-500',
              'from-orange-500 to-pink-500'
            ];
            const bgGradient = gradientColors[index % gradientColors.length];
            
            return (
              <Card key={doc.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 overflow-hidden">
                <div className={`aspect-video bg-gradient-to-br ${bgGradient} rounded-t-lg flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 group-hover:animate-bounce">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-white text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      {doc.type.toUpperCase()}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50">
                  <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{doc.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {doc.size}
                    </span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => window.open(doc.url, '_blank')}
                        className="group/btn p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        aria-label={`Open ${doc.title}`}
                      >
                        <ExternalLink className="h-5 w-5 group-hover/btn:animate-pulse" />
                      </button>
                      <button
                        onClick={() => shareContent('document', doc)}
                        className="group/btn p-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        aria-label={`Share ${doc.title}`}
                      >
                        <Share className="h-5 w-5 group-hover/btn:animate-pulse" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {activeTab === 'images' && subscriber.images.map((image, index) => {
            const gradientColors = [
              'from-green-500 to-emerald-500',
              'from-pink-500 to-rose-500',
              'from-purple-500 to-violet-500',
              'from-blue-500 to-indigo-500',
              'from-orange-500 to-yellow-500',
              'from-cyan-500 to-blue-500'
            ];
            const bgGradient = gradientColors[index % gradientColors.length];
            
            return (
              <Card key={image.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden relative">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {image.category}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50">
                  <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-green-600 transition-colors">
                    {image.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{image.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Image
                    </span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => window.open(image.url, '_blank')}
                        className="group/btn p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        aria-label={`Open ${image.title}`}
                      >
                        <ExternalLink className="h-5 w-5 group-hover/btn:animate-pulse" />
                      </button>
                      <button
                        onClick={() => shareContent('image', image)}
                        className="group/btn p-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        aria-label={`Share ${image.title}`}
                      >
                        <Share className="h-5 w-5 group-hover/btn:animate-pulse" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Content Management Section */}
          {activeTab === 'manage' && (
            <div className="space-y-8">
              {/* Add Content Form */}
              <Card className="bg-gradient-to-br from-white to-indigo-50 border-0 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <div className="p-2 bg-white bg-opacity-20 rounded-full">
                      <User className="h-6 w-6" />
                    </div>
                    <span>Manage Your Content</span>
                  </CardTitle>
                  <CardDescription className="text-indigo-100 text-lg">
                    Add and manage your multimedia content
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Add New Content</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                          <select
                            value={newContent.type}
                            onChange={(e) => setNewContent({...newContent, type: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            aria-label="Select content type"
                          >
                            <option value="image">🖼️ Image (PNG/JPEG)</option>
                            <option value="video">🎬 YouTube Video</option>
                            <option value="document">📄 PDF Document</option>
                            <option value="audio">🎵 Audio File</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={newContent.title}
                            onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter content title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            value={newContent.description}
                            onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            rows={3}
                            placeholder="Enter content description"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {newContent.type === 'video' ? 'YouTube Video ID' : 'URL'}
                          </label>
                          <input
                            type="text"
                            value={newContent.url}
                            onChange={(e) => setNewContent({...newContent, url: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={newContent.type === 'video' ? 'Enter YouTube video ID' : 'Enter file URL'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <input
                            type="text"
                            value={newContent.category}
                            onChange={(e) => setNewContent({...newContent, category: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., Introduction, Development, Events"
                          />
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/subscriber/${slug}/activity`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(newContent),
                              });
                              
                              if (response.ok) {
                                alert('Content added successfully!');
                                setNewContent({ type: 'image', title: '', description: '', url: '', category: '' });
                                // Refresh activity data
                                loadActivityData();
                              } else {
                                alert('Failed to add content. Please try again.');
                              }
                            } catch (error) {
                              console.error('Error adding content:', error);
                              alert('Failed to add content. Please try again.');
                            }
                          }}
                          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          Add Content
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Content Guidelines</h3>
                      <div className="space-y-4 text-sm text-gray-600">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">🖼️ Images</h4>
                          <p>• Supported formats: PNG, JPEG, JPG</p>
                          <p>• Maximum size: 10MB</p>
                          <p>• Recommended resolution: 1920x1080 or higher</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-red-800 mb-2">🎬 YouTube Videos</h4>
                          <p>• Use YouTube video ID only</p>
                          <p>• Ensure videos are public or unlisted</p>
                          <p>• Add relevant descriptions for better engagement</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2">📄 PDF Documents</h4>
                          <p>• Maximum size: 25MB</p>
                          <p>• Use descriptive titles</p>
                          <p>• Ensure content is relevant to your campaign</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-800 mb-2">🎵 Audio Files</h4>
                          <p>• Supported formats: MP3, WAV, M4A</p>
                          <p>• Maximum size: 50MB</p>
                          <p>• Keep files under 10 minutes for better engagement</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Statistics */}
              <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <div className="p-2 bg-white bg-opacity-20 rounded-full">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <span>Content Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {activityData?.contentStats?.images?.total || 12}
                      </div>
                      <div className="text-sm text-gray-600">Total Images</div>
                      <div className="text-xs text-green-500">
                        +{activityData?.contentStats?.images?.thisWeek || 3} this week
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600 mb-2">
                        {activityData?.contentStats?.videos?.total || 8}
                      </div>
                      <div className="text-sm text-gray-600">YouTube Videos</div>
                      <div className="text-xs text-red-500">
                        +{activityData?.contentStats?.videos?.thisWeek || 1} this week
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {activityData?.contentStats?.documents?.total || 5}
                      </div>
                      <div className="text-sm text-gray-600">PDF Documents</div>
                      <div className="text-xs text-blue-500">
                        +{activityData?.contentStats?.documents?.thisWeek || 2} this week
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {activityData?.contentStats?.audio?.total || 3}
                      </div>
                      <div className="text-sm text-gray-600">Audio Files</div>
                      <div className="text-xs text-purple-500">
                        +{activityData?.contentStats?.audio?.thisWeek || 1} this week
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 bg-gradient-to-br from-white to-indigo-50 border-0 shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                <MessageCircle className="h-6 w-6" />
              </div>
              <span>Get in Touch</span>
            </CardTitle>
            <CardDescription className="text-indigo-100 text-lg">
              Connect with {subscriber.name} for any questions or support
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={openWhatsApp}
                className="group flex items-center space-x-4 p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <div className="p-3 bg-white bg-opacity-20 rounded-full group-hover:animate-bounce">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">WhatsApp</p>
                  <p className="text-green-100 text-sm">{subscriber.whatsappNumber}</p>
                </div>
              </button>
              <button
                onClick={() => window.open(subscriber.socialLinks.phone, '_self')}
                className="group flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <div className="p-3 bg-white bg-opacity-20 rounded-full group-hover:animate-pulse">
                  <Phone className="h-8 w-8" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">Phone Call</p>
                  <p className="text-blue-100 text-sm">{subscriber.phone}</p>
                </div>
              </button>
              <button
                onClick={() => window.open(subscriber.socialLinks.email, '_self')}
                className="group flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <div className="p-3 bg-white bg-opacity-20 rounded-full group-hover:animate-spin">
                  <Mail className="h-8 w-8" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">Email</p>
                  <p className="text-purple-100 text-sm">{subscriber.email}</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

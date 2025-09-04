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
  Share
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
  const [activeTab, setActiveTab] = useState<'audio' | 'videos' | 'documents' | 'images'>('audio');
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadSubscriberData();
  }, [slug]);

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
                  <input
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

        {/* Content Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-2xl p-2">
            <nav className="flex space-x-2">
              {[
                { id: 'audio', label: 'Audio', icon: Music, count: subscriber.audioFiles.length, color: 'from-purple-500 to-pink-500', emoji: '🎵' },
                { id: 'videos', label: 'Videos', icon: Video, count: subscriber.videos.length, color: 'from-red-500 to-orange-500', emoji: '🎬' },
                { id: 'documents', label: 'Documents', icon: FileText, count: subscriber.documents.length, color: 'from-blue-500 to-cyan-500', emoji: '📄' },
                { id: 'images', label: 'Images', icon: ImageIcon, count: subscriber.images.length, color: 'from-green-500 to-emerald-500', emoji: '🖼️' }
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
                      >
                        <Play className="h-5 w-5 group-hover/btn:animate-bounce" />
                      </button>
                      <button
                        onClick={() => shareContent('audio', audio)}
                        className="group/btn p-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
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
                      >
                        <ExternalLink className="h-5 w-5 group-hover/btn:animate-pulse" />
                      </button>
                      <button
                        onClick={() => shareContent('video', video)}
                        className="group/btn p-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
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
                      >
                        <ExternalLink className="h-5 w-5 group-hover/btn:animate-pulse" />
                      </button>
                      <button
                        onClick={() => shareContent('document', doc)}
                        className="group/btn p-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
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
                      >
                        <ExternalLink className="h-5 w-5 group-hover/btn:animate-pulse" />
                      </button>
                      <button
                        onClick={() => shareContent('image', image)}
                        className="group/btn p-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                      >
                        <Share className="h-5 w-5 group-hover/btn:animate-pulse" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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

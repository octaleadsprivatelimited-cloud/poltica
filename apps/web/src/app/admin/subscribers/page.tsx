'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input } from '@sarpanch-campaign/ui';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Activity,
  MessageSquare,
  Target,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Users,
  Download,
  Upload,
  Plus,
  X,
  Settings,
  Pause,
  Play,
  Ban
} from 'lucide-react';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  plan: 'Basic' | 'Standard' | 'Premium';
  status: 'Active' | 'Inactive' | 'Suspended' | 'Trial';
  joinDate: string;
  lastActive: string;
  totalCampaigns: number;
  totalMessages: number;
  revenue: number;
  teamSize: number;
  whatsappMessages: number;
  smsMessages: number;
  ivrCalls: number;
  linkClicks: number;
  engagementRate: number;
  avgResponseTime: number;
  subscriptionEnd: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Trial';
  uniqueUrl?: string;
  village?: string;
  district?: string;
  state?: string;
  whatsappNumber?: string;
  campaignFocus?: string;
  messageLimits?: {
    sms: number;
    ivr: number;
    whatsapp: number;
  };
  messageUsage?: {
    sms: number;
    ivr: number;
    whatsapp: number;
  };
  lastResetDate?: string;
}

interface SubscriberStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  trial: number;
  totalRevenue: number;
  monthlyRevenue: number;
  avgEngagement: number;
  totalMessages: number;
  totalCampaigns: number;
}

export default function SubscribersPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    {
      id: 'AP255454',
      name: 'bheemesh',
      email: 'sri@gmail.com',
      phone: '9000045454',
      location: '3-210',
      plan: 'Premium',
      status: 'Active',
      joinDate: '2025-09-04T18:38:35.961Z',
      lastActive: '2025-09-04T18:38:35.961Z',
      totalCampaigns: 0,
      totalMessages: 0,
      revenue: 0,
      teamSize: 20,
      whatsappMessages: 0,
      smsMessages: 0,
      ivrCalls: 0,
      linkClicks: 0,
      engagementRate: 0,
      avgResponseTime: 0,
      subscriptionEnd: '2025-10-04T18:38:35.961Z',
      paymentStatus: 'Trial',
      uniqueUrl: 'https://sarpanch-campaign.com/bheemesh-0ua8wo',
      village: 'Jaggannapeta',
      district: 'East Godavari',
      state: 'Andhra Pradesh',
      whatsappNumber: '9000045454',
      campaignFocus: 'Test Campaign',
      messageLimits: { sms: 25000, ivr: 10000, whatsapp: 5000 },
      messageUsage: { sms: 0, ivr: 0, whatsapp: 0 },
      lastResetDate: '2025-09-04T18:38:35.961Z',
    },
    {
      id: 'MH241234',
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      location: 'Mumbai',
      plan: 'Standard',
      status: 'Active',
      joinDate: '2025-09-04T18:38:35.961Z',
      lastActive: '2025-09-04T18:38:35.961Z',
      totalCampaigns: 5,
      totalMessages: 1000,
      revenue: 5000,
      teamSize: 10,
      whatsappMessages: 800,
      smsMessages: 150,
      ivrCalls: 50,
      linkClicks: 25,
      engagementRate: 15.5,
      avgResponseTime: 2.1,
      subscriptionEnd: '2025-10-04T18:38:35.961Z',
      paymentStatus: 'Paid',
      uniqueUrl: 'https://sarpanch-campaign.com/test-user-abc123',
      village: 'Mumbai City',
      district: 'Mumbai',
      state: 'Maharashtra',
      whatsappNumber: '9876543210',
      campaignFocus: 'Election Campaign',
      messageLimits: { sms: 10000, ivr: 5000, whatsapp: 20000 },
      messageUsage: { sms: 150, ivr: 50, whatsapp: 800 },
      lastResetDate: '2025-09-04T18:38:35.961Z',
    }
  ]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([
    {
      id: 'AP255454',
      name: 'bheemesh',
      email: 'sri@gmail.com',
      phone: '9000045454',
      location: '3-210',
      plan: 'Premium',
      status: 'Active',
      joinDate: '2025-09-04T18:38:35.961Z',
      lastActive: '2025-09-04T18:38:35.961Z',
      totalCampaigns: 0,
      totalMessages: 0,
      revenue: 0,
      teamSize: 20,
      whatsappMessages: 0,
      smsMessages: 0,
      ivrCalls: 0,
      linkClicks: 0,
      engagementRate: 0,
      avgResponseTime: 0,
      subscriptionEnd: '2025-10-04T18:38:35.961Z',
      paymentStatus: 'Trial',
      uniqueUrl: 'https://sarpanch-campaign.com/bheemesh-0ua8wo',
      village: 'Jaggannapeta',
      district: 'East Godavari',
      state: 'Andhra Pradesh',
      whatsappNumber: '9000045454',
      campaignFocus: 'Test Campaign',
      messageLimits: { sms: 25000, ivr: 10000, whatsapp: 5000 },
      messageUsage: { sms: 0, ivr: 0, whatsapp: 0 },
      lastResetDate: '2025-09-04T18:38:35.961Z',
    },
    {
      id: 'MH241234',
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      location: 'Mumbai',
      plan: 'Standard',
      status: 'Active',
      joinDate: '2025-09-04T18:38:35.961Z',
      lastActive: '2025-09-04T18:38:35.961Z',
      totalCampaigns: 5,
      totalMessages: 1000,
      revenue: 5000,
      teamSize: 10,
      whatsappMessages: 800,
      smsMessages: 150,
      ivrCalls: 50,
      linkClicks: 25,
      engagementRate: 15.5,
      avgResponseTime: 2.1,
      subscriptionEnd: '2025-10-04T18:38:35.961Z',
      paymentStatus: 'Paid',
      uniqueUrl: 'https://sarpanch-campaign.com/test-user-abc123',
      village: 'Mumbai City',
      district: 'Mumbai',
      state: 'Maharashtra',
      whatsappNumber: '9876543210',
      campaignFocus: 'Election Campaign',
      messageLimits: { sms: 10000, ivr: 5000, whatsapp: 20000 },
      messageUsage: { sms: 150, ivr: 50, whatsapp: 800 },
      lastResetDate: '2025-09-04T18:38:35.961Z',
    }
  ]);
  const [stats, setStats] = useState<SubscriberStats>({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    trial: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    avgEngagement: 0,
    totalMessages: 0,
    totalCampaigns: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [previousSubscriberCount, setPreviousSubscriberCount] = useState(0);
  const [showNewSubscriberNotification, setShowNewSubscriberNotification] = useState(false);

  const loadSubscribers = async () => {
    console.log('loadSubscribers called');
    try {
      // Fetch subscribers from API
      const response = await fetch('/api/admin/subscribers');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch subscribers');
      }

      const fetchedSubscribers: Subscriber[] = data.subscribers || [];
      console.log('Loaded subscribers from API:', fetchedSubscribers.length);
      
      // Check for new subscribers
      if (previousSubscriberCount > 0 && fetchedSubscribers.length > previousSubscriberCount) {
        const newCount = fetchedSubscribers.length - previousSubscriberCount;
        console.log(`New subscribers detected: ${newCount}`);
        setShowNewSubscriberNotification(true);
        // Auto-hide notification after 5 seconds
        setTimeout(() => setShowNewSubscriberNotification(false), 5000);
      }
      
      setSubscribers(fetchedSubscribers);
      setPreviousSubscriberCount(fetchedSubscribers.length);
      
      // Calculate stats
      const calculatedStats = {
        total: fetchedSubscribers.length,
        active: fetchedSubscribers.filter(s => s.status === 'Active').length,
        inactive: fetchedSubscribers.filter(s => s.status === 'Inactive').length,
        suspended: fetchedSubscribers.filter(s => s.status === 'Suspended').length,
        trial: fetchedSubscribers.filter(s => s.status === 'Trial').length,
        totalRevenue: fetchedSubscribers.reduce((sum, s) => sum + s.revenue, 0),
        monthlyRevenue: fetchedSubscribers.filter(s => s.status === 'Active').reduce((sum, s) => sum + (s.plan === 'Premium' ? 1500 : s.plan === 'Standard' ? 800 : 300), 0),
        avgEngagement: fetchedSubscribers.length > 0 ? fetchedSubscribers.reduce((sum, s) => sum + s.engagementRate, 0) / fetchedSubscribers.length : 0,
        totalMessages: fetchedSubscribers.reduce((sum, s) => sum + s.totalMessages, 0),
        totalCampaigns: fetchedSubscribers.reduce((sum, s) => sum + s.totalCampaigns, 0),
      };
      
      setStats(calculatedStats);
      console.log('Setting loading to false');
      setLoading(false);
    } catch (error) {
      console.error('Error loading subscribers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect called, loading subscribers...');
    console.log('About to call loadSubscribers');
    loadSubscribers().then(() => {
      console.log('loadSubscribers completed');
    }).catch((error) => {
      console.error('loadSubscribers failed:', error);
    });
  }, []);

  // Handle refresh parameter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('refresh') === 'true') {
      console.log('Refresh parameter detected, reloading subscribers...');
      loadSubscribers();
      setLastRefresh(new Date());
      // Remove the refresh parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('Auto-refreshing subscribers...');
      loadSubscribers();
      setLastRefresh(new Date());
    }, 30000);

    // Refresh when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing subscribers...');
        loadSubscribers();
        setLastRefresh(new Date());
      }
    };

    // Refresh when window regains focus
    const handleFocus = () => {
      console.log('Window focused, refreshing subscribers...');
      loadSubscribers();
      setLastRefresh(new Date());
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [autoRefresh]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Generate search suggestions
  useEffect(() => {
    if (searchTerm && searchTerm.length >= 2) {
      const suggestions: string[] = [];
      const termLower = searchTerm.toLowerCase();

      subscribers.forEach(sub => {
        // Add name suggestions
        if (sub.name.toLowerCase().includes(termLower) && !suggestions.includes(sub.name)) {
          suggestions.push(sub.name);
        }
        
        // Add subscriber ID suggestions
        if (sub.id.toLowerCase().includes(termLower) && !suggestions.includes(sub.id)) {
          suggestions.push(sub.id);
        }
        
        // Add phone suggestions
        if (sub.phone.toLowerCase().includes(termLower) && !suggestions.includes(sub.phone)) {
          suggestions.push(sub.phone);
        }
        
        // Add email suggestions
        if (sub.email.toLowerCase().includes(termLower) && !suggestions.includes(sub.email)) {
          suggestions.push(sub.email);
        }
        
        // Add village suggestions
        if (sub.village?.toLowerCase().includes(termLower) && !suggestions.includes(sub.village)) {
          suggestions.push(sub.village);
        }
        
        // Add WhatsApp suggestions
        if (sub.whatsappNumber?.toLowerCase().includes(termLower) && !suggestions.includes(sub.whatsappNumber)) {
          suggestions.push(sub.whatsappNumber);
        }
        
        // Add district suggestions
        if (sub.district?.toLowerCase().includes(termLower) && !suggestions.includes(sub.district)) {
          suggestions.push(sub.district);
        }
        
        // Add state suggestions
        if (sub.state?.toLowerCase().includes(termLower) && !suggestions.includes(sub.state)) {
          suggestions.push(sub.state);
        }
      });

      setSearchSuggestions(suggestions.slice(0, 5)); // Limit to 5 suggestions
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm, subscribers]);

  const loadDemoData = () => {
    // Enhanced demo data for subscribers
    const demoSubscribers: Subscriber[] = [
      {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh@village-a.com',
        phone: '+91 98765 43210',
        location: 'Village A, District X, State Y',
        plan: 'Premium',
        status: 'Active',
        joinDate: '2024-01-15',
        lastActive: '2024-09-04',
        totalCampaigns: 12,
        totalMessages: 45000,
        revenue: 15000,
        teamSize: 8,
        whatsappMessages: 40000,
        smsMessages: 4000,
        ivrCalls: 1000,
        linkClicks: 2500,
        engagementRate: 18.5,
        avgResponseTime: 2.3,
        subscriptionEnd: '2024-10-15',
        paymentStatus: 'Paid',
      },
      {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya@village-b.com',
        phone: '+91 98765 43211',
        location: 'Village B, District Y, State Y',
        plan: 'Standard',
        status: 'Active',
        joinDate: '2024-02-20',
        lastActive: '2024-09-03',
        totalCampaigns: 8,
        totalMessages: 25000,
        revenue: 6000,
        teamSize: 5,
        whatsappMessages: 22000,
        smsMessages: 2500,
        ivrCalls: 500,
        linkClicks: 1200,
        engagementRate: 15.2,
        avgResponseTime: 3.1,
        subscriptionEnd: '2024-11-20',
        paymentStatus: 'Paid',
      },
      {
        id: '3',
        name: 'Amit Patel',
        email: 'amit@village-c.com',
        phone: '+91 98765 43212',
        location: 'Village C, District Z, State Y',
        plan: 'Premium',
        status: 'Active',
        joinDate: '2024-03-10',
        lastActive: '2024-09-04',
        totalCampaigns: 15,
        totalMessages: 60000,
        revenue: 18000,
        teamSize: 10,
        whatsappMessages: 55000,
        smsMessages: 4000,
        ivrCalls: 1000,
        linkClicks: 3200,
        engagementRate: 22.1,
        avgResponseTime: 1.8,
        subscriptionEnd: '2024-12-10',
        paymentStatus: 'Paid',
      },
      {
        id: '4',
        name: 'Sunita Devi',
        email: 'sunita@village-d.com',
        phone: '+91 98765 43213',
        location: 'Village D, District X, State Y',
        plan: 'Basic',
        status: 'Inactive',
        joinDate: '2024-04-05',
        lastActive: '2024-08-15',
        totalCampaigns: 3,
        totalMessages: 8000,
        revenue: 1500,
        teamSize: 2,
        whatsappMessages: 7000,
        smsMessages: 800,
        ivrCalls: 200,
        linkClicks: 300,
        engagementRate: 8.5,
        avgResponseTime: 5.2,
        subscriptionEnd: '2024-09-05',
        paymentStatus: 'Pending',
      },
      {
        id: '5',
        name: 'Vikram Singh',
        email: 'vikram@village-e.com',
        phone: '+91 98765 43214',
        location: 'Village E, District Y, State Y',
        plan: 'Standard',
        status: 'Suspended',
        joinDate: '2024-05-12',
        lastActive: '2024-08-20',
        totalCampaigns: 5,
        totalMessages: 15000,
        revenue: 3000,
        teamSize: 3,
        whatsappMessages: 13000,
        smsMessages: 1500,
        ivrCalls: 500,
        linkClicks: 600,
        engagementRate: 12.3,
        avgResponseTime: 4.1,
        subscriptionEnd: '2024-10-12',
        paymentStatus: 'Failed',
      },
      {
        id: '6',
        name: 'Meera Joshi',
        email: 'meera@village-f.com',
        phone: '+91 98765 43215',
        location: 'Village F, District Z, State Y',
        plan: 'Premium',
        status: 'Trial',
        joinDate: '2024-08-25',
        lastActive: '2024-09-04',
        totalCampaigns: 2,
        totalMessages: 5000,
        revenue: 0,
        teamSize: 4,
        whatsappMessages: 4500,
        smsMessages: 400,
        ivrCalls: 100,
        linkClicks: 150,
        engagementRate: 16.8,
        avgResponseTime: 2.8,
        subscriptionEnd: '2024-09-25',
        paymentStatus: 'Trial',
      },
    ];

    setSubscribers(demoSubscribers);
    
    // Calculate stats
    const calculatedStats = {
      total: demoSubscribers.length,
      active: demoSubscribers.filter(s => s.status === 'Active').length,
      inactive: demoSubscribers.filter(s => s.status === 'Inactive').length,
      suspended: demoSubscribers.filter(s => s.status === 'Suspended').length,
      trial: demoSubscribers.filter(s => s.status === 'Trial').length,
      totalRevenue: demoSubscribers.reduce((sum, s) => sum + s.revenue, 0),
      monthlyRevenue: demoSubscribers.filter(s => s.status === 'Active').reduce((sum, s) => sum + (s.plan === 'Premium' ? 1500 : s.plan === 'Standard' ? 800 : 300), 0),
      avgEngagement: demoSubscribers.reduce((sum, s) => sum + s.engagementRate, 0) / demoSubscribers.length,
      totalMessages: demoSubscribers.reduce((sum, s) => sum + s.totalMessages, 0),
      totalCampaigns: demoSubscribers.reduce((sum, s) => sum + s.totalCampaigns, 0),
    };
    
    setStats(calculatedStats);
  };

  const filterSubscribers = useCallback(() => {
    console.log('filterSubscribers called, subscribers count:', subscribers.length);
    let filtered = [...subscribers];

    // Enhanced search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(sub => {
        // Search in multiple fields
        const nameMatch = sub.name.toLowerCase().includes(searchLower);
        const emailMatch = sub.email.toLowerCase().includes(searchLower);
        const phoneMatch = sub.phone.toLowerCase().includes(searchLower);
        const locationMatch = sub.location.toLowerCase().includes(searchLower);
        const subscriberIdMatch = sub.id.toLowerCase().includes(searchLower);
        const villageMatch = sub.village?.toLowerCase().includes(searchLower) || false;
        const districtMatch = sub.district?.toLowerCase().includes(searchLower) || false;
        const stateMatch = sub.state?.toLowerCase().includes(searchLower) || false;
        const whatsappMatch = sub.whatsappNumber?.toLowerCase().includes(searchLower) || false;
        
        // Also search in campaign focus
        const campaignMatch = sub.campaignFocus?.toLowerCase().includes(searchLower) || false;
        
        return nameMatch || emailMatch || phoneMatch || locationMatch || 
               subscriberIdMatch || villageMatch || districtMatch || 
               stateMatch || whatsappMatch || campaignMatch;
      });
    }

    // Plan filter
    if (filterPlan !== 'all') {
      filtered = filtered.filter(sub => sub.plan === filterPlan);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(sub => sub.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'revenue':
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case 'messages':
          aValue = a.totalMessages;
          bValue = b.totalMessages;
          break;
        case 'engagement':
          aValue = a.engagementRate;
          bValue = b.engagementRate;
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate);
          bValue = new Date(b.joinDate);
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    console.log('filteredSubscribers set to:', filtered.length);
    setFilteredSubscribers(filtered);
  }, [subscribers, debouncedSearchTerm, filterPlan, filterStatus, sortBy, sortOrder]);

  // Call filterSubscribers when dependencies change
  useEffect(() => {
    filterSubscribers();
  }, [filterSubscribers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      case 'Trial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRemainingLimits = (subscriber: Subscriber) => {
    if (!subscriber.messageLimits || !subscriber.messageUsage) {
      return { sms: 0, ivr: 0, whatsapp: 0 };
    }
    
    return {
      sms: Math.max(0, subscriber.messageLimits.sms - subscriber.messageUsage.sms),
      ivr: Math.max(0, subscriber.messageLimits.ivr - subscriber.messageUsage.ivr),
      whatsapp: Math.max(0, subscriber.messageLimits.whatsapp - subscriber.messageUsage.whatsapp),
    };
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min(100, (used / limit) * 100);
  };


  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Trial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  console.log('Component rendering, loading:', loading, 'subscribers count:', subscribers.length, 'filteredSubscribers count:', filteredSubscribers.length);
  
  // Temporarily disable loading state for testing
  // if (loading) {
  //   console.log('Showing loading state');
  //   return (
  //     <div className="space-y-6">
  //       <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
  //       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  //         {[...Array(4)].map((_, i) => (
  //           <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
  //         ))}
  //       </div>
  //       <div className="space-y-4">
  //         {[...Array(5)].map((_, i) => (
  //           <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriber Management</h1>
          <p className="text-gray-600">Comprehensive management of sarpanch subscribers and their analytics</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              loadSubscribers();
              setLastRefresh(new Date());
            }}
          >
            <Activity className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Zap className="mr-2 h-4 w-4" />
            {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => router.push('/admin/add-subscriber')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subscriber
          </Button>
        </div>
      </div>

      {/* New Subscriber Notification */}
      {showNewSubscriberNotification && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                New subscriber(s) added! The list has been updated automatically.
              </span>
            </div>
            <button
              onClick={() => setShowNewSubscriberNotification(false)}
              className="text-green-600 hover:text-green-800"
              title="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Auto-refresh Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-blue-800">
              {autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'} • 
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
          <div className="text-xs text-blue-600">
            {autoRefresh ? 'Refreshes every 30 seconds' : 'Click refresh button to update'}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active, {stats.trial} trial
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ₹{stats.totalRevenue.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCampaigns} campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgEngagement.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all subscribers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, ID, phone, email, location..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-10 pr-10"
              />
              
              {/* Clear Search Button */}
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center gap-2">
                        <Search className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-700">{suggestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by subscription plan"
            >
              <option value="all">All Plans</option>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
              <option value="Trial">Trial</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Sort by"
            >
              <option value="name">Sort by Name</option>
              <option value="revenue">Sort by Revenue</option>
              <option value="messages">Sort by Messages</option>
              <option value="engagement">Sort by Engagement</option>
              <option value="joinDate">Sort by Join Date</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Sort order"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results Info */}
      {debouncedSearchTerm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Showing {filteredSubscribers.length} of {subscribers.length} subscriber{filteredSubscribers.length !== 1 ? 's' : ''} matching "{debouncedSearchTerm}"
              </span>
            </div>
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              title="Clear search"
            >
              <X className="h-3 w-3" />
              Clear search
            </button>
          </div>
        </div>
      )}

      {/* Subscribers List */}
      <div className="space-y-4">
        {filteredSubscribers.length === 0 && debouncedSearchTerm ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No subscribers found</h3>
              <p className="text-gray-500 mb-4">
                No subscribers match your search for "{debouncedSearchTerm}". Try a different search term.
              </p>
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 font-medium"
                title="Clear search to see all subscribers"
              >
                Clear search to see all subscribers
              </button>
            </CardContent>
          </Card>
        ) : (
          filteredSubscribers.map((subscriber) => (
          <Card key={subscriber.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-blue-600">
                        {subscriber.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Subscriber ID in blue text inside green box */}
                    <div className="mb-2">
                      <div className="inline-block bg-green-100 border border-green-200 rounded-md px-2 py-1">
                        <span className="text-sm font-bold text-blue-600 font-mono">
                          {debouncedSearchTerm ? highlightText(subscriber.id, debouncedSearchTerm) : subscriber.id}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {debouncedSearchTerm ? highlightText(subscriber.name, debouncedSearchTerm) : subscriber.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(subscriber.status)}`}>
                        {subscriber.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(subscriber.plan)}`}>
                        {subscriber.plan}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(subscriber.paymentStatus)}`}>
                        {subscriber.paymentStatus}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {subscriber.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {subscriber.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {subscriber.location}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{subscriber.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {subscriber.totalMessages.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Messages</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {subscriber.engagementRate}%
                    </div>
                    <div className="text-xs text-gray-500">Engagement</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedSubscriber(subscriber)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Detailed Stats Row */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                  <span>WhatsApp: {subscriber.whatsappMessages.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-500" />
                  <span>SMS: {subscriber.smsMessages.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-purple-500" />
                  <span>IVR: {subscriber.ivrCalls.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2 text-orange-500" />
                  <span>Clicks: {subscriber.linkClicks.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Response: {subscriber.avgResponseTime}h</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Team: {subscriber.teamSize}</span>
                </div>
              </div>

              {/* Message Limits Row */}
              {subscriber.messageLimits && subscriber.messageUsage && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Message Limits & Usage</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* SMS Limits */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">SMS</span>
                        <span className="text-sm font-medium">
                          {subscriber.messageUsage.sms.toLocaleString()} / {subscriber.messageLimits.sms.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            getUsagePercentage(subscriber.messageUsage.sms, subscriber.messageLimits.sms) > 90 
                              ? 'bg-red-500' 
                              : getUsagePercentage(subscriber.messageUsage.sms, subscriber.messageLimits.sms) > 75 
                              ? 'bg-yellow-500' 
                              : 'bg-blue-500'
                          }`}
                          style={{ 
                            width: `${getUsagePercentage(subscriber.messageUsage.sms, subscriber.messageLimits.sms)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Remaining: {getRemainingLimits(subscriber).sms.toLocaleString()}
                      </div>
                    </div>

                    {/* IVR Limits */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">IVR</span>
                        <span className="text-sm font-medium">
                          {subscriber.messageUsage.ivr.toLocaleString()} / {subscriber.messageLimits.ivr.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            getUsagePercentage(subscriber.messageUsage.ivr, subscriber.messageLimits.ivr) > 90 
                              ? 'bg-red-500' 
                              : getUsagePercentage(subscriber.messageUsage.ivr, subscriber.messageLimits.ivr) > 75 
                              ? 'bg-yellow-500' 
                              : 'bg-purple-500'
                          }`}
                          style={{ 
                            width: `${getUsagePercentage(subscriber.messageUsage.ivr, subscriber.messageLimits.ivr)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Remaining: {getRemainingLimits(subscriber).ivr.toLocaleString()}
                      </div>
                    </div>

                    {/* WhatsApp Limits */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">WhatsApp</span>
                        <span className="text-sm font-medium">
                          {subscriber.messageUsage.whatsapp.toLocaleString()} / {subscriber.messageLimits.whatsapp.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            getUsagePercentage(subscriber.messageUsage.whatsapp, subscriber.messageLimits.whatsapp) > 90 
                              ? 'bg-red-500' 
                              : getUsagePercentage(subscriber.messageUsage.whatsapp, subscriber.messageLimits.whatsapp) > 75 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${getUsagePercentage(subscriber.messageUsage.whatsapp, subscriber.messageLimits.whatsapp)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Remaining: {getRemainingLimits(subscriber).whatsapp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Subscriber Detail Modal */}
      {selectedSubscriber && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedSubscriber.name}</CardTitle>
                  <CardDescription>{selectedSubscriber.email}</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedSubscriber(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <p className="text-sm text-gray-600">Phone: {selectedSubscriber.phone}</p>
                  <p className="text-sm text-gray-600">Location: {selectedSubscriber.location}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Account Details</h4>
                  <p className="text-sm text-gray-600">Plan: {selectedSubscriber.plan}</p>
                  <p className="text-sm text-gray-600">Status: {selectedSubscriber.status}</p>
                  <p className="text-sm text-gray-600">Payment: {selectedSubscriber.paymentStatus}</p>
                </div>
              </div>

              {/* Communication Stats */}
              <div>
                <h4 className="font-medium mb-4">Communication Analytics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{selectedSubscriber.whatsappMessages.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">WhatsApp</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <Mail className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{selectedSubscriber.smsMessages.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">SMS</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <Phone className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{selectedSubscriber.ivrCalls.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">IVR Calls</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <Target className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <div className="text-2xl font-bold">{selectedSubscriber.linkClicks.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Link Clicks</div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="font-medium mb-4">Performance Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold">{selectedSubscriber.engagementRate}%</div>
                    <div className="text-sm text-gray-500">Engagement Rate</div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold">{selectedSubscriber.avgResponseTime}h</div>
                    <div className="text-sm text-gray-500">Avg Response Time</div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold">{selectedSubscriber.totalCampaigns}</div>
                    <div className="text-sm text-gray-500">Total Campaigns</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sarpanch-campaign/ui';
import { supabase, TABLES } from '@sarpanch-campaign/lib';

interface DashboardStats {
  tasksToday: number;
  activeMembers: number;
  eventsToday: number;
  expensesThisWeek: number;
  totalAudience: number;
  campaignsActive: number;
  dispatchesSent: number;
  clickRate: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    tasksToday: 0,
    activeMembers: 0,
    eventsToday: 0,
    expensesThisWeek: 0,
    totalAudience: 0,
    campaignsActive: 0,
    dispatchesSent: 0,
    clickRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Demo data for demonstration
      const demoStats = {
        tasksToday: 5,
        activeMembers: 3,
        eventsToday: 2,
        expensesThisWeek: 8,
        totalAudience: 7000,
        campaignsActive: 1,
        dispatchesSent: 1250,
        clickRate: 12.5,
      };

      // Check if we're in demo mode (no real Supabase connection)
      if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co') {
        setStats(demoStats);
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

      // Load tasks due today
      const { count: tasksToday } = await supabase
        .from(TABLES.TASKS)
        .select('*', { count: 'exact', head: true })
        .eq('due_date', today);

      // Load active members (last 6 hours)
      const { count: activeMembers } = await supabase
        .from(TABLES.CHECKINS)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixHoursAgo);

      // Load events today
      const { count: eventsToday } = await supabase
        .from(TABLES.EVENTS)
        .select('*', { count: 'exact', head: true })
        .eq('start_time', today);

      // Load expenses this week
      const { count: expensesThisWeek } = await supabase
        .from(TABLES.EXPENSES)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo);

      // Load audience count
      const { count: totalAudience } = await supabase
        .from(TABLES.AUDIENCE)
        .select('*', { count: 'exact', head: true });

      // Load active campaigns
      const { count: campaignsActive } = await supabase
        .from(TABLES.CAMPAIGNS)
        .select('*', { count: 'exact', head: true })
        .not('start_at', 'is', null);

      // Load dispatches sent
      const { count: dispatchesSent } = await supabase
        .from(TABLES.DISPATCHES)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'sent');

      // Load unique links for click rate
      const { data: uniqueLinks } = await supabase
        .from(TABLES.UNIQUE_LINKS)
        .select('clicks');

      const totalClicks = uniqueLinks?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;
      const clickRate = dispatchesSent ? (totalClicks / dispatchesSent) * 100 : 0;

      setStats({
        tasksToday: tasksToday || 0,
        activeMembers: activeMembers || 0,
        eventsToday: eventsToday || 0,
        expensesThisWeek: expensesThisWeek || 0,
        totalAudience: totalAudience || 0,
        campaignsActive: campaignsActive || 0,
        dispatchesSent: dispatchesSent || 0,
        clickRate: Math.round(clickRate * 100) / 100,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to demo data on error
      setStats({
        tasksToday: 5,
        activeMembers: 3,
        eventsToday: 2,
        expensesThisWeek: 8,
        totalAudience: 7000,
        campaignsActive: 1,
        dispatchesSent: 1250,
        clickRate: 12.5,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasksToday}</div>
            <p className="text-xs text-muted-foreground">
              Due today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              Last 6 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.eventsToday}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expensesThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Submitted
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAudience.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Villagers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.campaignsActive}</div>
            <p className="text-xs text-muted-foreground">
              Running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dispatchesSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clickRate}%</div>
            <p className="text-xs text-muted-foreground">
              Engagement
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

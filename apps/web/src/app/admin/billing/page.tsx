'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@sarpanch-campaign/ui';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface BillingData {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  upcomingPayments: number;
  overduePayments: number;
}

interface Payment {
  id: string;
  subscriber: string;
  amount: number;
  plan: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Failed';
  dueDate: string;
  paidDate?: string;
  method: string;
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState<BillingData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    activeSubscriptions: 0,
    churnRate: 0,
    averageRevenuePerUser: 0,
    upcomingPayments: 0,
    overduePayments: 0,
  });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    // Demo billing data
    const demoBillingData: BillingData = {
      totalRevenue: 450000,
      monthlyRevenue: 22500,
      yearlyRevenue: 270000,
      activeSubscriptions: 38,
      churnRate: 5.2,
      averageRevenuePerUser: 11842,
      upcomingPayments: 18750,
      overduePayments: 2250,
    };

    const demoPayments: Payment[] = [
      {
        id: '1',
        subscriber: 'Rajesh Kumar',
        amount: 5000,
        plan: 'Premium',
        status: 'Paid',
        dueDate: '2024-09-01',
        paidDate: '2024-09-01',
        method: 'UPI',
      },
      {
        id: '2',
        subscriber: 'Priya Sharma',
        amount: 2000,
        plan: 'Standard',
        status: 'Paid',
        dueDate: '2024-09-01',
        paidDate: '2024-09-01',
        method: 'Bank Transfer',
      },
      {
        id: '3',
        subscriber: 'Amit Patel',
        amount: 5000,
        plan: 'Premium',
        status: 'Pending',
        dueDate: '2024-09-15',
        method: 'Credit Card',
      },
      {
        id: '4',
        subscriber: 'Sunita Devi',
        amount: 500,
        plan: 'Basic',
        status: 'Overdue',
        dueDate: '2024-08-15',
        method: 'UPI',
      },
      {
        id: '5',
        subscriber: 'Vikram Singh',
        amount: 2000,
        plan: 'Standard',
        status: 'Failed',
        dueDate: '2024-09-01',
        method: 'Credit Card',
      },
    ];

    setBillingData(demoBillingData);
    setPayments(demoPayments);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Failed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Overdue': return <AlertCircle className="h-4 w-4" />;
      case 'Failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Billing & Revenue</h1>
          <p className="text-gray-600">Manage subscriptions, payments, and revenue analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Process Payments
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{billingData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{billingData.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARPU</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{billingData.averageRevenuePerUser.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Average per user
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Payments</CardTitle>
            <CardDescription>Due in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              ₹{billingData.upcomingPayments.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              12 payments expected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overdue Payments</CardTitle>
            <CardDescription>Past due date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              ₹{billingData.overduePayments.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              3 payments overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Churn Rate</CardTitle>
            <CardDescription>Monthly churn rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {billingData.churnRate}%
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Latest payment transactions and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(payment.status)}
                  </div>
                  <div>
                    <p className="font-medium">{payment.subscriber}</p>
                    <p className="text-sm text-gray-500">{payment.plan} Plan</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{payment.method}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {payment.status === 'Pending' && (
                      <Button size="sm">
                        Process
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Monthly revenue over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Revenue chart would be displayed here</p>
              <p className="text-sm text-gray-400">Integration with charting library needed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

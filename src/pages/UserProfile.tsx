
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/use-user-settings';
import { useAccount } from '@/hooks/use-account';
import { useInvestments } from '@/hooks/use-investments';
import { useWatchlist } from '@/hooks/use-watchlist';
import { useTransactions } from '@/hooks/use-transactions';
import { useLearningProgress } from '@/hooks/use-learning-progress';
import { useAccountReset } from '@/hooks/use-account-reset';
import Navigation from '@/components/Navigation';
import AnimatedTransition from '@/components/AnimatedTransition';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User, Pencil, Save, AlertCircle, Check, Shield, ChevronRight,
  Wallet, LineChart, Clock, BookOpen, Bell, Lock, RefreshCw,
  ArrowUpRight, Star, Trash2, BarChart3, History, Settings,
  LogOut, AlertTriangle, ExternalLink, BadgeCheck, PlayCircle,
  Newspaper, Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { mockStocks } from '@/utils/mockData';

const UserProfile = () => {
  const { user } = useAuth();
  const { settings, updateSettings, isLoading: isSettingsLoading } = useUserSettings();
  const { balance, isLoading: isBalanceLoading } = useAccount();
  const { investments, isLoading: isInvestmentsLoading } = useInvestments();
  const { watchlistStocks, isLoading: isWatchlistLoading } = useWatchlist();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();
  const { progress, isLoading: isLearningLoading } = useLearningProgress();
  const { resetAccount, isResetting } = useAccountReset();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // KYC verification states
  const [panNumber, setPanNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isKycSubmitting, setIsKycSubmitting] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);

  React.useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, settings]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      // Fetch basic profile info
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url || '');
      }

      // Get KYC info from settings
      if (settings && settings.notification_preferences && settings.notification_preferences.kyc_data) {
        const kycInfo = settings.notification_preferences.kyc_data;
        console.log('KYC Info from settings:', kycInfo);

        setKycVerified(kycInfo.verified || false);

        if (kycInfo.verified) {
          setPanNumber(kycInfo.pan_number || '');
          setMobileNumber(kycInfo.mobile_number || '');
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNotification = async (key: 'price_alerts' | 'order_updates' | 'market_news') => {
    if (!settings) return;

    const newPreferences = {
      ...settings.notification_preferences,
      [key]: !settings.notification_preferences[key]
    };

    await updateSettings({ notification_preferences: newPreferences });
  };

  const handleVerifyKyc = async () => {
    if (!user) return;

    if (!panNumber || !mobileNumber) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Please fill in all required fields",
      });
      return;
    }

    // Validate PAN (simple validation for demo)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber)) {
      toast({
        variant: "destructive",
        title: "Invalid PAN",
        description: "Please enter a valid 10-character PAN number",
      });
      return;
    }

    // Validate mobile (simple validation for demo)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNumber)) {
      toast({
        variant: "destructive",
        title: "Invalid mobile number",
        description: "Please enter a valid 10-digit mobile number",
      });
      return;
    }

    setIsKycSubmitting(true);

    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get current notification preferences
      const currentPrefs = settings?.notification_preferences || {
        price_alerts: true,
        order_updates: true,
        market_news: true
      };

      // Add KYC data to notification preferences
      const updatedPrefs = {
        ...currentPrefs,
        kyc_data: {
          verified: true,
          pan_number: panNumber,
          mobile_number: mobileNumber,
          verified_at: new Date().toISOString()
        }
      };

      // Use the updateSettings function from the useUserSettings hook
      const result = await updateSettings({
        notification_preferences: updatedPrefs
      });

      if (!result.success) {
        throw new Error('Failed to update KYC data');
      }

      // Update local state
      setKycVerified(true);

      toast({
        title: "Verification successful",
        description: "Your identity has been verified successfully",
      });
    } catch (error) {
      console.error('Error updating KYC status:', error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "There was an error updating your verification status",
      });
    } finally {
      setIsKycSubmitting(false);
    }
  };

  // Helper functions
  const calculatePortfolioValue = () => {
    if (!investments || investments.length === 0) return 0;

    return investments.reduce((total, inv) => {
      const stock = mockStocks.find(s => s.ticker === inv.ticker);
      return total + (stock ? stock.price * inv.shares : 0);
    }, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // We'll use a different approach for the progress bar

  const handleResetAccount = async () => {
    const result = await resetAccount();
    if (result.success) {
      setIsResetDialogOpen(false);
    }
  };

  // Calculate portfolio value and other derived data
  const portfolioValue = calculatePortfolioValue();
  const totalValue = (balance?.cash_balance || 0) + portfolioValue;

  // Format recent transactions
  const recentTransactions = transactions
    .slice(0, 5)
    .map(tx => {
      let type = tx.type;
      let ticker = '';
      let shares = '';
      let price = '';

      if (tx.description && (tx.type === 'buy' || tx.type === 'sell')) {
        const match = tx.description?.match(/(\d+) shares of ([A-Z]+)/);
        if (match) {
          shares = match[1];
          ticker = match[2];
        }
        price = `$${(tx.amount / parseFloat(shares || '1')).toFixed(2)}`;
      }

      return {
        id: tx.id,
        type,
        ticker,
        date: format(new Date(tx.created_at), 'MMM d, yyyy'),
        price,
        shares,
        amount: tx.amount,
      };
    });

  const isLoading = isSettingsLoading || isBalanceLoading || isInvestmentsLoading ||
                   isWatchlistLoading || isTransactionsLoading || isLearningLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">User Profile</h1>
              <p className="text-muted-foreground">Manage your account information and preferences</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 max-w-3xl">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="investments">Investments</TabsTrigger>
                <TabsTrigger value="learning">Learning</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="verification">KYC</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Card className="overflow-hidden">
                      <div className="bg-gradient-to-r from-primary/20 to-primary/10 h-32 relative">
                        {kycVerified && (
                          <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
                            <BadgeCheck className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-center -mt-16">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                          <AvatarImage src={avatarUrl} alt={fullName} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                            {fullName ? fullName.charAt(0).toUpperCase() : <User />}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <CardContent className="text-center pt-4">
                        <h3 className="text-2xl font-bold">{fullName || "Your Name"}</h3>
                        <p className="text-muted-foreground">{email}</p>

                        <div className="mt-6 flex justify-center">
                          {!isEditing ? (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit Profile
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                              Cancel
                            </Button>
                          )}
                        </div>
                      </CardContent>
                      <div className="border-t border-border px-6 py-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <BadgeCheck className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium">Verification Status</span>
                          </div>
                          <span className={`text-sm font-medium ${kycVerified ? 'text-green-500' : 'text-amber-500'}`}>
                            {kycVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </Card>

                    <Card className="mt-6">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Account Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                              <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground">Cash Balance</div>
                              <div className="font-semibold">{formatCurrency(balance?.cash_balance || 0)}</div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                              <LineChart className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground">Investments</div>
                              <div className="font-semibold">{investments.length} Active</div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-3">
                              <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground">Watchlist</div>
                              <div className="font-semibold">{watchlistStocks.length} Stocks</div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                              <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground">Learning</div>
                              <div className="font-semibold">{progress.completionPercentage.toFixed(0)}% Complete</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal information</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <div className="space-y-6">
                            <div>
                              <Label htmlFor="fullName">Full Name</Label>
                              <Input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                value={email}
                                disabled
                                className="mt-1 bg-muted"
                              />
                              <p className="text-sm text-muted-foreground mt-1">
                                Email cannot be changed
                              </p>
                            </div>

                            <div>
                              <Label htmlFor="avatar">Profile Picture</Label>
                              <div className="mt-1 flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={avatarUrl} alt={fullName} />
                                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                    {fullName ? fullName.charAt(0).toUpperCase() : <User />}
                                  </AvatarFallback>
                                </Avatar>
                                <Button variant="outline" disabled>
                                  Change Avatar
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">
                                Avatar upload functionality coming soon
                              </p>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                              <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={updateProfile}
                                disabled={isSaving}
                              >
                                {isSaving ? (
                                  <>
                                    <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent animate-spin"></div>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Full Name</div>
                                <div className="font-medium text-lg">{fullName || "Not set"}</div>
                              </div>

                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Email</div>
                                <div className="font-medium text-lg">{email}</div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                              <h3 className="text-lg font-medium mb-4">Account Summary</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-primary/5 rounded-lg p-4">
                                  <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
                                  <div className="font-bold text-2xl mt-1">{formatCurrency(totalValue)}</div>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    <Clock className="inline h-3 w-3 mr-1" />
                                    Last updated: {new Date().toLocaleString()}
                                  </div>
                                </div>

                                <div className="bg-primary/5 rounded-lg p-4">
                                  <div className="text-sm text-muted-foreground">Learning Progress</div>
                                  <div className="mt-2">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-medium">{progress.completionPercentage.toFixed(0)}% Complete</span>
                                    </div>
                                    <Progress value={progress.completionPercentage} className="h-2" />
                                  </div>
                                  <div className="text-xs mt-2">
                                    {progress.completedResources} of {progress.totalResources} resources completed
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button className="w-full" variant="outline" asChild>
                        <Link to="/dashboard">
                          <LineChart className="mr-2 h-4 w-4" />
                          Go to Dashboard
                        </Link>
                      </Button>
                      <Button className="w-full" variant="outline" asChild>
                        <Link to="/learning">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Continue Learning
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="investments">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-blue-800 dark:text-blue-300">Cash Balance</h3>
                          <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                          {formatCurrency(balance?.cash_balance || 0)}
                        </div>
                        <div className="mt-4 text-xs text-blue-700 dark:text-blue-300">
                          Available for investments
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20 border-green-200 dark:border-green-800">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-green-800 dark:text-green-300">Invested Amount</h3>
                          <LineChart className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                          {formatCurrency(portfolioValue)}
                        </div>
                        <div className="mt-4 text-xs text-green-700 dark:text-green-300">
                          {investments.length} active investments
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-purple-800 dark:text-purple-300">Total Portfolio</h3>
                          <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                          {formatCurrency(totalValue)}
                        </div>
                        <div className="mt-4 text-xs text-purple-700 dark:text-purple-300">
                          <Clock className="inline h-3 w-3 mr-1" />
                          Last updated: {new Date().toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle>Your Investments</CardTitle>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to="/dashboard">
                              View All
                              <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                        <CardDescription>Active investment holdings</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {investments.length > 0 ? (
                          <div className="space-y-4">
                            {investments.slice(0, 4).map((inv, index) => {
                              const stock = mockStocks.find(s => s.ticker === inv.ticker);
                              const value = stock ? stock.price * inv.shares : 0;
                              const allocationPercentage = ((value / (portfolioValue || 1)) * 100).toFixed(1);

                              return (
                                <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-sm font-semibold mr-3">
                                      {inv.ticker.substring(0, 2)}
                                    </div>
                                    <div>
                                      <div className="font-medium">{inv.ticker}</div>
                                      <div className="text-sm text-muted-foreground">{inv.shares.toLocaleString()} shares</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">{formatCurrency(value)}</div>
                                    <div className="text-xs text-muted-foreground">{allocationPercentage}% of portfolio</div>
                                  </div>
                                </div>
                              );
                            })}

                            {investments.length > 4 && (
                              <div className="text-center pt-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to="/dashboard">
                                    View {investments.length - 4} more investments
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 px-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                              <LineChart className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium mb-1">No investments yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Start your investment journey by buying your first stock
                            </p>
                            <Button asChild>
                              <Link to="/stocks/AAPL">
                                Explore Stocks
                              </Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle>Watchlist</CardTitle>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to="/dashboard?tab=watchlist">
                              View All
                              <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                        <CardDescription>Stocks you're monitoring</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {watchlistStocks.length > 0 ? (
                          <div className="space-y-4">
                            {watchlistStocks.slice(0, 4).map(stock => (
                              <div key={stock.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-sm font-semibold mr-3">
                                    {stock.ticker.substring(0, 2)}
                                  </div>
                                  <div>
                                    <div className="font-medium">{stock.ticker}</div>
                                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">${stock.price.toFixed(2)}</div>
                                  <div className={`text-xs ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                  </div>
                                </div>
                              </div>
                            ))}

                            {watchlistStocks.length > 4 && (
                              <div className="text-center pt-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to="/dashboard?tab=watchlist">
                                    View {watchlistStocks.length - 4} more stocks
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 px-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                              <Star className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium mb-1">Your watchlist is empty</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Add stocks to your watchlist to monitor their performance
                            </p>
                            <Button asChild>
                              <Link to="/stocks/AAPL">
                                Browse Stocks
                              </Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-center">
                    <Button size="lg" className="px-8" asChild>
                      <Link to="/dashboard">
                        Go to Full Dashboard
                        <ArrowUpRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="learning">
                <div className="space-y-6">
                  <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h2 className="text-2xl font-bold mb-1">Your Learning Journey</h2>
                          <p className="text-white/80">Continue building your investment knowledge</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                          <div className="text-3xl font-bold">{progress.completionPercentage.toFixed(0)}%</div>
                          <div className="text-xs text-white/80">Completion</div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <Progress value={progress.completionPercentage} className="h-full bg-white" />
                        </div>
                        <div className="flex justify-between text-xs mt-2 text-white/80">
                          <span>{progress.completedResources} completed</span>
                          <span>{progress.totalResources - progress.completedResources} remaining</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {progress.lastAccessedResource && (
                      <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            Continue Learning
                          </CardTitle>
                          <CardDescription>Pick up where you left off</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
                            <h3 className="font-medium text-lg mb-1">{progress.lastAccessedResource}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Last accessed on {new Date(progress.lastAccessedDate || '').toLocaleDateString()}
                            </p>
                            <Button className="w-full" asChild>
                              <Link to="/learning">
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Continue
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card className="border-l-4 border-l-purple-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                            <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          Your Interests
                        </CardTitle>
                        <CardDescription>Topics you're focusing on</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {progress.favoriteTopics.map((topic, index) => (
                            <div
                              key={index}
                              className="bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full text-sm font-medium"
                            >
                              {topic}
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/learning">
                            Explore More Topics
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Resources</CardTitle>
                      <CardDescription>Based on your learning progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                          <div className="flex items-center mb-3">
                            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                              <Newspaper className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">ARTICLE</span>
                          </div>
                          <h3 className="font-medium mb-1">Understanding Market Trends</h3>
                          <p className="text-xs text-muted-foreground mb-2">Learn how to identify and analyze market trends</p>
                          <div className="text-xs text-muted-foreground">10 min read</div>
                        </div>

                        <div className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                          <div className="flex items-center mb-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                              <PlayCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">VIDEO</span>
                          </div>
                          <h3 className="font-medium mb-1">Technical Analysis Basics</h3>
                          <p className="text-xs text-muted-foreground mb-2">Master the fundamentals of chart analysis</p>
                          <div className="text-xs text-muted-foreground">15 min watch</div>
                        </div>

                        <div className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                          <div className="flex items-center mb-3">
                            <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-2">
                              <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">COURSE</span>
                          </div>
                          <h3 className="font-medium mb-1">Risk Management Strategies</h3>
                          <p className="text-xs text-muted-foreground mb-2">Learn to protect your investments</p>
                          <div className="text-xs text-muted-foreground">5 lessons</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link to="/learning">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Explore Learning Center
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Customize your application preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="darkMode">Dark Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable dark mode for the application
                          </p>
                        </div>
                        <Switch
                          id="darkMode"
                          checked={settings?.dark_mode}
                          onCheckedChange={() => updateSettings({ dark_mode: !settings?.dark_mode })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="priceAlerts">Price Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about price changes
                          </p>
                        </div>
                        <Switch
                          id="priceAlerts"
                          checked={settings?.notification_preferences.price_alerts}
                          onCheckedChange={() => handleToggleNotification('price_alerts')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="orderUpdates">Order Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about your orders
                          </p>
                        </div>
                        <Switch
                          id="orderUpdates"
                          checked={settings?.notification_preferences.order_updates}
                          onCheckedChange={() => handleToggleNotification('order_updates')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="marketNews">Market News</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about market news
                          </p>
                        </div>
                        <Switch
                          id="marketNews"
                          checked={settings?.notification_preferences.market_news}
                          onCheckedChange={() => handleToggleNotification('market_news')}
                        />
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                      <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Security</h4>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <div className="font-medium">Two-Factor Authentication</div>
                              <p className="text-sm text-muted-foreground">
                                Add an extra layer of security to your account
                              </p>
                            </div>
                            <Button variant="outline" size="sm" disabled>
                              <Lock className="h-4 w-4 mr-2" />
                              Enable
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-1">Account Management</h4>
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <div className="font-medium">Reset Account</div>
                              <p className="text-sm text-muted-foreground">
                                Reset your account balance, investments, and activity history
                              </p>
                            </div>
                            <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Reset
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reset your account?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    <div className="space-y-4">
                                      <p>
                                        This action will reset your account to its initial state. The following data will be erased:
                                      </p>
                                      <ul className="list-disc pl-5 space-y-1">
                                        <li>Account balance will be set to zero</li>
                                        <li>All investments will be removed</li>
                                        <li>Watchlist items will be cleared</li>
                                        <li>Transaction history will remain but marked as reset</li>
                                      </ul>
                                      <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-md p-3 flex items-start">
                                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-amber-800 dark:text-amber-300">
                                          This action cannot be undone. Your profile information and settings will be preserved.
                                        </p>
                                      </div>
                                    </div>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleResetAccount}
                                    disabled={isResetting}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    {isResetting ? (
                                      <>
                                        <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent animate-spin"></div>
                                        Resetting...
                                      </>
                                    ) : (
                                      "Reset Account"
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>

                          <div className="flex items-center justify-between py-2">
                            <div>
                              <div className="font-medium">Deactivate Account</div>
                              <p className="text-sm text-muted-foreground">
                                Temporarily disable your account
                              </p>
                            </div>
                            <Button variant="outline" size="sm" disabled>
                              Deactivate
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-1">Support</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="justify-start" asChild>
                              <a href="#" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Terms of Service
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" className="justify-start" asChild>
                              <a href="#" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Privacy Policy
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" className="justify-start" asChild>
                              <a href="#" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Contact Support
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" className="justify-start" asChild>
                              <a href="#" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Help Center
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verification">
                <Card>
                  <CardHeader>
                    <CardTitle>KYC Verification</CardTitle>
                    <CardDescription>Complete your identity verification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {kycVerified ? (
                      <div className="flex flex-col items-center justify-center p-6 space-y-6">
                        <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-xl font-semibold">Verification Successful</h3>
                          <p className="text-muted-foreground">
                            Your identity has been verified successfully. You now have full access to all features.
                          </p>
                        </div>

                        <div className="w-full max-w-md bg-muted/50 rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                                <BadgeCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="font-medium">Verification Status</span>
                            </div>
                            <span className="text-green-600 font-medium">Verified</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="font-medium">PAN Number</span>
                            </div>
                            <span className="font-medium">{panNumber}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                                <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="font-medium">Mobile Number</span>
                            </div>
                            <span className="font-medium">{mobileNumber}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center space-x-2 text-sm bg-muted p-2 rounded-md">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span>Verified on {new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-muted p-4 rounded-md mb-6">
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                            <div>
                              <h4 className="font-medium mb-1">Why verify your identity?</h4>
                              <p className="text-sm text-muted-foreground">
                                Verification is required to comply with financial regulations and to protect your account.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="panNumber">PAN Number</Label>
                            <Input
                              id="panNumber"
                              value={panNumber}
                              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                              placeholder="ABCDE1234F"
                              maxLength={10}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Enter your 10-character Permanent Account Number
                            </p>
                          </div>

                          <div>
                            <Label htmlFor="mobileNumber">Mobile Number</Label>
                            <Input
                              id="mobileNumber"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                              placeholder="9876543210"
                              type="tel"
                              maxLength={10}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              We'll send a verification code to this number
                            </p>
                          </div>

                          <Button
                            onClick={handleVerifyKyc}
                            disabled={isKycSubmitting || !panNumber || !mobileNumber}
                            className="w-full mt-4"
                          >
                            {isKycSubmitting ? (
                              <>
                                <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent animate-spin"></div>
                                Verifying...
                              </>
                            ) : (
                              <>
                                Verify Identity
                                <ChevronRight className="h-4 w-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default UserProfile;

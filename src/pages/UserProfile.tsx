
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/use-user-settings';
import Navigation from '@/components/Navigation';
import AnimatedTransition from '@/components/AnimatedTransition';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Pencil, Save, AlertCircle, Check, Shield, ChevronRight } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  const { settings, updateSettings, isLoading } = useUserSettings();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // KYC verification states
  const [panNumber, setPanNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isKycSubmitting, setIsKycSubmitting] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);

  React.useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
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
    
    // Simulate verification delay
    setTimeout(() => {
      setKycVerified(true);
      setIsKycSubmitting(false);
      
      toast({
        title: "Verification successful",
        description: "Your identity has been verified successfully",
      });
    }, 2000);
  };

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
            
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid grid-cols-3 max-w-md">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="verification">KYC</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Profile Information</span>
                      {!isEditing ? (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      )}
                    </CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarUrl} alt={fullName} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {fullName ? fullName.charAt(0).toUpperCase() : <User />}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button variant="outline" disabled>
                          Change Avatar
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)} 
                          disabled={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={email} 
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Email cannot be changed
                        </p>
                      </div>
                      
                      {isEditing && (
                        <Button 
                          onClick={updateProfile} 
                          disabled={isSaving}
                          className="mt-2"
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
                      )}
                    </div>
                  </CardContent>
                </Card>
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
                      <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
                        <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
                        </div>
                        <h3 className="text-xl font-semibold">Verification Successful</h3>
                        <p className="text-muted-foreground">
                          Your identity has been verified successfully. You now have full access to all features.
                        </p>
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

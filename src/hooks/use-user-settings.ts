
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface UserSettings {
  id: string;
  user_id: string;
  dark_mode: boolean;
  notification_preferences: {
    price_alerts: boolean;
    order_updates: boolean;
    market_news: boolean;
  };
  kyc_data?: {
    verified: boolean;
    pan_number: string;
    mobile_number: string;
    verified_at: string;
  };
  created_at: string;
  updated_at: string;
}

export const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      // Parse the notification_preferences to ensure it's an object with the expected structure
      let notificationPrefs = {
        price_alerts: true,
        order_updates: true,
        market_news: true
      };

      // Try to parse the notification_preferences if it's a string
      if (typeof data.notification_preferences === 'string') {
        try {
          const parsedPrefs = JSON.parse(data.notification_preferences);
          // Ensure we have the expected structure but preserve any additional fields
          notificationPrefs = {
            price_alerts: parsedPrefs.price_alerts !== undefined ? Boolean(parsedPrefs.price_alerts) : true,
            order_updates: parsedPrefs.order_updates !== undefined ? Boolean(parsedPrefs.order_updates) : true,
            market_news: parsedPrefs.market_news !== undefined ? Boolean(parsedPrefs.market_news) : true,
            // Preserve kyc_data if it exists
            ...(parsedPrefs.kyc_data ? { kyc_data: parsedPrefs.kyc_data } : {})
          };
        } catch (e) {
          console.error('Error parsing notification preferences:', e);
        }
      } else if (data.notification_preferences && typeof data.notification_preferences === 'object') {
        // If it's already an object, use it but ensure all expected properties exist
        const prefs = data.notification_preferences as Record<string, any>;
        notificationPrefs = {
          price_alerts: prefs.price_alerts !== undefined ? Boolean(prefs.price_alerts) : true,
          order_updates: prefs.order_updates !== undefined ? Boolean(prefs.order_updates) : true,
          market_news: prefs.market_news !== undefined ? Boolean(prefs.market_news) : true,
          // Preserve kyc_data if it exists
          ...(prefs.kyc_data ? { kyc_data: prefs.kyc_data } : {})
        };
      }

      // Create the user settings object with properly typed notification preferences
      const userSettings: UserSettings = {
        ...data,
        dark_mode: data.dark_mode === true, // ensure boolean
        notification_preferences: notificationPrefs
      };

      console.log('User settings loaded:', userSettings);
      console.log('KYC data:', userSettings.notification_preferences.kyc_data);

      setSettings(userSettings);

      // Apply dark mode setting
      if (userSettings.dark_mode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user || !settings) return { success: false };

    console.log('Updating settings with:', newSettings);

    try {
      // Prepare the update data
      const updateData = {
        ...newSettings,
        updated_at: new Date().toISOString(),
      };

      console.log('Update data being sent to Supabase:', updateData);

      const { error } = await supabase
        .from('user_settings')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating settings:', error);
        toast({
          variant: "destructive",
          title: "Failed to update settings",
          description: error.message,
        });
        return { success: false };
      }

      // Update local state
      const updatedSettings = {
        ...settings,
        ...newSettings,
        updated_at: new Date().toISOString(),
      };

      console.log('Updated settings in local state:', updatedSettings);
      setSettings(updatedSettings);

      // Apply dark mode setting if changed
      if (newSettings.dark_mode !== undefined) {
        if (newSettings.dark_mode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      toast({
        title: "Settings updated",
        description: "Your preferences have been saved",
      });

      return { success: true };
    } catch (error) {
      console.error('Update settings error:', error);
      toast({
        variant: "destructive",
        title: "Failed to update settings",
        description: "An unexpected error occurred",
      });
      return { success: false };
    }
  };

  const toggleDarkMode = async () => {
    if (!settings) return;
    return updateSettings({ dark_mode: !settings.dark_mode });
  };

  useEffect(() => {
    if (user) {
      fetchSettings();
    } else {
      setSettings(null);
      setIsLoading(false);
    }
  }, [user]);

  return {
    settings,
    isLoading,
    updateSettings,
    toggleDarkMode,
  };
};


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

      // Convert the JSON notification_preferences to the expected structure
      const userSettings: UserSettings = {
        ...data,
        dark_mode: data.dark_mode === true, // ensure boolean
        notification_preferences: {
          price_alerts: data.notification_preferences?.price_alerts === true,
          order_updates: data.notification_preferences?.order_updates === true,
          market_news: data.notification_preferences?.market_news === true
        }
      };

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
    
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({
          ...newSettings,
          updated_at: new Date().toISOString(),
        })
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
      setSettings({
        ...settings,
        ...newSettings,
        updated_at: new Date().toISOString(),
      });
      
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

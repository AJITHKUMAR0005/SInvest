import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Mock learning resources from Learning.tsx
const TOTAL_RESOURCES = 8;

export interface LearningProgress {
  completedResources: number;
  totalResources: number;
  completionPercentage: number;
  lastAccessedResource?: string;
  lastAccessedDate?: string;
  favoriteTopics: string[];
}

export const useLearningProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LearningProgress>({
    completedResources: 0,
    totalResources: TOTAL_RESOURCES,
    completionPercentage: 0,
    favoriteTopics: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchLearningProgress = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // In a real app, this would fetch from a learning_progress table
      // For this demo, we'll simulate progress with mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - in a real app, this would come from the database
      const completedResources = Math.floor(Math.random() * (TOTAL_RESOURCES + 1));
      const completionPercentage = (completedResources / TOTAL_RESOURCES) * 100;
      
      const mockProgress: LearningProgress = {
        completedResources,
        totalResources: TOTAL_RESOURCES,
        completionPercentage,
        lastAccessedResource: completedResources > 0 ? 'Stock Market Basics' : undefined,
        lastAccessedDate: completedResources > 0 ? new Date().toISOString() : undefined,
        favoriteTopics: ['Investing Basics', 'Technical Analysis', 'Risk Management'],
      };
      
      setProgress(mockProgress);
    } catch (error) {
      console.error('Error fetching learning progress:', error);
      toast({
        variant: "destructive",
        title: "Failed to load learning progress",
        description: "An error occurred while loading your learning progress",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetLearningProgress = async () => {
    if (!user) return { success: false };
    
    try {
      // In a real app, this would reset the user's learning progress in the database
      // For this demo, we'll just reset our local state
      
      const resetProgress: LearningProgress = {
        completedResources: 0,
        totalResources: TOTAL_RESOURCES,
        completionPercentage: 0,
        favoriteTopics: [],
      };
      
      setProgress(resetProgress);
      
      return { success: true };
    } catch (error) {
      console.error('Error resetting learning progress:', error);
      return { success: false };
    }
  };

  useEffect(() => {
    if (user) {
      fetchLearningProgress();
    } else {
      setProgress({
        completedResources: 0,
        totalResources: TOTAL_RESOURCES,
        completionPercentage: 0,
        favoriteTopics: [],
      });
      setIsLoading(false);
    }
  }, [user]);

  return {
    progress,
    isLoading,
    resetLearningProgress,
  };
};

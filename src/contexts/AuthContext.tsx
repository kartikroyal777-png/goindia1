import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

const PLAN_LIMITS = {
  free: {
    food_scanner: 10,
    trip_planner: 10,
  },
  paid: {
    food_scanner: 300,
    trip_planner: Infinity,
  },
};

type Feature = 'food_scanner' | 'trip_planner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => void;
  isAdmin: boolean;
  canUseFeature: (feature: Feature) => boolean;
  incrementFeatureUsage: (feature: Feature) => Promise<void>;
  upgradeToPaid: () => Promise<{ error: any }>;
  isUpgradeModalOpen: boolean;
  showUpgradeModal: (show: boolean) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isAdmin = user?.email === 'kartikroyal777@gmail.com';

  const fetchProfile = useCallback(async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (event === 'SIGNED_IN' && currentUser) {
        await fetchProfile(currentUser);
      }
      if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile]);
  
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const canUseFeature = (feature: Feature): boolean => {
    if (isAdmin) return true;
    if (!profile) return false;
    
    const limit = PLAN_LIMITS[profile.plan_type][feature];
    const usageKey = feature === 'food_scanner' ? 'food_scanner_used' : 'trip_planner_used';
    const used = profile[usageKey] || 0;
    
    return used < limit;
  };

  const incrementFeatureUsage = async (feature: Feature) => {
    if (!profile || !user) return;
    if (!canUseFeature(feature)) return;

    const usageKey = feature === 'food_scanner' ? 'food_scanner_used' : 'trip_planner_used';
    const newCount = (profile[usageKey] || 0) + 1;

    const { error } = await supabase
      .from('profiles')
      .update({ [usageKey]: newCount })
      .eq('id', user.id);
    
    if (!error) {
      setProfile(prev => prev ? { ...prev, [usageKey]: newCount } : null);
    } else {
      console.error(`Error incrementing ${feature} usage:`, error);
    }
  };
  
  const upgradeToPaid = async () => {
    if (!user) return { error: 'User not logged in' };
    
    const { error } = await supabase
      .from('profiles')
      .update({ plan_type: 'paid' })
      .eq('id', user.id);
      
    if (!error) {
      await refreshProfile();
    }
    
    return { error };
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut: () => supabase.auth.signOut(),
    isAdmin,
    canUseFeature,
    incrementFeatureUsage,
    upgradeToPaid,
    isUpgradeModalOpen,
    showUpgradeModal: setIsUpgradeModalOpen,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

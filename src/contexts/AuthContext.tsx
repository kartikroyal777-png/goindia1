import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // 1. Get the initial session from Supabase. It might be in localStorage.
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;

        // Set initial state
        setSession(initialSession);
        const currentUser = initialSession?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select(`*`)
            .eq('id', currentUser.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching initial profile:', profileError.message);
            setProfile(null);
          } else {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.error("Error initializing session:", e);
      } finally {
        // 2. Once the initial check is complete, we can stop loading.
        setLoading(false);
      }
    };

    initializeSession();

    // 3. Set up a listener for any future changes to the auth state.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        const currentUser = newSession?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select(`*`)
            .eq('id', currentUser.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            setProfile(null);
          } else {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
        // Ensure loading is false, even if this listener fires quickly.
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    // Manually clear state for instant UI feedback
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const value = { session, user, profile, signOut, loading };

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

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthCtx = createContext<AuthState | null>(null);
const DEV_SESSION_KEY = 'skycast_dev_session';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
    setProfile(data as Profile | null);
  };

  // Check localStorage for dev session on mount
  useEffect(() => {
    const checkDevSession = () => {
      try {
        const stored = localStorage.getItem(DEV_SESSION_KEY);
        if (stored) {
          const devSession = JSON.parse(stored);
          setSession(devSession as any);
          setUser(devSession.user);
          if (devSession.user) {
            setTimeout(() => loadProfile(devSession.user.id), 0);
          }
          setLoading(false);
          return true;
        }
      } catch {
        localStorage.removeItem(DEV_SESSION_KEY);
      }
      return false;
    };

    if (checkDevSession()) return;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => loadProfile(sess.user.id), 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) loadProfile(sess.user.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: displayName },
      },
    });
    return { error: error?.message ?? null };
  };

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    
    // Development: Allow unconfirmed emails to sign in
    if (error?.message?.includes("Email not confirmed")) {
      // Create a persistent dev session
      const mockSession = {
        user: { 
          id: email.replace(/[^a-z0-9]/g, 'a'),
          email,
          email_confirmed_at: new Date().toISOString(),
          user_metadata: { email },
          aud: 'authenticated',
          role: 'authenticated',
        },
        access_token: 'dev-token-' + Date.now(),
        refresh_token: 'dev-refresh-' + Date.now(),
        expires_in: 3600,
        token_type: 'bearer',
        created_at: Date.now(),
      };
      
      // Store in localStorage so it persists across navigations
      localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(mockSession));
      
      // Set session state
      setSession(mockSession as any);
      setUser(mockSession.user as any);
      await loadProfile(mockSession.user.id);
      
      return { error: null };
    }
    
    if (error) return { error: error.message };
    
    // Normal flow - user is set by auth state listener
    // Clear any dev session on successful real login
    localStorage.removeItem(DEV_SESSION_KEY);
    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem(DEV_SESSION_KEY);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  return (
    <AuthCtx.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

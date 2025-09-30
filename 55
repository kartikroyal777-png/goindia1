import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Crown } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/', { replace: true });
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1617594232302-702374dfce36?q=80&w=1974&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-semibold text-white drop-shadow-lg">
            Go <span className="text-orange-300">India</span>
          </h1>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#FF6F00',
                    brandAccent: '#E65100',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#FFFFFF',
                    defaultButtonBackgroundHover: '#F7FAFC',
                    defaultButtonBorder: '#E2E8F0',
                    defaultButtonText: '#2D3748',
                    dividerBackground: '#E2E8F0',
                    inputBackground: '#FFFFFF',
                    inputBorder: '#CBD5E0',
                    inputBorderHover: '#FF6F00',
                    inputBorderFocus: '#FF6F00',
                    inputText: '#2D3748',
                    inputLabelText: '#4A5568',
                    inputPlaceholder: '#A0AEC0',
                    messageText: '#4A5568',
                    messageTextDanger: '#E53E3E',
                  },
                  space: {
                    spaceSmall: '4px',
                    spaceMedium: '8px',
                    spaceLarge: '16px',
                    labelBottomMargin: '8px',
                    anchorBottomMargin: '8px',
                    emailInputSpacing: '8px',
                    socialAuthSpacing: '8px',
                    buttonPadding: '10px 15px',
                    inputPadding: '10px 15px',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                    baseInputSize: '14px',
                    baseLabelSize: '14px',
                    baseButtonSize: '14px',
                  },
                  fonts: {
                    bodyFontFamily: 'Inter, sans-serif',
                    buttonFontFamily: 'Inter, sans-serif',
                    inputFontFamily: 'Inter, sans-serif',
                    labelFontFamily: 'Inter, sans-serif',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
            }}
            providers={['google', 'github']}
            theme="light"
            socialLayout="horizontal"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

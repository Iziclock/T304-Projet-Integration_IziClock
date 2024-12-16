import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Iziclock',
  webDir: 'www', 
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '225023011540-dt7tsd29djafhnfd3p84k3rk4dlja0pi.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;

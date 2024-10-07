import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.centrebenevoleabc.mobile',
  appName: 'Centre ABC',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 1000,
      androidSplashResourceName: "splash",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      backgroundColor: "#A40046"

    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
  }
};

export default config;

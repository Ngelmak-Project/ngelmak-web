import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.ngelmak.web',
  appName: 'Ngelmak',
  webDir: 'dist/ngelmak-web/browser',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000, // Show for 2 seconds
      launchAutoHide: true, // Auto hide after duration
      backgroundColor: '#000000',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
